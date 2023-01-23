import { DateTime } from 'luxon';
import { db } from '../lib/database/connector';
import { AllEventsOut, EventCreate, EventOut } from './dtos';

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
