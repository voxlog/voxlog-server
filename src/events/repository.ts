import { DateTime } from 'luxon';
import { db } from '../lib/database/connector';
import { AllEventsOut, EventCreate, EventFullOut, EventOut } from './dtos';

export async function create(event: EventCreate): Promise<EventOut | null> {
  try {
    const artistsIds = event.artistsIds;

    const eventCreated = await db.event.create({
      data: {
        name: event.name,
        description: event.description,
        url: event.url,
        imageUrl: event.imageUrl,
        lat: event.lat,
        lon: event.lon,
        startTime: DateTime.fromISO(event.startTime).toJSDate(),
        endTime: DateTime.fromISO(event.endTime).toJSDate(),
        creator: {
          connect: {
            userId: event.creatorId,
          },
        },

        artists: {
          createMany: {
            data: artistsIds.map((artistId) => ({
              artistId,
            })),
            skipDuplicates: true,
          },
        },
      },
      select: {
        eventId: true,
        name: true,
      },
    });

    return eventCreated;
  } catch (error) {
    throw error;
  }
}

export async function getAll(): Promise<AllEventsOut[]> {
  try {
    const events = await db.event.findMany({
      include: {
        artists: true,
        creator: true,
        _count: {
          select: {
            attendees: true,
          },
        },
      },
    });

    const artistNamesGet = await db.artist.findMany({
      select: {
        name: true,
      },
      where: {
        artistId: {
          in: events.flatMap((event) => event.artists.map((artist) => artist.artistId)),
        },
      },
    });

    let artistNames: string[] = [];

    artistNamesGet.forEach((artist) => {
      artistNames.push(artist.name);
    });

    const eventsOut: AllEventsOut[] = events.map((event) => ({
      id: event.eventId,
      name: event.name,
      artists: artistNames,
      startDate: DateTime.fromJSDate(event.startTime).toISODate(),
      lat: event.lat,
      lon: event.lon,
      peopleCount: event._count.attendees,
      imageUrl: event.imageUrl,
      local: null,
    }));

    return eventsOut;
  } catch (error) {
    throw error;
  }
}

export async function get(id: string): Promise<EventFullOut | null> {
  try {
    const event = await db.event.findUnique({
      where: {
        eventId: id,
      },
      include: {
        artists: {
          include: {
            artist: {
              select: {
                artistId: true,
                name: true,
                picUrl: true,
              },
            },
          },
        },
        creator: true,
        _count: {
          select: {
            attendees: true,
          },
        },
        pictures: {
          include: {
            uploader: true,
          },
        },
      },
    });

    if (!event) return null;

    const eventOut: EventFullOut = {
      eventId: event.eventId,
      name: event.name,
      description: event.description,
      url: event.url,
      imageUrl: event.imageUrl,
      lat: event.lat,
      lon: event.lon,
      local: null,
      startTime: DateTime.fromJSDate(event.startTime).toISODate(),
      endTime: DateTime.fromJSDate(event.endTime).toISODate(),
      creator: {
        username: event.creator.username,
        name: event.creator.realName || event.creator.username,
      },
      artists: event.artists.map((artist) => ({
        artistId: artist.artistId,
        name: artist.artist.name,
        picUrl: artist.artist.picUrl,
      })),
      pictures: event.pictures.map((picture) => ({
        pictureId: picture.pictureId,
        url: picture.url,
        uploader: {
          userId: picture.uploaderId,
          name: picture.uploader.realName || picture.uploader.username,
        },
      })),
      peopleCount: event._count.attendees,
    };

    return eventOut;
  } catch (error) {
    throw error;
  }
}

export async function attend(eventId: string, userId: string): Promise<boolean> {
  try {
    const event = await db.event.findUnique({
      where: {
        eventId,
      },
    });

    if (!event) return false;

    // Check if user is already attending
    const userAttend = await db.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (userAttend) return false;

    await db.eventAttendee.create({
      data: {
        user: {
          connect: {
            userId,
          },
        },
        event: {
          connect: {
            eventId,
          },
        },
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
}
