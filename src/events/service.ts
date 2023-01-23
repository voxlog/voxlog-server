import * as eventsRepository from './repository';
import { AllEventsOut, EventCreate, EventCreateSchema, EventOut, EventFullOut } from './dtos';

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

export async function get(id: string): Promise<EventFullOut | null> {
  try {
    const event = await eventsRepository.get(id);
    return event;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function attend(id: string, userId: string): Promise<boolean | null> {
  try {
    const event = await eventsRepository.attend(id, userId);
    return event;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
