import { Request, Response } from 'express';
import * as scrobblesService from './service';
import { SpotifyScrobble, MusicBrainzScrobble, SimpleScrobble } from './dtos';

export async function create(req: Request, res: Response) {
  try {
    const scrobble: CreateScrobbleIn = req.body;

    const createdScrobble = await scrobblesService.create(scrobble);

    if (createdScrobble) {
      return res.status(201).json(createdScrobble);
    } else {
      return res.status(400).json({ error: 'Scrobble already exists' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
