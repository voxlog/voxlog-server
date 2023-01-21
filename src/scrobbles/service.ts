import * as scrobblesRepository from './repository';
import { CreateScrobbleIn } from '../../utils/dtos/Scrobble';

export async function create(scrobble: CreateScrobbleIn) {
  try {
    const createdScrobble = await scrobblesRepository.create(scrobble);
    return createdScrobble;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
