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

export type TrackPageOut = {
  trackId: string;
  title: string;
  albumId: string;
  duration: number;
  mbId: string | null;
  spId: string | null;
  fromAlbum: {
    albumId: string;
    artistId: string;
    title: string;
    coverArtUrl: string | null;
    mbId: string | null;
    spId: string | null;
    fromArtist: {
      artistId: string;
      name: string;
      picUrl: string | null;
      mbId: string | null;
      spId: string | null;
      createdAt: Date;
    };
  };
}

export type TrackCreateIn = z.infer<typeof TrackCreateInSchema>;
export type TrackOut = z.infer<typeof TrackOutSchema>;

export type TrackListeningStats = {
  uniqueListeners: number;
  totalScrobbles: number;
}