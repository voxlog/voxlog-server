import * as scrobblesRepository from './repository';
import { 
  create as createArtist, 
  getBySpotifyId as getArtistBySpId, 
  updateMbId as updateArtistMbId 
} from '../artists/repository';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';
import { getTrack, getArtist } from '../lib/wrapper/spotify/handler';
import { getRecordingByIsrc } from '../lib/wrapper/musicbrainz/handler';

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
        // If it's only one artist, it's safe to assume it's the correct one
        if (recordingList._attributes.count == 1 && recordingList.recording['artist-credit']['name-credit'].length == undefined){
          const artistMbId = recordingList.recording['artist-credit']['name-credit']['artist']._attributes.id;
          const artistMbName = recordingList.recording['artist-credit']['name-credit']['artist'].name._text;
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

    console.log(artist)

    // TODO: check if artist with mbId exists in the database

    // ALBUM

    
    const scrobbleData = {
      ...scrobble,
      ...trackData,
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