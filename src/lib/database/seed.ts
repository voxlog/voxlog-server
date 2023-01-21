import { PrismaClient } from '@prisma/client';
import { db, sql } from './connector';

const prisma = new PrismaClient();

async function main() {
  
  await db.$queryRawUnsafe(
    `CREATE OR REPLACE PROCEDURE "createUser"( \
      "usernameIn" VarChar(16), \ 
      "emailIn" VarChar(100), \
      "passwordIn" Char(60), \
      "birthDateIn" Date, \
      "bioIn" VarChar(140), \
      "realNameIn" VarChar(128) \ 
    )	language plpgsql as $$\
    begin \
      INSERT INTO "User" (username, email, password, "birthDate", bio, "realName") \
      Values("usernameIn", "emailIn", "passwordIn", "birthDateIn", "bioIn", "realNameIn"); \
    end; $$;
    `,
  );

  
  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getPassword"(usernameIn varchar(16)) returns table( \
      password char(60) \
    ) AS $$ \
    Begin \
      RETURN QUERY SELECT "User".password FROM "User" WHERE "User".username = usernameIn LIMIT 1; \
    end; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getByUsername"(usernameIn VARCHAR(16)) RETURNS table ( \
      username Varchar(16), \
      email VARCHAR(100), \
      "birthDate" Date, \
      bio VarChar(140), \
      "realName" VarChar(128), \
      "profilePictureUrl" VarChar(2048), \
      "artistsRange" "text", \
      "albumsRange" "text", \
      "tracksRange" "text", \
      "createdAt" Timestamp(0), \
  	  "updatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT \
          "User".username, "User".email, "User"."birthDate", "User".bio, "User"."realName", \
          "User"."profilePictureUrl", "User"."artistsRange", "User"."tracksRange", \
          "User"."createdAt", "User"."updatedAt" \
          FROM "User" WHERE "User".username = usernameIn LIMIT 1; \
    end; $$ LANGUAGE plpgsql;  
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getRecentScrobbles"(usernameIn VARCHAR(16), quantity INT) RETURNS table ( \
      "trackId" uuid, \
      "trackTitle" VarChar(512), \
      "albumCoverArtUrl" VarChar(2048), \
      "artistId" uuid, \
      "artistName" VarChar(256), \
      "scrobbleCreatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT "Track"."trackId" as "trackId", "Track"."title" as "trackTitle",
    "Album"."coverArtUrl" AS "albumCoverArtUrl", \
    "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", \
    "Scrobble"."createdAt" as "scrobbleCreatedAt" \
    FROM "Scrobble" \
    INNER JOIN "Track" ON "Scrobble"."trackId" = "Track"."trackId" \
    INNER JOIN "Album" ON "Track"."albumId" = "Album"."albumId" \
    INNER JOIN "Artist" ON "Album"."artistId" = "Artist"."artistId" \
    WHERE "Scrobble"."userId" = (SELECT "userId" FROM "User" WHERE "username" = usernameIn LIMIT 1) \
    ORDER BY "Scrobble"."createdAt" DESC \
    LIMIT quantity; \
    end; $$ LANGUAGE plpgsql;
    `,
  );

  // await db.$queryRawUnsafe(
  //   `CREATE OR REPLACE FUNCTION getRecentScrobbles(usernameIn VARCHAR(16), quantity INT) RETURNS table ( \
  //     "trackId" uuid, \
  //     title VarChar(512), \
  //     "coverArtUrl" VarChar(2048), \
  //     "durationInSeconds", \
  //     "albumId" ,
  //     "albumTitle" , 
  //     "albumCoverArtUrl" , 
  //     "artistId" uuid, \
  //     "artistName" VarChar(256), \
  //     "artistArtUrl" , 
  //     "scrobbleCreatedAt" Timestamp(0), \
  //   ) AS $$ \
  //   BEGIN \
  //     RETURN Query SELECT "Track"."trackId", "Track"."title", "Track"."coverArtUrl", "Track"."durationInSeconds", "Track"."albumId", \
  //     "Album"."albumId" as "albumId", "Album"."title" AS "albumTitle", "Album"."coverArtUrl" AS "albumCoverArtUrl", \
  //     "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", "Artist"."artUrl" AS "artistArtUrl" \
  //     FROM "Track" \
  //     INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
  //     INNER JOIN "Artist" ON "Artist"."artistId" = "Album"."artistId" \
  //     WHERE "trackId" = ${trackId} LIMIT 1;
  //   `,
  // );
  
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
