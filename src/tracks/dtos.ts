import { z } from 'zod';

export const TrackCreateInSchema = z.object({
  title: z.string(),
  albumId: z.string(),
  duration: z.number(),
  mbId: z.string().optional(),
  spId: z.string().optional(),
});

export const TrackOutSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  albumId: z.string(),
  duration: z.number(),
  mbId: z.string().optional(),
  spId: z.string().optional(),
});

export type TrackCreateIn = z.infer<typeof TrackCreateInSchema>;
export type TrackOut = z.infer<typeof TrackOutSchema>;