import { Request, Response } from 'express';
import * as scrobblesService from './service';
import {
  SpotifyScrobble,
  SpotifyScrobbleSchema,
  MusicBrainzScrobble,
  MusicBrainzScrobbleSchema,
  SimpleScrobble,
  SimpleScrobbleSchema,
} from './dtos';

export async function create(req: Request, res: Response) {
  try {
    const userId = req.app.locals.userId;
    const scrobbleReq = { ...req.body, userId };
    //console.log(scrobble);

    let createdScrobble: any;
    let scrobbleData: SpotifyScrobble | MusicBrainzScrobble | SimpleScrobble;
    if (scrobbleReq.spIdTrack) {
      scrobbleData = SpotifyScrobbleSchema.parse(scrobbleReq);
      createdScrobble = await scrobblesService.createSpotifyScrobble(scrobbleData);
    } else if (scrobbleReq.mbIdRecording) {
      scrobbleData = MusicBrainzScrobbleSchema.parse(scrobbleReq);
      createdScrobble = await scrobblesService.createMusicBrainzScrobble(scrobbleData);
    } else {
      scrobbleData = SimpleScrobbleSchema.parse(scrobbleReq);
      createdScrobble = await scrobblesService.createSimpleScrobble(scrobbleData);
    }

    if (createdScrobble) return res.status(201).json(createdScrobble);
    else return res.status(200).json({ error: 'Scrobble already exists' });
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: 'Internal server error' });
  }
}
