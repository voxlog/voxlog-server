import * as scrobblesRepository from './repository';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';
import { getTrack } from '../lib/wrapper/spotify/handler';

export async function createSpotifyScrobble(scrobble: SpotifyScrobble) {
  try {
    const trackDataRaw = await getTrack(scrobble.spIdTrack);
    let artistName: string;

    // Do a MusicBrainz lookup to try and find the artist
    

    const createdScrobble = await scrobblesRepository.createSpotifyScrobble(scrobble);
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