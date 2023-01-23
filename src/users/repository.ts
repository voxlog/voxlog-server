import { DateTime } from 'luxon';
import { db, sql } from '../lib/database/connector';
import { RecentScrobble, UserCreateIn, UserListeningStatsOut, UserOut } from './dtos';
import cuid from 'cuid';
import { User } from '@prisma/client';
import { TopArtist, TopAlbum } from './dtos';

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

export async function getUserIdByUsername(username: string): Promise<string | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
      select: {
        userId: true,
      },
    });

    return user ? user.userId : null;
  } catch (error) {
    throw error;
  }
}

export async function getUsernameByUserId(userId: string): Promise<string | null> {
  try {
    const user = await db.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        username: true,
      },
    });

    return user ? user.username : null;
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

export async function getListeningStats(username: string): Promise<UserListeningStatsOut> {
  const userIdQuerry: any = await db.$queryRaw(sql`
  Select "userId" from "User" where "User".username = ${username};
  `);

  const userId = userIdQuerry[0].userId;

  function bigIntToNumber(bigInt: any) {
    if (bigInt === null) return 0;
    if (typeof bigInt === 'number') return bigInt;
    return Number(bigInt.toString());
  }

  const totalHoursQuery: any = await db.$queryRaw(sql`
  Select "getTotalHours"(${userId});
  `);

  let totalHours = bigIntToNumber(totalHoursQuery[0].getTotalHours);
  totalHours = totalHours / 3600;

  const totalHoursSimpleScrobbleQuery: any = await db.$queryRaw(sql`
    Select "getTotalHoursSimpleScrobble"(${userId});
  `);

  let totalHoursSimpleScrobble = bigIntToNumber(totalHoursSimpleScrobbleQuery[0].getTotalHoursSimpleScrobble);
  totalHoursSimpleScrobble = totalHoursSimpleScrobble / 3600;

  const totalHoursScrobbles = totalHours + totalHoursSimpleScrobble;

  const totalArtistQuery: any = await db.$queryRaw(sql`
    Select "getTotalArtist"(${userId});
  `);

  const totalArtists = bigIntToNumber(totalArtistQuery[0].getTotalArtist);

  const totalAlbumsQuery: any = await db.$queryRaw(sql`
    Select "getTotalAlbums"(${userId});
  `);

  const totalAlbums = bigIntToNumber(totalAlbumsQuery[0].getTotalAlbums);

  const totalTracksQuery: any = await db.$queryRaw(sql`
    Select "getTotalTracks"(${userId});
  `);

  const totalTracks = bigIntToNumber(totalTracksQuery[0].getTotalTracks);

  return {
    totalHours: totalHoursScrobbles,
    totalArtists: totalArtists,
    totalAlbums: totalAlbums,
    totalTracks: totalTracks,
  };
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

export async function getTopArtists(userId: string, quantity: number): Promise<TopArtist[]> {
  try {
    const result = await db.artist.findMany({
      include: {
        albums: {
          include: {
            tracks: {
              include: {
                scrobbles: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Filter user scrobbles
    const filteredResult = result.filter((artist) => {
      return artist.albums.some((album) => {
        return album.tracks.some((track) => {
          return track.scrobbles.some((scrobble) => {
            return scrobble.user.userId === userId;
          });
        });
      });
    });

    // For each artist, sum the duration of all tracks
    let artists = filteredResult.map((artist) => {
      let totalDuration = 0;
      artist.albums.forEach((album) => {
        album.tracks.forEach((track) => {
          totalDuration += track.duration;
        });
      });
      return {
        artistId: artist.artistId,
        name: artist.name,
        picUrl: artist.picUrl,
        totalDuration: totalDuration,
      };
    });

    // Sort by duration
    artists = artists.sort((a, b) => {
      return b.totalDuration - a.totalDuration;
    });

    // Remove totalDuration
    const retArtists = artists.map((artist) => {
      return {
        artistId: artist.artistId,
        artistName: artist.name,
        artistArtUrl: artist.picUrl,
      };
    });

    // Return the top 5
    return retArtists;
  } catch (error) {
    throw error;
  }
}

export async function searchByName(username: string): Promise<UserOut[]> {
  return [];
}
