import * as scrobblesRepository from './repository';
import { 
  create as createArtist, 
  getBySpotifyId as getArtistBySpId, 
  updateMbId as updateArtistMbId 
} from '../artists/repository';
import {
  create as createAlbum,
  getBySpotifyId as getAlbumBySpId
} from '../albums/repository';
import {
  create as createTrack,
  getBySpotifyId as getTrackBySpId
} from '../tracks/repository';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';
import { getTrack, getArtist } from '../lib/wrapper/spotify/handler';
import { getRecordingByIsrc } from '../lib/wrapper/musicbrainz/handler';
import { compareTwoStrings } from 'string-similarity';

export async function createSpotifyScrobble(scrobble: SpotifyScrobble) {
  try {
    const trackDataRaw = await getTrack(scrobble.spIdTrack);
    let trackData: {
      trackName: string,
      spIdArtist: string,
      artistName: string,
      spIdAlbum: string,
      albumName: string,
      albumCoverUrl: string,
      artistMbid: string | null,
    } = {trackName: '', spIdArtist: '', artistName: '', spIdAlbum: '', albumName: '', albumCoverUrl: '', artistMbid: null};

    // Do a MusicBrainz lookup to try and find the artist name/mbid and track name
    if (trackDataRaw.external_ids.isrc) {
      const recordingDataRaw: any = await getRecordingByIsrc(trackDataRaw.external_ids.isrc);
      // If it's not on MusicBrainz, bail out
      if(recordingDataRaw.error === undefined) {
        let recordingList = recordingDataRaw.metadata.isrc['recording-list'];
        if(Number(recordingList._attributes.count ) > 1) {
          recordingList.recording= recordingList.recording[0];
        }
        // ISRCs are precise -- it's safe to assume it's only one track
        trackData.trackName = recordingList.recording.title._text;
        // Even if it's one artist, it's NOT safe to assume it's the album artist
        // So we check for name similarity
        let artist: any = recordingList.recording['artist-credit']['name-credit']['artist'];
        if (recordingList._attributes.count > 1)
          artist = recordingList.recording['artist-credit']['name-credit']['artist'][0];

        const artistMbId = recordingList.recording['artist-credit']['name-credit']['artist']._attributes.id;
        const artistMbName = recordingList.recording['artist-credit']['name-credit']['artist'].name._text;

        // Check if the artist name is similar to the album artist name
        const artistSpName = trackDataRaw.album.artists[0].name;
        const similarity = compareTwoStrings(artistSpName, artistMbName);
        if (similarity > 0.8) {
          trackData.artistName = artistMbName;
          trackData.artistMbid = artistMbId;
        }
      }
    }

    // If we couldn't find the artist name/mbid and track name, use the Spotify data
    if (!trackData.artistMbid) {
      // Always use album artist
      const albumArtist = trackDataRaw.album.artists[0];
      trackData.artistName = albumArtist.name;
      trackData.trackName = trackDataRaw.name;
    }

    // Fill the rest with Spotify data
    trackData.spIdArtist = trackDataRaw.album.artists[0].id;
    trackData.spIdAlbum = trackDataRaw.album.id;
    trackData.albumName = trackDataRaw.album.name;
    // First image is the biggest
    trackData.albumCoverUrl = trackDataRaw.album.images[0].url;

    // ARTIST
    // Check if the artist exists in the database
    let artist = await getArtistBySpId(trackData.spIdArtist);
    // If it doesn't, create it
    if (!artist) {
      // Get artist picture
      const artistDataRaw = await getArtist(trackData.spIdArtist);
      const artistPicUrl = artistDataRaw.images[0].url;
      // Create artist
      const artistData = {
        name: trackData.artistName,
        picUrl: artistPicUrl,
        spId: trackData.spIdArtist,
        mbId: trackData.artistMbid ? trackData.artistMbid : undefined,
      }
      artist = await createArtist(artistData);
    }
    // If it exists, but doesn't have a MusicBrainz ID, update it
    else if (!artist.mbId && trackData.artistMbid) {
      artist = await updateArtistMbId(artist.artistId, trackData.artistName, trackData.artistMbid);
    }

    // TODO: check if artist with mbId exists in the database

    // ALBUM
    // Check if the album exists in the database
    let album = await getAlbumBySpId(trackData.spIdAlbum);
    // If it doesn't, create it
    if (!album && artist) {
      const albumData = {
        title: trackData.albumName,
        artistId: artist.artistId,
        coverArtUrl: trackData.albumCoverUrl,
        spId: trackData.spIdAlbum,
      }
      album = await createAlbum(albumData);
    }

    // TRACK
    let track = await getTrackBySpId(trackDataRaw.id);
    if (!track && album && artist) {
      const trackData = {
        title: trackDataRaw.name,
        albumId: album.albumId,
        spId: trackDataRaw.id,
        duration: Math.round(trackDataRaw.duration_ms / 1000),
      }
      track = await createTrack(trackData);
    }
    
    if(!track || !album || !artist) throw "Couldn't create scrobble";

    const scrobbleData = {
      userId: scrobble.userId,
      trackId: track.trackId
    }

    const createdScrobble = await scrobblesRepository.createSpotifyScrobble(scrobbleData);
    return createdScrobble;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createMusicBrainzScrobble(scrobble: MusicBrainzScrobble) {
  try {
    const createdScrobble = await scrobblesRepository.createMusicBrainzScrobble(scrobble);
    return createdScrobble;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createSimpleScrobble(scrobble: SimpleScrobble) {
  try {
    const createdScrobble = await scrobblesRepository.createSimpleScrobble(scrobble);
    return createdScrobble;
  } catch (error) {
    console.log(error);
    throw error;
  }
}