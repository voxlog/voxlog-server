import { z } from 'zod';

export const SpotifyScrobbleSchema = z.object({
    userId: z.string(),
    spIdTrack: z.string(),
    trackISRC: z.string(),
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
export type Scrobble = SpotifyScrobble | MusicBrainzScrobble | SimpleScrobble;