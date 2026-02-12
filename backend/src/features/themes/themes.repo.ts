import { query } from '../../database/pool.js';

export async function listThemesWithCounts() {
  const themesQuery = `
      SELECT 
        t.id,
        t.name,
        t.parent_id,
        pt.name as parent_name,
        COUNT(s.id) as set_count
      FROM themes t
      LEFT JOIN themes pt ON t.parent_id = pt.id
      LEFT JOIN sets s ON t.id = s.theme_id
      GROUP BY t.id, t.name, t.parent_id, pt.name
      ORDER BY set_count DESC, t.name
    `;
  const result = await query(themesQuery);
  return result.rows;
}

export async function findThemeById(id: number) {
  const themeQuery = `
      SELECT 
        t.id,
        t.name,
        t.parent_id,
        pt.name as parent_name
      FROM themes t
      LEFT JOIN themes pt ON t.parent_id = pt.id
      WHERE t.id = $1
    `;
  const themeResult = await query(themeQuery, [id]);
  return themeResult.rows[0] || null;
}

export async function listSetsForTheme(id: number) {
  const setsQuery = `
      SELECT 
        s.id,
        s.set_num,
        s.name,
        s.year,
        s.num_parts,
        s.img_url
      FROM sets s
      WHERE s.theme_id = $1
      ORDER BY s.year DESC, s.name
    `;
  const setsResult = await query(setsQuery, [id]);
  return setsResult.rows;
}
