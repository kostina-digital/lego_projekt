import { statsByYear, statsByTheme, overviewStats, partsDistribution } from './stats.repo.js';

export async function getStatsByYear() {
  return statsByYear();
}

export async function getStatsByTheme() {
  return statsByTheme();
}

export async function getOverview() {
  return overviewStats();
}

export async function getPartsDistribution() {
  return partsDistribution();
}

