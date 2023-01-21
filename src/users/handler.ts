import { Request, Response } from 'express';
import * as userService from './service';

import { UserCreateIn, UserCreateInSchema, UserLoginInSchema } from './dtos';
import { z } from 'zod';

export async function login(req: Request, res: Response) {
  try {
    const userData = UserLoginInSchema.parse(req.body);

    const token = await userService.validateLogin(userData);

    if(token)
      return res.status(200).json({ token });

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const username = z.string().parse(req.app.locals.username);

    await userService.logout(username);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    console.log('a');
    const userData: UserCreateIn = UserCreateInSchema.parse(req.body);
    const createdUser = await userService.create(userData);

    if (createdUser) {
      return res.status(201).json(createdUser);
    } else {
      return res.status(400).json({ error: 'User already exists' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function get(req: Request, res: Response) {
  try {
    const username: string = z.string().parse(req.params.username);

    const user = await userService.get(username);

    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCurrent(req: Request, res: Response) {
  try {
    const username: string = z.string().parse(req.app.locals.username);

    const user = await userService.get(username);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getStats(req: Request, res: Response) {
  try {
    const username: string = z.string().parse(req.params.username);

    const stats = await userService.getListeningStats(username);

    return res.status(200).json({ stats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getRecentScrobbles(req: Request, res: Response) {
  try {
    const username = z.string().parse(req.params.username);
    const quantity = z.number().optional().parse(req.query.range) || 10;

    const recentScrobbles = await userService.getRecentScrobbles(username, quantity);

    if (recentScrobbles) {
      return res.status(200).json(recentScrobbles);
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function searchByName(req: Request, res: Response) {
  const username = z.string().parse(req.query.username);
  try {
    const tracks = await userService.searchByName(username as string);

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
