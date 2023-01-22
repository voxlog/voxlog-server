import { z } from 'zod';

export const ArtistCreateInSchema = z.object({
    name: z.string(),
    picUrl: z.string().optional(),
    mbId: z.string().optional(),
    spId: z.string().optional(),
});

export const ArtistOutSchema = z.object({
    artistId: z.string(),
    name: z.string(),
    picUrl: z.string().optional(),
    mbId: z.string().optional(),
    spId: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ArtistCreateIn = z.infer<typeof ArtistCreateInSchema>;
export type ArtistOut = z.infer<typeof ArtistOutSchema>;