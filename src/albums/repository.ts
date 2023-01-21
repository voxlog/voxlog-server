import { db, sql } from '../lib/database/connector';
import { AlbumOut } from './dtos';

export async function getById(albumId: string): Promise<AlbumOut | null> {
  return null;
}

export async function searchByName(albumName: string): Promise<AlbumOut[]> {
  return [];
}

export async function getPopular(quantity: number): Promise<AlbumOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}
