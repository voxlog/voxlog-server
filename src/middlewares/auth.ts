import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    // @ts-ignore
    req.app.locals.username = decoded.username;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
