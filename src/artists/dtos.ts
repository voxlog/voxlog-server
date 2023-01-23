import { z } from 'zod';
import { TrackOut } from '../tracks/dtos';
import { AlbumOut } from '../albums/dtos';

export const ArtistCreateInSchema = z.object({
  name: z.string(),
  picUrl: z.string().optional(),
  mbId: z.string().optional(),
  spId: z.string().optional(),
});

export type ArtistCreateIn = z.infer<typeof ArtistCreateInSchema>;
export type ArtistOut = {
  artistId: string;
  name: string;
  picUrl: string | null;
};

export type ArtistListeningStats = {
  uniqueListeners: number;
  totalHoursListened: number;
  totalScrobbles: number;
  topTracks: {
    trackId: string;
    trackTitle: string;
    albumCoverArtUrl: string | null;
    totalHoursListened: number;
  }[];
  topAlbums: {
    albumId: string;
    albumTitle: string;
    albumCoverArtUrl: string | null;
    totalHoursListened: number;
  }[];
};
