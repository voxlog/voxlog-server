import { db } from '../lib/database/connector';
import { ArtistOut, ArtistOutSchema, ArtistCreateIn } from './dtos';

export async function getById(artistId: string): Promise<ArtistOut | null> {
  return null;
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

    return ArtistOutSchema.parse(artist);
  } catch (error) {
    throw error;
  }
}

export async function updateMbId(artistId: string, mbId: string): Promise<ArtistOut | null> {
  try {
    const updatedArtist = await db.artist.update({
      where: {
        artistId,
      },
      data: {
        mbId,
      },
    });
    
    return ArtistOutSchema.parse(updatedArtist);
  } catch (error) {
    throw error;
  }
}

// TODO: we're still not considering the case where there could be an artist with
// a MusicBrainz ID but no Spotify ID.
export async function create(artist: ArtistCreateIn): Promise<ArtistOut| null> {
  try {
    const createdArtist = await db.artist.create({
      data: artist,
    });

    return ArtistOutSchema.parse(createdArtist);
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
