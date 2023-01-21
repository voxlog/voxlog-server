import { ArtistOut } from './dtos';
import * as artistRepository from './repository';

export async function getById(artistId: string): Promise<ArtistOut | null> {
  try {
    return await artistRepository.getById(artistId);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchByName(artistName: string): Promise<ArtistOut[]> {
  try {
    const artists = await artistRepository.searchByName(artistName);
    return artists;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopular(quantity: number): Promise<ArtistOut[]> {
  try {
    const popularArtists = await artistRepository.getPopular(quantity);
    return popularArtists;
  } catch (error) {
    console.log(error);
    throw error;
  }
}