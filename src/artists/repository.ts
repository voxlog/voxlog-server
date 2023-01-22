import { db, sql } from '../lib/database/connector';
import { ArtistOut, ArtistOutSchema, ArtistCreateIn, ArtistCreateInSchema, ArtistListeningStats } from './dtos';
import { AlbumOut, AlbumOutSchema } from '../albums/dtos';
import { TrackOut, TrackOutSchema } from '../tracks/dtos';

export async function getById(artistId: string): Promise<ArtistOut | null> {
  try {
    const artist = await db.artist.findUnique({
      where: {
        artistId,
      },
    });

    if (!artist) {
      return null;
    }

    return ArtistOutSchema.parse({
      artistId: artist.artistId,
      name: artist.name,
      picUrl: artist.picUrl,
      mbId: artist.mbId ? artist.mbId : undefined,
      spId: artist.spId,
      createdAt: artist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function getBySpotifyId(spId: string): Promise<ArtistOut | null> {
  try {
    const artist = await db.artist.findUnique({
      where: {
        spId,
      },
    });

    if (!artist) {
      return null;
    }

    return ArtistOutSchema.parse({
      artistId: artist.artistId,
      name: artist.name,
      picUrl: artist.picUrl,
      mbId: artist.mbId ? artist.mbId : undefined,
      spId: artist.spId,
      createdAt: artist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateMbId(artistId: string, newArtistName: string, mbId: string): Promise<ArtistOut | null> {
  try {
    const updatedArtist = await db.artist.update({
      where: {
        artistId,
      },
      data: {
        mbId,
        name: newArtistName,
      },
    });

    // Parse createtAt to ISO string
    return ArtistOutSchema.parse({
      artistId: updatedArtist.artistId,
      name: updatedArtist.name,
      picUrl: updatedArtist.picUrl,
      mbId: updatedArtist.mbId,
      spId: updatedArtist.spId,
      createdAt: updatedArtist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

// TODO: we're still not considering the case where there could be an artist with
// a MusicBrainz ID but no Spotify ID.
export async function create(artist: ArtistCreateIn): Promise<ArtistOut| null> {
  try {

    const createdArtist = await db.artist.create({
      data: ArtistCreateInSchema.parse(artist),
    });

    return ArtistOutSchema.parse({
      artistId: createdArtist.artistId,
      name: createdArtist.name,
      picUrl: createdArtist.picUrl,
      mbId: createdArtist.mbId ? createdArtist.mbId : undefined,
      spId: createdArtist.spId,
      createdAt: createdArtist.createdAt.toISOString(),
    });
  } catch (error) {
    throw error;
  }
}

export async function searchByName(artistName: string): Promise<ArtistOut[]> {
  return [];
}

export async function getPopular(quantity: number): Promise<ArtistOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}

export async function getListeningStats(artistId: string): Promise<ArtistListeningStats| null> {
  try {
    const result = await db.artist.findUnique({
      where: {
        artistId,
      },
      include: {
        albums: {
          include: {
            tracks: {
              include: {
                scrobbles: {
                  include: {
                    user: true,
                  }
                }
              },
            },
          },
        },
      },
    });

  if(!result) return null;

  let foundListeners: string[] = [];
  let uniqueListeners: number = 0;
  let totalHoursListened: number = 0;
  let totalScrobbles: number = 0;
  let topTracks: {
    trackId: string;
    trackTitle: string;
    totalHoursListened: number;
  }[] = [];
  let topAlbums: {
    albumId: string;
    albumTitle: string;
    totalHoursListened: number;
    albumCoverArtUrl: string | null;
  }[] = [];
  
  // From data, get unique listeners
  result.albums.forEach(album => {
    if(!topAlbums.some(a => a.albumId === album.albumId)) {
      topAlbums.push({
        albumId: album.albumId,
        albumTitle: album.title,
        totalHoursListened: 0,
        albumCoverArtUrl: album.coverArtUrl,
      });
    }
    album.tracks.forEach(track => {
      if(!topTracks.some(t => t.trackId === track.trackId)) {
        topTracks.push({
          trackId: track.trackId,
          trackTitle: track.title,
          totalHoursListened: 0,
        });
      }

      track.scrobbles.forEach(scrobble => {
        totalScrobbles++;
        if(!foundListeners.includes(scrobble.user.userId)) {
          foundListeners.push(scrobble.user.userId);
          uniqueListeners++;
        }
        totalHoursListened += track.duration;
        
        // Update top tracks
        topTracks.forEach(topTrack => {
          if(topTrack.trackId === track.trackId) {
            topTrack.totalHoursListened += track.duration;
          }
        })

        // Update top albums
        topAlbums.forEach(topAlbum => {
          if(topAlbum.albumId === album.albumId) {
            topAlbum.totalHoursListened += track.duration;
          }
        })
      })
    })
  })

  // Sort top tracks and albums
  topTracks.sort((a, b) => b.totalHoursListened - a.totalHoursListened);
  topAlbums.sort((a, b) => b.totalHoursListened - a.totalHoursListened);
  // Limit to 10
  topTracks = topTracks.slice(0, 10);
  // Limit to 5
  topAlbums = topAlbums.slice(0, 5);

  return {
    uniqueListeners: uniqueListeners,
    totalHoursListened: totalHoursListened,
    totalScrobbles: totalScrobbles,
    topTracks: topTracks,
    topAlbums: topAlbums,
  };
  } catch (error) {
    throw error;
  }
}