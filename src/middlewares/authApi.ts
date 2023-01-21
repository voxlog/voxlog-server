import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';

const JWT_API_SECRET = process.env.JWT_API_SECRET || '';
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(token, JWT_API_SECRET);

    // @ts-ignore
    req.body = { ...req.body, userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
