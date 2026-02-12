export interface SetFilters {
  search?: string;
  themeId?: number;
  yearFrom?: number;
  yearTo?: number;
  minParts?: number;
  maxParts?: number;
}

export interface SetPagination {
  page: number;
  limit: number;
}

export type SortColumn = 'year' | 'name' | 'num_parts' | 'set_num';
export type SortOrder = 'ASC' | 'DESC';

