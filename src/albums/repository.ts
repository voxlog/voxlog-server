import { db } from '../lib/database/connector';
import { AlbumOut, AlbumCreateIn, AlbumCreateInSchema, AlbumOutSchema, AlbumListeningStats } from './dtos';

export async function getById(albumId: string): Promise<AlbumOut | null> {
  return null;
}

export async function searchByName(albumName: string): Promise<AlbumOut[]> {
  return [];
}

export async function create(album: AlbumCreateIn): Promise<AlbumOut | null> {
  try {
    const createdAlbum = await db.album.create({
      data: AlbumCreateInSchema.parse(album),
    });

    const outAlbum = {
      ...createdAlbum,
      mbId: createdAlbum.mbId ? createdAlbum.mbId : undefined,
    }

    return AlbumOutSchema.parse(outAlbum);

  } catch (error) {
    throw error;
  }
}

export async function getBySpotifyId(spId: string): Promise<AlbumOut | null> {
  try {
    const createdAlbum = await db.album.findUnique({
      where: {
        spId,
      },
    });

    if (!createdAlbum) {
      return null;
    }

    const outAlbum = {
      ...createdAlbum,
      mbId: createdAlbum.mbId ? createdAlbum.mbId : undefined,
    }

    return AlbumOutSchema.parse(outAlbum);
  } catch (error) {
    throw error;
  }
}

export async function getPopular(quantity: number): Promise<AlbumOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}

export async function getListeningStats(albumId: string): Promise<AlbumListeningStats | null> {
  try {
    const result = await db.album.findUnique({
      where: {
        albumId,
      },
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
  
  // From data, get unique listeners
  result.tracks.forEach(track => {
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
    })
  })

  // Sort top tracks and albums
  topTracks.sort((a, b) => b.totalHoursListened - a.totalHoursListened);
  // Limit to 10
  topTracks = topTracks.slice(0, 10);
  
  return {
    uniqueListeners: uniqueListeners,
    totalHoursListened: totalHoursListened,
    totalScrobbles: totalScrobbles,
    topTracks: topTracks,
  };
  } catch (error) {
    throw error;
  }
}