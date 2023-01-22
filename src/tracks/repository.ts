import { Track as PTrack } from '@prisma/client';

import { db, sql } from '../lib/database/connector';
import { TrackOut, TrackCreateIn, TrackCreateInSchema, TrackOutSchema, TrackListeningStats, TrackPageOut } from './dtos';

export async function create(track: TrackCreateIn) : Promise<TrackOut| null> {
  try {
    const createdTrack = await db.track.create({
      data: TrackCreateInSchema.parse(track),
    });

    const trackOut = {
      ...createdTrack,
      mbId: createdTrack.mbId ? createdTrack.mbId : undefined,
    }

    return TrackOutSchema.parse(trackOut);
  } catch(error) {
    console.log(error);
    throw error;
  }
}

export async function getBySpotifyId(spId: string): Promise<TrackOut | null> {
  try {
    const createdTrack = await db.track.findUnique({
      where: {
        spId,
      },
    });

    if (!createdTrack) {
      return null;
    }

    const trackOut = {
      ...createdTrack,
      mbId: createdTrack.mbId ? createdTrack.mbId : undefined,
    }

    return TrackOutSchema.parse(trackOut);
  } catch (error) {
    throw error;
  }
}

export async function searchByName(trackName: string): Promise<TrackOut[]> {
  const spacedTrackName = trackName.replace(' ', ' & ');
  const tracks = await db.track.findMany({
    where: {
      title: {
        search: spacedTrackName,
      },
    },
    include: {
      fromAlbum: {
        include: {
          fromArtist: true,
        },
      },
    },
  });

  const tracksOut: TrackOut[] = tracks.map((track) => {
    return {
      trackId: track.trackId,
      title: track.title,
      duration: track.duration,
      fromAlbum: {
        albumId: track.fromAlbum.albumId,
        title: track.fromAlbum.title,
        coverArtUrl: track.fromAlbum.coverArtUrl,
      },
      fromArtist: {
        artistId: track.fromAlbum.fromArtist.artistId,
        name: track.fromAlbum.fromArtist.name,
        artUrl: track.fromAlbum.fromArtist.picUrl,
      },
    };
  });

  return tracksOut;
}

export async function getById(trackId: string): Promise<TrackPageOut | null> {
  try {
    const track = await db.track.findUnique({
      where: {
        trackId,
      },
      include: {
        fromAlbum: {
          include: {
            fromArtist: true,
          },
        },
      },
    });

    if (!track) {
      return null;
    }

    return track;
  } catch(error) {
    throw error;
  } 
}

export async function getPopular(quantity: number): Promise<TrackOut[]> {
  try {
    return [];
  } catch (error) {
    throw error;
  }
}

export async function getListeningStats(trackId: string): Promise<TrackListeningStats | null> {
  try {
    const result = await db.track.findUnique({
      where: {
        trackId,
      },
      include: {
        scrobbles: {
          include: {
            user: true,
          }
        }
      },
    });

  if(!result) return null;

  let foundListeners: string[] = [];
  let uniqueListeners: number = 0;
  let totalScrobbles: number = 0;
  
  // From data, get unique listeners
  result.scrobbles.forEach(scrobble => {
    totalScrobbles++;
    if(!foundListeners.includes(scrobble.user.userId)) {
      foundListeners.push(scrobble.user.userId);
      uniqueListeners++;
    }
  })
  
  return {
    uniqueListeners: uniqueListeners,
    totalScrobbles: totalScrobbles,
  };
  } catch (error) {
    throw error;
  }
}