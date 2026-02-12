import { query } from '../../database/pool.js';
import { SessionRecord } from './types/session.js';

export async function findUserByUsername(username: string) {
  const result = await query(
    'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function findUserByUsernameOrEmail(username: string, email: string) {
  const result = await query(
    'SELECT id FROM users WHERE username = $1 OR email = $2',
    [username, email]
  );
  return result.rows[0] || null;
}

export async function findUserById(id: number) {
  const result = await query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function createUser(username: string, email: string, passwordHash: string) {
  const result = await query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, passwordHash]
  );
  return result.rows[0];
}

export async function createSession(userId: number, token: string, daysValid: number) {
  await query(
    `INSERT INTO user_sessions (user_id, token, expires_at)
     VALUES ($1, $2, NOW() + ($3 || ' days')::interval)`,
    [userId, token, daysValid]
  );
}

export async function deleteSessionByToken(token: string) {
  await query('DELETE FROM user_sessions WHERE token = $1', [token]);
}

export async function findSessionWithUser(token: string): Promise<(SessionRecord & { username: string }) | null> {
  const result = await query(
    `SELECT us.user_id, us.token, us.expires_at, u.username
     FROM user_sessions us
     JOIN users u ON u.id = us.user_id
     WHERE us.token = $1 AND us.expires_at > NOW()`,
    [token]
  );
  return result.rows[0] || null;
}

export async function listUsers(limit = 200) {
  const result = await query(
    'SELECT id, username, email, created_at FROM users ORDER BY id DESC LIMIT $1',
    [limit]
  );
  return result.rows;
}
