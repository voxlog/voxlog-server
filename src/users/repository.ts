import { DateTime } from 'luxon';
import { db, sql } from '../lib/database/connector';
import { RecentScrobble, UserCreateIn, UserOut } from './dtos';
import cuid from 'cuid';
import { User } from '@prisma/client';

export async function getPassword(username: string): Promise<string | null> {
  try {
    const password = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        password: true,
      },
    });

    return password ? password.password : null;
  } catch (error) {
    throw error;
  }
}

export async function create(user: UserCreateIn): Promise<UserOut | null> {
  try {
    const birthDate = DateTime.fromFormat(user.birthDate, 'yyyy-MM-dd').toJSDate();

    const newUser: User = await db.user.create({
      data: {
        ...user,
        birthDate: birthDate,
      },
    });

    return userOutFromUser(newUser);
  } catch (error) {
    throw error;
  }
}

function userOutFromUser(user: User): UserOut {
  return {
    ...user,
    bio: user.bio || undefined,
    realName: user.realName || undefined,
    profilePictureUrl: user.profilePictureUrl || undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getByUsername(username: string): Promise<UserOut | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) return null;
    return userOutFromUser(user);
  } catch (error) {
    throw error;
  }
}
type UserListeningStats = {
  totalHours: number;
  totalArtists: number;
  totalAlbums: number;
  totalTracks: number;
};

export async function getListeningStats(username: string): Promise<any> {
  // const totalHours = await db.scrobble.groupBy({
  //   by: ['userId'],
  //   where: {
  //     user: {
  //       username: username,
  //     },
  //   },
  //   include: {
  //     track: {
  //       select: {
  //         duration: true,
  //       },
  //     },
  //   },
  // });
  // return {
  //   totalHours: totalHours.sum.track.duration,
  //   totalArtists: totalArtists.count,
  //   totalAlbums: totalAlbums.count,
  //   totalTracks: totalTracks.count,
  // };
}

export async function getRecentScrobbles(username: string, quantity: number): Promise<RecentScrobble[]> {
  try {
    const scrobblesInMostRecentOrder = await db.scrobble.findMany({
      where: {
        user: {
          username: username,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: quantity,
      include: {
        track: {
          select: {
            trackId: true,
            title: true,
            fromAlbum: {
              select: {
                coverArtUrl: true,
                albumId: true,
                fromArtist: {
                  select: {
                    artistId: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const tracks: RecentScrobble[] = scrobblesInMostRecentOrder.map((scrobble) => {
      return {
        scrobble: {
          createdAt: scrobble.createdAt.toISOString(),
        },
        track: {
          trackId: scrobble.track.trackId,
          title: scrobble.track.title,
        },
        album: {
          coverArtUrl: scrobble.track.fromAlbum.coverArtUrl,
          albumId: scrobble.track.fromAlbum.albumId,
        },
        artist: {
          artistId: scrobble.track.fromAlbum.fromArtist.artistId,
          name: scrobble.track.fromAlbum.fromArtist.name,
        },
      };
    });

    return tracks;
  } catch (error) {
    throw error;
  }
}

export async function searchByName(username: string): Promise<UserOut[]> {
  return [];
}
