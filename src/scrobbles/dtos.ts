import { z } from 'zod';

export const SpotifyScrobbleSchema = z.object({
    userId: z.string(),
    spIdTrack: z.string()
});

export const ScrobbleCreateSchema = z.object({
    userId: z.string(),
    trackId: z.string()
});

export const ScrobbleCreateOutSchema = z.object({
    scrobbleId: z.string(),
    userId: z.string(),
    trackId: z.string(),
    createdAt: z.string(),
});

export const MusicBrainzScrobbleSchema = z.object({
    userId: z.string(),
    mbIdRecording: z.string(),
    mbIdRelease: z.string(),
});

export const SimpleScrobbleSchema = z.object({
    userId: z.string(),
    trackTitle: z.string(),
    artistName: z.string(),
    trackDuration: z.number(),
});

export type SpotifyScrobble = z.infer<typeof SpotifyScrobbleSchema>;
export type MusicBrainzScrobble = z.infer<typeof MusicBrainzScrobbleSchema>;
export type SimpleScrobble = z.infer<typeof SimpleScrobbleSchema>;
export type ScrobbleCreate = z.infer<typeof ScrobbleCreateSchema>;
export type ScrobbleCreateOut = z.infer<typeof ScrobbleCreateOutSchema>;
export type Scrobble = SpotifyScrobble | MusicBrainzScrobble | SimpleScrobble;