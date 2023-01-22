import { db, sql } from '../lib/database/connector';
import {
  MusicBrainzScrobble,
  SimpleScrobble,
  ScrobbleCreateSchema,
  ScrobbleCreate,
  ScrobbleCreateOut,
  ScrobbleCreateOutSchema,
} from './dtos';

export async function createSpotifyScrobble(scrobble: ScrobbleCreate): Promise<any> {
  const createdScrobble = await db.scrobble.create({
    data: ScrobbleCreateSchema.parse(scrobble),
  });

  const scrobbleOut = {
    ...createdScrobble,
    createdAt: createdScrobble.createdAt.toISOString(),
  };

  return ScrobbleCreateOutSchema.parse(scrobbleOut);
}

export async function createMusicBrainzScrobble(scrobble: MusicBrainzScrobble): Promise<any> {
  const createdScrobble = await db.scrobble.create({
    data: ScrobbleCreateSchema.parse(scrobble),
  });

  const scrobbleOut = {
    ...createdScrobble,
    createdAt: createdScrobble.createdAt.toISOString(),
  };
  return;
}

export async function createSimpleScrobble(scrobble: SimpleScrobble): Promise<any> {
  const createdScrobble = await db.scrobble.create({
    data: ScrobbleCreateSchema.parse(scrobble),
  });

  const scrobbleOut = {
    ...createdScrobble,
    createdAt: createdScrobble.createdAt.toISOString(),
  };
  return;
}
