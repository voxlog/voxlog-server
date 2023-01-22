import { DateTime } from 'luxon';
import * as userRepository from './repository';
import { UserCreateIn, UserLoginIn, UserOut } from './dtos';
import { compareHash, generateToken, generateApiKey, hashPassword } from './auth';

export async function validateLogin(user: UserLoginIn): Promise<string | null> {
  try {
    const password: string | null = await userRepository.getPassword(user.username);
    if (password === null) throw new Error('Invalid credentials');
    const isPasswordValid = await compareHash(user.password, password);

    if (isPasswordValid) {
      const userId = await userRepository.getUserIdByUsername(user.username);
      if (userId === null) throw new Error('Invalid credentials');
      const token = generateToken(userId);
      return token;
    } else {
      throw new Error('Invalid credentials');
    }
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
export async function getByUserId(userId: string) {
  try {
    const username = await userRepository.getUsernameByUserId(userId);
    if (username === null) throw new Error('Invalid credentials');
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

export async function getApiToken(username: string): Promise<string> {
  try {
    const apiToken = generateApiKey(username);
    return apiToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
