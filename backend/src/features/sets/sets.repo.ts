import { query } from '../../database/pool.js';
import { SetFilters, SortColumn, SortOrder } from './types/filters.js';

export async function countSets(filters: SetFilters, whereClause: string, params: any[]) {
  const countQuery = `
    SELECT COUNT(*) as total
    FROM sets s
    ${whereClause}
  `;
  const countResult = await query(countQuery, params);
  return parseInt(countResult.rows[0].total);
}

export async function listSets(
  filters: SetFilters,
  whereClause: string,
  params: any[],
  sortColumn: SortColumn,
  order: SortOrder,
  limit: number,
  offset: number
) {
  const dataQuery = `
      SELECT 
        s.id,
        s.set_num,
        s.name,
        s.year,
        s.theme_id,
        t.name as theme_name,
        s.num_parts,
        s.img_url
      FROM sets s
      LEFT JOIN themes t ON s.theme_id = t.id
      ${whereClause}
      ORDER BY s.${sortColumn} ${order}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
  const dataResult = await query(dataQuery, [...params, limit, offset]);
  return dataResult.rows;
}

export async function getSetDetail(setNum: string) {
  const setQuery = `
      SELECT 
        s.id,
        s.set_num,
        s.name,
        s.year,
        s.theme_id,
        t.name as theme_name,
        t.parent_id,
        pt.name as parent_theme_name,
        s.num_parts,
        s.img_url,
        s.created_at
      FROM sets s
      LEFT JOIN themes t ON s.theme_id = t.id
      LEFT JOIN themes pt ON t.parent_id = pt.id
      WHERE s.set_num = $1
    `;
  const setResult = await query(setQuery, [setNum]);
  return setResult.rows[0] || null;
}

export async function getSetParts(setNum: string) {
  const partsQuery = `
      SELECT 
        p.part_num,
        p.name as part_name,
        c.id as color_id,
        c.name as color_name,
        c.rgb,
        c.is_trans,
        ip.quantity,
        ip.is_spare
      FROM inventories i
      JOIN inventory_parts ip ON i.id = ip.inventory_id
      JOIN parts p ON ip.part_num = p.part_num
      JOIN colors c ON ip.color_id = c.id
      WHERE i.set_num = $1
      ORDER BY ip.quantity DESC, p.name
    `;
  const partsResult = await query(partsQuery, [setNum]);
  return partsResult.rows;
}
