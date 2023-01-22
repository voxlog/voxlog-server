import { db } from '../lib/database/connector';
import { ArtistOut, ArtistOutSchema, ArtistCreateIn, ArtistCreateInSchema } from './dtos';

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
