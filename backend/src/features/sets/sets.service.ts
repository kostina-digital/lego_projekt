import { SetFilters, SetPagination, SortColumn, SortOrder } from './types/filters.js';
import { countSets, listSets, getSetDetail, getSetParts } from './sets.repo.js';

export function buildFilters(query: any): { filters: SetFilters; sortColumn: SortColumn; order: SortOrder; pagination: SetPagination } {
  const filters: SetFilters = {};

  if (query.search) filters.search = String(query.search);
  if (query.theme_id) filters.themeId = parseInt(query.theme_id as string, 10);
  if (query.year_from) filters.yearFrom = parseInt(query.year_from as string, 10);
  if (query.year_to) filters.yearTo = parseInt(query.year_to as string, 10);
  if (query.min_parts) filters.minParts = parseInt(query.min_parts as string, 10);
  if (query.max_parts) filters.maxParts = parseInt(query.max_parts as string, 10);

  const page = parseInt(query.page as string, 10) || 1;
  const limit = parseInt(query.limit as string, 10) || 20;

  const sortBy = (query.sort_by as string) || 'year';
  const sortOrder = (query.sort_order as string) || 'DESC';

  const validSortColumns: SortColumn[] = ['year', 'name', 'num_parts', 'set_num'];
  const sortColumn = validSortColumns.includes(sortBy as SortColumn) ? (sortBy as SortColumn) : 'year';
  const order: SortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { filters, sortColumn, order, pagination: { page, limit } };
}

export function buildWhere(filters: SetFilters) {
  const whereConditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.search) {
    whereConditions.push(`s.name ILIKE $${paramIndex}`);
    params.push(`%${filters.search}%`);
    paramIndex++;
  }
  if (filters.themeId) {
    whereConditions.push(`s.theme_id = $${paramIndex}`);
    params.push(filters.themeId);
    paramIndex++;
  }
  if (filters.yearFrom) {
    whereConditions.push(`s.year >= $${paramIndex}`);
    params.push(filters.yearFrom);
    paramIndex++;
  }
  if (filters.yearTo) {
    whereConditions.push(`s.year <= $${paramIndex}`);
    params.push(filters.yearTo);
    paramIndex++;
  }
  if (filters.minParts) {
    whereConditions.push(`s.num_parts >= $${paramIndex}`);
    params.push(filters.minParts);
    paramIndex++;
  }
  if (filters.maxParts) {
    whereConditions.push(`s.num_parts <= $${paramIndex}`);
    params.push(filters.maxParts);
    paramIndex++;
  }

  const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';
  return { whereClause, params };
}

export async function listSetsWithMeta(query: any) {
  const { filters, sortColumn, order, pagination } = buildFilters(query);
  const { whereClause, params } = buildWhere(filters);

  const total = await countSets(filters, whereClause, params);
  const offset = (pagination.page - 1) * pagination.limit;
  const data = await listSets(filters, whereClause, params, sortColumn, order, pagination.limit, offset);

  return {
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}

export async function getSetWithParts(setNum: string) {
  const set = await getSetDetail(setNum);
  if (!set) return null;
  const parts = await getSetParts(setNum);
  return { ...set, parts, parts_count: parts.length };
}

