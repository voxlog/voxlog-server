import { z } from 'zod';

export const UserCreateInSchema = z.object({
  username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/),
  email: z.string().email(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bio: z.string().optional(),
  realName: z.string().optional(),
});

export const UserLoginInSchema = z.object({
  username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9]*$/),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/),
});

export const UserOutSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string(),
  birthDate: z.date(),
  bio: z.string().optional(),
  realName: z.string().optional(),
  profilePictureUrl: z.string().optional(),
  defaultTopArtistsRange: z.string(),
  defaultTopAlbumsRange: z.string(),
  defaultTopTracksRange: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserCreateIn = z.infer<typeof UserCreateInSchema>;
export type UserLoginIn = z.infer<typeof UserLoginInSchema>;
export type UserOut = z.infer<typeof UserOutSchema>;
