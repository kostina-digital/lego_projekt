import { query } from '../../database/pool.js';

export async function statsByYear() {
  const sql = `
      SELECT 
        year,
        COUNT(*) as set_count,
        SUM(num_parts) as total_parts,
        AVG(num_parts)::INTEGER as avg_parts,
        MIN(num_parts) as min_parts,
        MAX(num_parts) as max_parts
      FROM sets
      GROUP BY year
      ORDER BY year DESC
    `;
  const result = await query(sql);
  return result.rows;
}

export async function statsByTheme() {
  const sql = `
      SELECT 
        t.id as theme_id,
        t.name as theme_name,
        COUNT(s.id) as set_count,
        SUM(s.num_parts) as total_parts,
        AVG(s.num_parts)::INTEGER as avg_parts,
        MIN(s.year) as first_year,
        MAX(s.year) as last_year
      FROM themes t
      LEFT JOIN sets s ON t.id = s.theme_id
      GROUP BY t.id, t.name
      HAVING COUNT(s.id) > 0
      ORDER BY set_count DESC
      LIMIT 20
    `;
  const result = await query(sql);
  return result.rows;
}

export async function overviewStats() {
  const sql = `
      SELECT 
        (SELECT COUNT(*) FROM sets) as total_sets,
        (SELECT COUNT(*) FROM themes) as total_themes,
        (SELECT COUNT(*) FROM parts) as total_unique_parts,
        (SELECT SUM(num_parts) FROM sets) as total_parts_in_all_sets,
        (SELECT AVG(num_parts)::INTEGER FROM sets) as avg_parts_per_set,
        (SELECT MIN(year) FROM sets) as earliest_year,
        (SELECT MAX(year) FROM sets) as latest_year,
        (SELECT name FROM sets ORDER BY num_parts DESC LIMIT 1) as largest_set_name,
        (SELECT num_parts FROM sets ORDER BY num_parts DESC LIMIT 1) as largest_set_parts
    `;
  const result = await query(sql);
  return result.rows[0];
}

export async function partsDistribution() {
  const sql = `
      SELECT 
        CASE
          WHEN num_parts < 100 THEN '0-99'
          WHEN num_parts < 500 THEN '100-499'
          WHEN num_parts < 1000 THEN '500-999'
          WHEN num_parts < 2000 THEN '1000-1999'
          WHEN num_parts < 5000 THEN '2000-4999'
          ELSE '5000+'
        END as parts_range,
        COUNT(*) as set_count
      FROM sets
      GROUP BY parts_range
      ORDER BY 
        CASE parts_range
          WHEN '0-99' THEN 1
          WHEN '100-499' THEN 2
          WHEN '500-999' THEN 3
          WHEN '1000-1999' THEN 4
          WHEN '2000-4999' THEN 5
          WHEN '5000+' THEN 6
        END
    `;
  const result = await query(sql);
  return result.rows;
}
