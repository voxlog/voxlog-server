import { Request, Response } from 'express';
import * as trackService from './service';
import { z } from 'zod';

export async function getById(req: Request, res: Response) {
  try {
    const trackId = z.string().parse(req.params.trackId);

    const track = await trackService.getById(trackId);

    if (track) {
      return res.status(200).json(track);
    } else {
      return res.status(404).json({ error: 'Track not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function searchByName(req: Request, res: Response) {
  const trackName = z.string().parse(req.query.name);

  try {
    const tracks = await trackService.searchByName(trackName as string);

    if (tracks.length > 0) {
      return res.status(200).json(tracks);
    } else {
      return res.status(404).json({ error: 'No tracks found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPopular(req: Request, res: Response) {
  try {
    const quantity = z.number().optional().parse(req.query.range) || 10;

    const popularTracks = await trackService.getPopular(quantity);

    if (popularTracks.length > 0) {
      return res.status(200).json(popularTracks);
    } else {
      return res.status(404).json({ error: 'No tracks found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getListeningStats(req: Request, res: Response) {
  try {
    const trackId = z.string().parse(req.params.trackId);

    const listeningStats = await trackService.getListeningStats(trackId);

    if (listeningStats) {
      return res.status(200).json(listeningStats);
    } else {
      return res.status(404).json({ error: 'Track not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}