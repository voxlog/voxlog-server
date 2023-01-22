import { db, sql } from '../lib/database/connector';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';

export async function createSpotifyScrobble(scrobble: SpotifyScrobble): Promise<any> {
  console.log(scrobble)

  return true;
}

export async function createMusicBrainzScrobble(scrobble: MusicBrainzScrobble): Promise<any> {

  return;
}

export async function createSimpleScrobble(scrobble: SimpleScrobble): Promise<any> {

  return;
}
