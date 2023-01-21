import { db, sql } from '../lib/database/connector';
import { ArtistOut } from './dtos';

export async function getById(artistId: string): Promise<ArtistOut | null> {
  return null;
}

export async function create(name: string, picUrl: string, mbId: string, spId: string): Promise<ArtistOut | null> {
  const affectedRows: any = await db.$executeRaw(
    sql`
      Call createArtist(${name}, ${picUrl}, ${mbId}, ${spId});
    `,
  );
  return null;
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
