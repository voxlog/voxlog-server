import { db, sql } from '../lib/database/connector';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';

export async function createSpootifyScrobble(scrobble: SpotifyScrobble): Promise<any> {
  // const user: User = await db.user.findUnique({

  // });

  // const scrobble: Scrobble = await db.track.create({
  //   data: {
  //     userId:
  //     user: where username: scrobbleData,
  //     createdAt:
  //     trackId:
  //     track:
  //   },
  // });

  return;
}

export async function createMusicBrainzScrobble(scrobble: MusicBrainzScrobble): Promise<any> {
  // const user: User = await db.user.findUnique({

  // });

  // const scrobble: Scrobble = await db.track.create({
  //   data: {
  //     userId:
  //     user: where username: scrobbleData,
  //     createdAt:
  //     trackId:
  //     track:
  //   },
  // });

  return;
}

export async function createSimplesScrobble(scrobble: SimpleScrobble): Promise<any> {
  // const user: User = await db.user.findUnique({

  // });

  // const scrobble: Scrobble = await db.track.create({
  //   data: {
  //     userId:
  //     user: where username: scrobbleData,
  //     createdAt:
  //     trackId:
  //     track:
  //   },
  // });

  return;
}
