import { z } from 'zod';

export const EventCreateSchema = z.object({
  name: z.string().max(128),
  description: z.string().max(2048),

  url: z.string().max(2048).optional(),
  imageUrl: z.string().max(2048).optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),

  artistsIds: z.array(z.string().max(128)),

  startTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  creatorId: z.string().max(128),
});

export type EventCreate = z.infer<typeof EventCreateSchema>;

export type EventOut = {
  eventId: string;
  name: string;
};

export type AllEventsOut = {
  id: string;
  name: string;
  artists: string[];
  startDate: string;
  local: string | null;
  lat: number;
  lon: number;
  peopleCount: number;
  imageUrl: string | null;
};
