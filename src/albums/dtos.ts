import { z } from 'zod';

export const AlbumCreateInSchema = z.object({
    title: z.string(),
    artistId: z.string(),
    coverArtUrl: z.string().optional(),
    mbId: z.string().optional(),
    spId: z.string().optional(),
});

export const AlbumOutSchema = z.object({
    albumId: z.string(),
    title: z.string(),
    artistId: z.string(),
    coverArtUrl: z.string().optional(),
    mbId: z.string().optional(),
    spId: z.string().optional()
});

export const AlbumPageOutSchema = z.object({
    albumId: z.string(),
    title: z.string(),
    artistId: z.string(),
    artistName: z.string(),
    coverArtUrl: z.string().optional(),
    mbId: z.string().optional(),
    spId: z.string().optional()
});

export type AlbumCreateIn = z.infer<typeof AlbumCreateInSchema>;
export type AlbumOut = z.infer<typeof AlbumOutSchema>;
export type AlbumPageOut = z.infer<typeof AlbumPageOutSchema>;

export type AlbumListeningStats = {
    uniqueListeners: number;
    totalHoursListened: number;
    totalScrobbles: number;
    topTracks: {
        trackId: string;
        trackTitle: string;
        totalHoursListened: number;
    }[];
}