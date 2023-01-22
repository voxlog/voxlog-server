import { db } from '../lib/database/connector';
import { AlbumOut, AlbumCreateIn, AlbumCreateInSchema, AlbumOutSchema } from './dtos';

export async function getById(albumId: string): Promise<AlbumOut | null> {
  return null;
}

export async function searchByName(albumName: string): Promise<AlbumOut[]> {
  return [];
}

export async function create(album: AlbumCreateIn): Promise<AlbumOut | null> {
  try {
    const createdAlbum = await db.album.create({
      data: AlbumCreateInSchema.parse(album),
    });

    const outAlbum = {
      ...createdAlbum,
      mbId: createdAlbum.mbId ? createdAlbum.mbId : undefined,
    }

    return AlbumOutSchema.parse(outAlbum);

  } catch (error) {
    throw error;
  }
}

export async function getBySpotifyId(spId: string): Promise<AlbumOut | null> {
  try {
    const createdAlbum = await db.album.findUnique({
      where: {
        spId,
      },
    });

    if (!createdAlbum) {
      return null;
    }

    const outAlbum = {
      ...createdAlbum,
      mbId: createdAlbum.mbId ? createdAlbum.mbId : undefined,
    }

    return AlbumOutSchema.parse(outAlbum);
  } catch (error) {
    throw error;
  }
}

export async function getPopular(quantity: number): Promise<AlbumOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}
