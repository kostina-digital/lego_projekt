import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Credentials, RegisterPayload } from './types/credentials.js';
import {
  findUserByUsername,
  findUserByUsernameOrEmail,
  createUser,
  createSession,
  deleteSessionByToken,
  findSessionWithUser,
  findUserById,
  listUsers,
} from './auth.repo.js';
import { SessionRecord } from './types/session.js';

export async function register(payload: RegisterPayload) {
  const { username, email, password } = payload;

  const existing = await findUserByUsernameOrEmail(username, email);
  if (existing) {
    throw new Error('Username or email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(username, email, passwordHash);

  const token = uuidv4();
  await createSession(user.id, token, 7);

  return { user, token };
}

export async function login(credentials: Credentials) {
  const { username, password } = credentials;
  const user = await findUserByUsername(username);

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid username or password');
  }

  const token = uuidv4();
  await createSession(user.id, token, 7);

  return { user, token };
}

export async function logout(token: string | undefined) {
  if (!token) return;
  await deleteSessionByToken(token);
}

export async function getCurrentUser(userId: number) {
  return findUserById(userId);
}

export async function validateSession(token: string | null): Promise<(SessionRecord & { username: string }) | null> {
  if (!token) return null;
  return findSessionWithUser(token);
}

export async function getAllUsers(limit?: number) {
  return listUsers(limit);
}

