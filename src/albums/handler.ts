import { Request, Response } from 'express';
import { z } from 'zod';
import * as albumService from './service';

export async function getById(req: Request, res: Response) {
  try {
    const albumId = z.string().parse(req.params.albumId);

    const album = await albumService.getById(albumId);

    if (album) {
      return res.status(200).json({ album: album });
    } else {
      return res.status(404).json({ error: 'Album not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function searchByName(req: Request, res: Response) {
  try {
    const albumName = z.string().parse(req.params.albumName);

    const album = await albumService.searchByName(albumName);

    if (album) {
      return res.status(200).json({ album: album });
    } else {
      return res.status(404).json({ error: 'Album not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPopular(req: Request, res: Response) {
  try {
    const quantity = z.number().optional().parse(req.query.range) || 10;

    const popularAlbums = await albumService.getPopular(quantity);

    if (popularAlbums.length > 0) {
      return res.status(200).json(popularAlbums);
    } else {
      return res.status(404).json({ error: 'No Albums found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getListeningStats(req: Request, res: Response) {
  try {
    const albumId = z.string().parse(req.params.albumId);

    const listeningStats = await albumService.getListeningStats(albumId);

    if (listeningStats) {
      return res.status(200).json(listeningStats);
    } else {
      return res.status(404).json({ error: 'Album not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
