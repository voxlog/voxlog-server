import * as eventsRepository from './repository';
import { EventCreate, EventCreateSchema, EventOut } from './dtos';

export async function create(event: EventCreate): Promise<EventOut | null> {
  try {
    const eventCreated = await eventsRepository.create(event);
    return eventCreated;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
