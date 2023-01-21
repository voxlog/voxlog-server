import { DateTime } from 'luxon';
import { db, sql } from '../lib/database/connector';
import { UserCreateIn, UserOut } from './dtos';
import cuid from 'cuid';''

export async function getPassword(username: string): Promise<string> {
  try {
    const password: any[] = await db.$queryRaw(sql`SELECT "getPassword"(${username})`);
    return password[0].getPassword;
  } catch (error) {
    throw error;
  }
}

export async function create(user: UserCreateIn): Promise<UserOut | null> {
  try {
    const birthDate = DateTime.fromFormat(user.birthDate, 'yyyy-MM-dd').toJSDate();

    // const affectedRows: any = await db.$executeRaw(
    //   sql`INSERT INTO "User" ("userId", "username", "email", "password", "birthDate", "bio", "realName") VALUES (${cuid()}, ${
    //     user.username
    //   }, ${user.email}, ${user.password}, ${birthDate}, ${user.bio}, ${user.realName});`,
    // );

    const affectedRows: any = await db.$executeRaw(
      sql`
      Call "createUser"(${user.username}, ${user.email}, ${user.password}, ${birthDate}, ${user.bio}, ${user.realName});
      `);

    if (affectedRows < 1) return null;
    return getByUsername(user.username);
  } catch (error) {
    throw error;
  }
}

export async function getByUsername(username: string): Promise<UserOut | null> {
  try {
    
    const user: UserOut[] = await db.$queryRaw<UserOut[]>(
      sql`SELECT "getByUsername"(${username});`,
    );

    if (!user) return null;
    return user[0];
  } catch (error) {
    throw error;
  }
}

export async function getListeningStats(username: string): Promise<any> {
  return;
}

export async function getRecentScrobbles(username: string, quantity: number): Promise<any> {
  try {
  //   const tracksInMostRecentOrder: any[] = await db.$queryRaw(sql`
  //   SELECT "Track"."trackId" as "trackId", "Track"."title" as "trackTitle",
  //   "Album"."coverArtUrl" AS "albumCoverArtUrl", \
  //   "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", \
  //   "Scrobble"."createdAt" as "scrobbleCreatedAt" \
  //   FROM "Scrobble" \
  //   INNER JOIN "Track" ON "Scrobble"."trackId" = "Track"."trackId" \
  //   INNER JOIN "Album" ON "Track"."albumId" = "Album"."albumId" \
  //   INNER JOIN "Artist" ON "Album"."artistId" = "Artist"."artistId" \
  //   WHERE "Scrobble"."userId" = (SELECT "userId" FROM "User" WHERE "username" = ${username} LIMIT 1) \
  //   ORDER BY "Scrobble"."createdAt" DESC \
  //   LIMIT ${quantity}
  // `);

    const tracksInMostRecentOrder: any[] = await db.$queryRaw(sql`
      SELECT "getRecentScrobbles"(${username}, ${quantity});
    `);

    const tracks = tracksInMostRecentOrder.map((track) => {
      return {
        scrobbleCreatedAt: track.scrobbleCreatedAt,
        track: {
          trackId: track.trackId,
          trackTitle: track.trackTitle,
          coverArtUrl: track.coverArtUrl,
        },
        album: {
          coverArtUrl: track.albumCoverArtUrl,
        },
        artist: {
          artistId: track.artistId,
          name: track.artistName,
        },
      };
    });

    return tracks;
  } catch (error) {
    throw error;
  }
}

export async function searchByName(username: string): Promise<UserOut[]> {
  return [];
}
