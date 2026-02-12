import { query } from '../../database/pool.js';

export async function listUserCollection(userId: number) {
  const result = await query(
    `SELECT 
        uc.id,
        uc.set_num,
        uc.added_at,
        uc.notes,
        s.name,
        s.year,
        s.num_parts,
        s.img_url,
        t.name as theme_name
      FROM user_collections uc
      JOIN sets s ON uc.set_num = s.set_num
      LEFT JOIN themes t ON s.theme_id = t.id
      WHERE uc.user_id = $1
      ORDER BY uc.added_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function setExists(setNum: string) {
  const setResult = await query('SELECT set_num FROM sets WHERE set_num = $1', [setNum]);
  return setResult.rows.length > 0;
}

export async function upsertCollectionItem(userId: number, setNum: string, notes?: string | null) {
  const result = await query(
    `INSERT INTO user_collections (user_id, set_num, notes)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, set_num) 
       DO UPDATE SET notes = $3, added_at = CURRENT_TIMESTAMP
       RETURNING id, set_num, added_at, notes`,
    [userId, setNum, notes || null]
  );
  return result.rows[0];
}

export async function deleteCollectionItem(userId: number, setNum: string) {
  const result = await query(
    'DELETE FROM user_collections WHERE user_id = $1 AND set_num = $2 RETURNING id',
    [userId, setNum]
  );
  return result.rows[0] || null;
}

export async function findCollectionItem(userId: number, setNum: string) {
  const result = await query(
    'SELECT id, set_num, added_at, notes FROM user_collections WHERE user_id = $1 AND set_num = $2',
    [userId, setNum]
  );
  return result.rows[0] || null;
}
