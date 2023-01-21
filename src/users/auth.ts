import jwt, { JwtPayload } from 'jsonwebtoken';
import * as crypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_API_SECRET = process.env.JWT_API_SECRET || '';

export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function generateApiKey(username: string): string {
  return jwt.sign({ username }, JWT_API_SECRET);
}

export function verifyToken(token: string): string | JwtPayload {
  return jwt.verify(token, JWT_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await crypt.genSalt(10);
  return await crypt.hash(password, salt);
}

export async function compareHash(password: string, hash: string): Promise<boolean> {
  return await crypt.compare(password, hash);
}
