import { findThemeById, listThemesWithCounts, listSetsForTheme } from './themes.repo.js';

export async function getThemes() {
  return listThemesWithCounts();
}

export async function getThemeWithSets(id: number) {
  const theme = await findThemeById(id);
  if (!theme) return null;
  const sets = await listSetsForTheme(id);
  return { ...theme, sets, set_count: sets.length };
}

