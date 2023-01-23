import { Request, Response } from 'express';
import * as eventsService from './service';
import { AllEventsOut, EventCreateSchema } from './dtos';

export async function create(req: Request, res: Response) {
  try {
    const userId = req.app.locals.userId;
    const body = { ...req.body, creatorId: userId };
    const event = EventCreateSchema.parse(body);

    const createdEvent = await eventsService.create(event);
    if (createdEvent) return res.status(201).json(createdEvent);
    else return res.status(400).json({ error: 'Event already exists' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ error: message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const events: AllEventsOut[] = await eventsService.getAll();
    console.log('events', events);
    return res.status(200).json(events);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ error: message });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const event = await eventsService.get(id);
    if (event) return res.status(200).json(event);
    else return res.status(404).json({ error: 'Event not found' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).json({ error: message });
  }
}
