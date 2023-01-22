import * as scrobblesRepository from './repository';
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
        const recordingList = recordingDataRaw.metadata.isrc['recording-list'];
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

    // We won't look for the artist picture here, since it would take another API call
    // and maybe it won't be necessary if the artist is already in the database.
    
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