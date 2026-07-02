// Backend Leveling Engine — Rumus dari backend
// Level = floor(sqrt(totalXp / BASE_EXP)) + 1, dengan BASE_EXP = 100
// Sumber: backend/src/utils/leveling.engine.ts

export const BASE_EXP = 100;

/**
 * Menghitung level berdasarkan total XP (sama dengan rumus backend)
 * Level = floor(sqrt(totalXp / BASE_EXP)) + 1
 */
export function calculateLevel(totalXp: number): number {
	return Math.floor(Math.sqrt(totalXp / BASE_EXP)) + 1;
}

/**
 * Mendapatkan threshold XP yang dibutuhkan untuk mencapai level tertentu
 */
export function getXpThresholdForLevel(level: number): number {
	if (level <= 1) return 0;
	return Math.pow(level - 1, 2) * BASE_EXP;
}

/**
 * Mendapatkan statistik progres XP untuk UI (progress bar)
 */
export function getLevelProgress(totalXp: number): {
	level: number;
	xpInCurrentLevel: number;
	xpRequiredForNext: number;
	percentage: number;
} {
	const level = calculateLevel(totalXp);
	const currentThreshold = getXpThresholdForLevel(level);
	const nextThreshold = getXpThresholdForLevel(level + 1);

	const xpInCurrentLevel = totalXp - currentThreshold;
	const xpRequiredForNext = nextThreshold - currentThreshold;

	const percentage = Math.max(
		0,
		Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100)),
	);

	return { level, xpInCurrentLevel, xpRequiredForNext, percentage };
}