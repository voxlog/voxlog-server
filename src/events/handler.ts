import { Request, Response } from 'express';
import * as eventsService from './service';
import { EventCreateSchema } from './dtos';

export async function create(req: Request, res: Response) {
  try {
    const userId = req.app.locals.userId;
    const body = { ...req.body, creatorId: userId };
    const event = EventCreateSchema.parse(body);

    const createdEvent = await eventsService.create(event);
    if (createdEvent) return res.status(201).json(createdEvent);
    else return res.status(400).json({ error: 'Event already exists' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
