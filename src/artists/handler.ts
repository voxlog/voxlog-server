import { Request, Response } from 'express';
import { z } from 'zod';
import * as artistService from './service';
import { ArtistOut } from './dtos';

export async function getById(req: Request, res: Response) {
  try {
    const artistId = z.string().parse(req.params.artistId);

    const artist = await artistService.getById(artistId);

    if (artist) {
      return res.status(200).json({ artist: artist });
    } else {
      return res.status(404).json({ error: 'Artist not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function searchByName(req: Request, res: Response) {
  try {
    const artistName = z.string().parse(req.query.name);
    console.log('name:', artistName);

    const artists: ArtistOut[] = await artistService.searchByName(artistName);

    return res.status(200).json({ artists: artists });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPopular(req: Request, res: Response) {
  try {
    const quantity = z.number().optional().parse(req.query.range) || 10;

    const getPopularArtists = await artistService.getPopular(quantity);

    if (getPopularArtists.length > 0) {
      return res.status(200).json(getPopularArtists);
    } else {
      return res.status(404).json({ error: 'No artists found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getListeningStats(req: Request, res: Response) {
  try {
    const artistId = z.string().parse(req.params.artistId);

    const listeningStats = await artistService.getListeningStats(artistId);

    if (listeningStats) {
      return res.status(200).json(listeningStats);
    } else {
      return res.status(404).json({ error: 'Artist not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
