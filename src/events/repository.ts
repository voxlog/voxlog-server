import { DateTime } from 'luxon';
import { db } from '../lib/database/connector';
import { EventCreate, EventOut } from './dtos';

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
