import jwt, { JwtPayload } from 'jsonwebtoken';
import * as crypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_API_SECRET = process.env.JWT_API_SECRET || '';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

export function generateApiKey(userId: string): string {
  return jwt.sign({ userId }, JWT_API_SECRET, {
    expiresIn: '365d',
  });
}

export function verifyToken(token: string): string | JwtPayload {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyApiKey(token: string): string | JwtPayload {
  return jwt.verify(token, JWT_API_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await crypt.genSalt(10);
  return await crypt.hash(password, salt);
}

export async function compareHash(password: string, hash: string): Promise<boolean> {
  return await crypt.compare(password, hash);
}
