import { DateTime } from 'luxon';
import { generateToken, invalidateToken } from '../../utils/auth';
import { compareHash, hashPassword } from '../../utils/helpers';
import * as userRepository from './repository';
import { UserCreateIn, UserLoginIn, UserOut } from './dtos';

export async function validateLogin(user: UserLoginIn): Promise<string | null> {
  try {
    const password = await userRepository.getPassword(user.username);
    const isPasswordValid = await compareHash(user.password, password);

    if (isPasswordValid) {
      const token = generateToken(user.username);
      return token;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function logout(username: string): Promise<void> {
  try {
    invalidateToken(username);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function create(user: UserCreateIn) {
  const hashedPassword = await hashPassword(user.password);

  const userData = {
    ...user,
    password: hashedPassword,
  };

  try {
    const createdUser = await userRepository.create(userData);
    return createdUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function get(username: string) {
  try {
    const user = await userRepository.getByUsername(username);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getListeningStats(username: string) {
  try {
    const timeSpentListening = await userRepository.getListeningStats(username);
    return timeSpentListening;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecentScrobbles(username: string, quantity: number) {
  try {
    const recentScrobbles = await userRepository.getRecentScrobbles(username, quantity);
    return recentScrobbles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function searchByName(username: string): Promise<UserOut[]> {
  try {
    const tracks = await userRepository.searchByName(username);
    return tracks;
  } catch (error) {
    console.log(error);
    throw error;
  }
}