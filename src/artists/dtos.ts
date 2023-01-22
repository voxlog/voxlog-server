import { z } from 'zod';
import { TrackOut } from '../tracks/dtos';
import { AlbumOut } from '../albums/dtos';

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
    createdAt: z.string()
});

export type ArtistCreateIn = z.infer<typeof ArtistCreateInSchema>;
export type ArtistOut = z.infer<typeof ArtistOutSchema>;

export type ArtistListeningStats = {
    uniqueListeners: number;
    totalHoursListened: number;
    totalScrobbles: number;
    topTracks: {
        tracks: TrackOut[],
        totalHoursListened: number,
    };
    topAlbums: {
        albums: AlbumOut[],
        totalHoursListened: number,
    }
}