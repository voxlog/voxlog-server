import { PrismaClient } from '@prisma/client';
import { db, sql } from './connector';

const prisma = new PrismaClient();

async function main() {
  await db.$queryRawUnsafe(
    `CREATE OR REPLACE PROCEDURE "createArtist"( \
      "nameIn" VarChar(256), \ 
      "picUrlIn" VarChar(2048), \
      "mbIdIn" VarChar(36) default null, \
      "spIdIn" VarChar(22) default null \
    )	language plpgsql as $$ \
    begin \
      INSERT INTO "Artist" (name, "picUrl", "mbId", "spId") \
      Values("nameIn", "picUrlIn", "mbIdIn", "spIdIn"); \
    end; $$;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE PROCEDURE "createUser"( \
      "usernameIn" VarChar(16), \ 
      "emailIn" VarChar(100), \
      "passwordIn" Char(60), \
      "birthDateIn" Date, \
      "bioIn" VarChar(140), \
      "realNameIn" VarChar(128) \ 
    )	language plpgsql as $$ \
    begin \
      INSERT INTO "User" (username, email, password, "birthDate", bio, "realName") \
      Values("usernameIn", "emailIn", "passwordIn", "birthDateIn", "bioIn", "realNameIn"); \
    end; $$;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE PROCEDURE "createAlbum"( \
      "titleIn" VarChar(256), \ 
      "artistId" uuid, \
      "coverArtUrlIn" VarChar(2048), \
      "mbIdIn" VarChar(36) default null, \
      "spIdIn" VarChar(22) default null \
    )	language plpgsql as $$ \
    begin \
      INSERT INTO "Album" (title, "coverArtUrl", "mbId", "spId") \
      Values("titleIn", "coverArtUrlIn", "mbIdIn", "spIdIn"); \
    end; $$;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE PROCEDURE "createTrack"( \
      "albumIdIn" uuid, \ 
      "titleIn" VarChar(512), \
      "durationIn" Int, \
      "spIdIn" VarChar(22) default null, \
      "mbIdIn" VarChar(36) default null \
    )	language plpgsql as $$ \
    begin \
      INSERT INTO "Track" ("AlbumId", title, "spId", "mbId", duration) \
      Values("AlbumIdIn", "titleIn", "spIdIn", "mbIdIn", "durationIn"); \
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
      "userId" text, \
      "username" Varchar(16), \
      "email" VARCHAR(100), \
      "birthDate" Date, \
      "bio" VarChar(140), \
      "realName" VarChar(128), \
      "profilePictureUrl" VarChar(2048), \
      "artistsRange" "RangePreference", \
      "albumsRange" "RangePreference", \
      "tracksRange" "RangePreference", \
      "createdAt" Timestamp(0), \
  	  "updatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT \
          "User"."userId", "User".username, "User".email, "User"."birthDate", "User".bio, "User"."realName", \
          "User"."profilePictureUrl", "User"."artistsRange", "User"."albumsRange", "User"."tracksRange", \
          "User"."createdAt", "User"."updatedAt" \
          FROM "User" WHERE "User".username = usernameIn LIMIT 1; \
    end; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getByUsername"(usernameIn VARCHAR(16)) RETURNS table ( \
      "userId" text, \
      "username" Varchar(16), \
      "email" VARCHAR(100), \
      "birthDate" Date, \
      "bio" VarChar(140), \
      "realName" VarChar(128), \
      "profilePictureUrl" VarChar(2048), \
      "artistsRange" "RangePreference", \
      "albumsRange" "RangePreference", \
      "tracksRange" "RangePreference", \
      "createdAt" Timestamp(0), \
  	  "updatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT \
          "User"."userId", "User".username, "User".email, "User"."birthDate", "User".bio, "User"."realName", \
          "User"."profilePictureUrl", "User"."artistsRange", "User"."albumsRange", "User"."tracksRange", \
          "User"."createdAt", "User"."updatedAt" \
          FROM "User" WHERE "User".username = usernameIn LIMIT 1; \
    end; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "searchUserByName"(usernameIn VARCHAR(16)) RETURNS table ( \
      "userId" text, \
      "username" Varchar(16), \
      "email" VARCHAR(100), \
      "birthDate" Date, \
      "bio" VarChar(140), \
      "realName" VarChar(128), \
      "profilePictureUrl" VarChar(2048), \
      "artistsRange" "RangePreference", \
      "albumsRange" "RangePreference", \
      "tracksRange" "RangePreference", \
      "createdAt" Timestamp(0), \
  	  "updatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT \
          "User"."userId", "User".username, "User".email, "User"."birthDate", "User".bio, "User"."realName", \
          "User"."profilePictureUrl", "User"."artistsRange", "User"."albumsRange", "User"."tracksRange", \
          "User"."createdAt", "User"."updatedAt" \
          FROM "User" WHERE "User".username = usernameIn; \
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
      "scrobbleCreatedAt" timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT "Track"."trackId" as "trackId", "Track"."title" as "trackTitle", \
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

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTrackById"(trackIdIn uuid) RETURNS table ( \
      "trackId" uuid, \
      title VarChar(512), \
      "coverArtUrl" VarChar(2048), \
      "duration" Int, \
      "albumId" uuid, \
      "albumTitle" VarChar(512), \
      "albumCoverArtUrl" VarChar(2048), \
      "artistId" uuid, \
      "artistName" VarChar(256), \
      "artistArtUrl" VarChar(2048), \
      "scrobbleCreatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT "Track"."trackId", "Track"."title", "Track"."duration", "Track"."albumId", \
    "Album"."title" AS "albumTitle", "Album"."coverArtUrl" AS "albumCoverArtUrl", \
    "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", "Artist"."picUrl" AS "picUrl" \
    FROM "Track" \
    INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
    INNER JOIN "Artist" ON "Artist"."artistId" = "Album"."artistId" \
    WHERE "trackId" = trackIdIn LIMIT 1; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "searchTrackByName"(trackTitle VarChar(512)) RETURNS table ( \
      "trackId" uuid, \
      title VarChar(512), \
      "coverArtUrl" VarChar(2048), \
      "duration" Int, \
      "albumId" uuid, \
      "albumTitle" VarChar(512), \
      "albumCoverArtUrl" VarChar(2048), \
      "artistId" uuid, \
      "artistName" VarChar(256), \
      "artistArtUrl" VarChar(2048), \
      "scrobbleCreatedAt" Timestamp(0) \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT "Track"."trackId", "Track"."title", "Track"."duration", "Track"."albumId", \
    "Album"."title" AS "albumTitle", "Album"."coverArtUrl" AS "albumCoverArtUrl", \
    "Artist"."artistId" as "artistId", "Artist"."name" AS "artistName", "Artist"."picUrl" AS "picUrl" \
    FROM "Track" \
    INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
    INNER JOIN "Artist" ON "Artist"."artistId" = "Album"."artistId" \
    WHERE "title" = trackTitle; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTotalHours"("userIdIn" VarChar(16)) RETURNS table ( \
      "totalHours" bigint \
      ) AS $$ \
      BEGIN \
      RETURN Query SELECT coalesce(Sum("Track".duration), 0) as totalHours \
      FROM "Scrobble" \
      INNER JOIN "Track" ON "Track"."trackId" = "Scrobble"."trackId" \
      WHERE "Scrobble"."userId" = "userIdIn"; \
      END; $$ LANGUAGE plpgsql;
      `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTotalHoursSimpleScrobble"("userIdIn" VarChar(16)) RETURNS table ( \
      "totalHours" bigint \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT coalesce(Sum("SimpleScrobble".duration), 0) as totalHours \
      FROM "SimpleScrobble" WHERE "SimpleScrobble"."userId" = "userIdIn"; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTotalArtist"("userIdIn" VarChar(16)) RETURNS table ( \
      "totalArtist" bigint \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT Count (Distinct "Album"."artistId") as totalArtist \
      FROM "Scrobble" \
      INNER JOIN "Track" ON "Track"."trackId" = "Scrobble"."trackId" \
      INNER JOIN "Album" ON "Album"."albumId" = "Track"."albumId" \
      WHERE "Scrobble"."userId" = "userIdIn"; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTotalAlbums"("userIdIn" VarChar(16)) RETURNS table ( \
      "totalAlbums" bigint \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT Count (Distinct "Track"."albumId") as totalAlbums \
      FROM "Scrobble" \
      INNER JOIN "Track" ON "Track"."trackId" = "Scrobble"."trackId" \
      WHERE "Scrobble"."userId" = "userIdIn"; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  await db.$queryRawUnsafe(
    `CREATE OR REPLACE FUNCTION "getTotalTracks"("userIdIn" VarChar(16)) RETURNS table ( \
      "totalTracks" bigint \
    ) AS $$ \
    BEGIN \
      RETURN Query SELECT Count (Distinct "Scrobble"."trackId") as totalTracks \
      FROM "Scrobble" \
      WHERE "Scrobble"."userId" = "userIdIn"; \
    END; $$ LANGUAGE plpgsql;
    `,
  );

  // triggers
  // console.log('before log user')
  // await db.$queryRawUnsafe(
  //   `
  //   CREATE OR REPLACE FUNCTION "logUser"() RETURNS TRIGGER AS $$ \
  //   BEGIN \
  //     IF NEW <> OLD THEN \
  //       new."updatedAt" = current_timestamp; \
  //     END IF; \
  //     RETURN NEW; \
  //   END; $$ LANGUAGE PLPGSQL;
  // `,
  // );
  console.log('before log user changes');

  await db.$queryRawUnsafe(`
      CREATE or replace TRIGGER "logUserChanges" \
      before UPDATE \
      ON "User" \
      FOR EACH ROW \
      EXECUTE PROCEDURE "logUser"();   
    `);
  console.log('before log event');
  await db.$queryRawUnsafe(
    `
    CREATE OR REPLACE FUNCTION "logEvent"() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ \
    BEGIN \
      IF NEW <> OLD THEN \
        new."updatedAt" = current_timestamp; \
      END IF; \
      RETURN NEW; \
    END; $$ 
    `,
  );
  console.log('before log events changes');
  await db.$queryRawUnsafe(`
    CREATE or replace TRIGGER "logEventChanges" \
    before UPDATE \
    ON "Event" \
    FOR EACH ROW \
    EXECUTE PROCEDURE "logEvent"();
    `);
  console.log('before log event attendee');

  await db.$queryRawUnsafe(`
      CREATE OR REPLACE FUNCTION "logEventAttendee"() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ \
      BEGIN \
        IF NEW <> OLD THEN \
          new."updatedAt" = current_timestamp; \
        END IF; \
        RETURN NEW; \
      END; $$ 
    `);

  await db.$queryRawUnsafe(`
      CREATE or replace TRIGGER "logEventAttendeeChanges" \
      before UPDATE \
      ON "EventAttendee" \
      FOR EACH ROW \
      EXECUTE PROCEDURE "logEventAttendee"();
    `);
  console.log('before log event artist');
  await db.$queryRawUnsafe(`
    CREATE OR REPLACE FUNCTION "logEventArtist"() RETURNS TRIGGER LANGUAGE PLPGSQL AS $$ \
    BEGIN \
      IF NEW <> OLD THEN \
        new."updatedAt" = current_timestamp; \
      END IF; \
      RETURN NEW; \
    END; $$
    `);
  console.log('before log event artist changes');
  await db.$queryRawUnsafe(`
    CREATE or replace TRIGGER "logEventArtistChanges" \
      before UPDATE \
      ON "EventArtist" \
      FOR EACH ROW \
      EXECUTE PROCEDURE "logEventArtist"(); \
    `);
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
