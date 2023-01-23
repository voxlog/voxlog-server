import * as eventsRepository from './repository';
import { AllEventsOut, EventCreate, EventCreateSchema, EventOut } from './dtos';

export async function create(event: EventCreate): Promise<EventOut | null> {
  try {
    const eventCreated = await eventsRepository.create(event);
    return eventCreated;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAll(): Promise<AllEventsOut[]> {
  try {
    const events = await eventsRepository.getAll();
    return events;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
