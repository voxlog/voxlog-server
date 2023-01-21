import { AlbumOut } from './dtos';
import * as albumRepository from './repository';

export async function getById(albumId: string): Promise<AlbumOut | null> {
  try {
    return await albumRepository.getById(albumId);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchByName(albumName: string): Promise<AlbumOut[]> {
  try {
    const albums = await albumRepository.searchByName(albumName);
    return albums;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopular(quantity: number): Promise<AlbumOut[]> {
  try {
    const popularAlbum = await albumRepository.getPopular(quantity);
    return popularAlbum;
  } catch (error) {
    console.log(error);
    throw error;
  }
}