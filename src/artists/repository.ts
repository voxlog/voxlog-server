import { db, sql } from '../lib/database/connector';
import { ArtistOut, ArtistOutSchema, ArtistCreateIn, ArtistCreateInSchema, ArtistListeningStats } from './dtos';
import { AlbumOut, AlbumOutSchema } from '../albums/dtos';

export async function getById(artistId: string): Promise<ArtistOut | null> {
  try {
    const artist = await db.artist.findUnique({
      where: {
        artistId,
      },
    });

    if (!artist) {
      return null;
    }

    return ArtistOutSchema.parse({
      artistId: artist.artistId,
      name: artist.name,
      picUrl: artist.picUrl,
      mbId: artist.mbId ? artist.mbId : undefined,
      spId: artist.spId,
      createdAt: artist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function getBySpotifyId(spId: string): Promise<ArtistOut | null> {
  try {
    const artist = await db.artist.findUnique({
      where: {
        spId,
      },
    });

    if (!artist) {
      return null;
    }

    return ArtistOutSchema.parse({
      artistId: artist.artistId,
      name: artist.name,
      picUrl: artist.picUrl,
      mbId: artist.mbId ? artist.mbId : undefined,
      spId: artist.spId,
      createdAt: artist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateMbId(artistId: string, newArtistName: string, mbId: string): Promise<ArtistOut | null> {
  try {
    const updatedArtist = await db.artist.update({
      where: {
        artistId,
      },
      data: {
        mbId,
        name: newArtistName,
      },
    });

    // Parse createtAt to ISO string
    return ArtistOutSchema.parse({
      artistId: updatedArtist.artistId,
      name: updatedArtist.name,
      picUrl: updatedArtist.picUrl,
      mbId: updatedArtist.mbId,
      spId: updatedArtist.spId,
      createdAt: updatedArtist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

// TODO: we're still not considering the case where there could be an artist with
// a MusicBrainz ID but no Spotify ID.
export async function create(artist: ArtistCreateIn): Promise<ArtistOut| null> {
  try {

    const createdArtist = await db.artist.create({
      data: ArtistCreateInSchema.parse(artist),
    });

    return ArtistOutSchema.parse({
      artistId: createdArtist.artistId,
      name: createdArtist.name,
      picUrl: createdArtist.picUrl,
      mbId: createdArtist.mbId ? createdArtist.mbId : undefined,
      spId: createdArtist.spId,
      createdAt: createdArtist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function searchByName(artistName: string): Promise<ArtistOut[]> {
  return [];
}

export async function getPopular(quantity: number): Promise<ArtistOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}

export async function getListeningStats(artistId: string): Promise<ArtistListeningStats| null> {
  try {

    let hoursListened: any = await db.$queryRawUnsafe(`
      select coalesce(sum("duration"), 0)
      from "Scrobble" s inner join "Track" t
      on s."trackId" = t."trackId"
      inner join "Album" a
      on t."albumId" = a."albumId"
      where a."artistId" = '${artistId}';
    `);
    
    hoursListened = Number(hoursListened[0].coalesce.toString()) / 3600;

    let uniqueListeners: any = await db.$queryRawUnsafe(`
      select count(distinct "userId")
      from "Scrobble" s inner join "Track" t 
      on s."trackId" = t."trackId"
      inner join "Album" a 
      on a."albumId" = t."albumId"
      where a."artistId" = '${artistId}';
    `);

    uniqueListeners = Number(uniqueListeners[0].count.toString());

    let scrobbleCount: any = await db.$queryRawUnsafe(`
      select count(distinct "scrobbleId")
      from "Scrobble" s inner join "Track" t 
      on s."trackId" = t."trackId"
      inner join "Album" a 
      on a."albumId" = t."albumId"
      where a."artistId" = '${artistId}';
    `);

    scrobbleCount = Number(scrobbleCount[0].count.toString());

    // Get an artists top tracks
    // As in this SQL
    /*
      select t."trackId", count(t."trackId")
      from "Scrobble" s inner join "Track" t
      on s."trackId" = t."trackId"
      inner join "Album" a 
      on a."albumId" = t."albumId"
      where a."artistId" = 'ec3030eb-1ad5-414b-9afa-788ddc9f57ce'
      group by t."trackId";
    */

      const result = await db.artist.findUnique({
        where: {
          artistId,
        },
        include: {
          albums: {
            include: {
              tracks: {
                include: {
                  scrobbles: true,
                },
              },
            },
          },
        },
      });

    console.log(result?.albums[0].tracks[0].scrobbles)

    console.log(hoursListened, uniqueListeners, scrobbleCount);

    return null;
  } catch (error) {
    throw error;
  }
}