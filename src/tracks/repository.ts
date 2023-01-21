import { Track as PTrack } from '@prisma/client';

import { db, sql } from '../lib/database/connector';
import { TrackOut } from './dtos';

export async function searchByName(trackName: string): Promise<TrackOut[]> {
  const spacedTrackName = trackName.replace(' ', ' & ');
  const tracks: PTrack[] = await db.track.findMany({
    where: {
      trackTitle: {
        search: spacedTrackName,
      },
    },
    include: {
      inAlbum: {
        include: {
          fromArtist: true,
        },
      },
    },
  });

  return tracks;
}

export async function create(trackId: string): Promise<TrackOut | null> {
  // const trackData = await db.$queryRaw(sql`
  //   SELECT "Track"."trackId", "Track"."title", "Track"."coverArtUrl", "Track"."durationInSeconds", "Track"."albumId", \
  //   "Album"."albumId" as "albumId", "Album"."title" AS "albumTitle", "Album"."coverArtUrl" AS "albumCoverArtUrl", \
  //   "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", "Artist"."artUrl" AS "artistArtUrl" \
  //   FROM "Track" \
  //   INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
  //   INNER JOIN "Artist" ON "Artist"."artistId" = "Album"."artistId" \
  //   WHERE "trackId" = ${trackId} LIMIT 1;
  //   `);
  return null;
}

export async function getById(trackId: string): Promise<TrackOut | null> {
  const trackData = await db.$queryRaw(sql`
    SELECT "Track"."trackId", "Track"."title", "Track"."coverArtUrl", "Track"."durationInSeconds", "Track"."albumId", \
    "Album"."albumId" as "albumId", "Album"."title" AS "albumTitle", "Album"."coverArtUrl" AS "albumCoverArtUrl", \
    "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", "Artist"."artUrl" AS "artistArtUrl" \
    FROM "Track" \
    INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
    INNER JOIN "Artist" ON "Artist"."artistId" = "Album"."artistId" \
    WHERE "trackId" = ${trackId} LIMIT 1;
    `);

  // const track: Track = {
  //   trackId: trackData[0].trackId,
  //   title: trackData[0].title,
  //   coverArtUrl: trackData[0].coverArtUrl,
  //   durationInSeconds: trackData[0].durationInSeconds,
  //   album: {
  //     albumId: trackData[0].albumId,
  //     title: trackData[0].albumTitle,
  //     coverArtUrl: trackData[0].albumCoverArtUrl,
  //   },
  //   artist: {
  //     artistId: trackData[0].artistId,
  //     name: trackData[0].artistName,
  //     artUrl: trackData[0].artistArtUrl,
  //   },
  // };
  // return track;
  return null;
}

export async function getPopular(quantity: number): Promise<TrackOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}
