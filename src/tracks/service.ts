import * as trackRepository from './repository';
import { TrackOut, TrackPageOut, TrackListeningStats } from './dtos';

export async function getById(trackId: string): Promise<TrackPageOut | null> {
  try {
    const track = await trackRepository.getById(trackId);
    return track;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchByName(trackName: string): Promise<TrackOut[]> {
  try {
    const tracks = await trackRepository.searchByName(trackName);
    return tracks;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopular(quantity: number): Promise<TrackOut[]> {
  try {
    const popularTracks = await trackRepository.getPopular(quantity);
    return popularTracks;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getListeningStats(trackId: string): Promise<TrackListeningStats | null> {
  try {
    const listeningStats = await trackRepository.getListeningStats(trackId);
    return listeningStats;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
