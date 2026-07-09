// Ekstrak tipe data sesuai aturan verbatimModuleSyntax
export interface RankTier {
	level: number;
	title: string;
	colorClass: string; // Kelas warna daisyUI untuk styling dinamis
}

export interface RankProgress {
	currentRank: RankTier;
	nextRank: RankTier | null;
	xpInCurrentLevel: number; // XP yang didapat sejak masuk pangkat ini
	xpRequiredForNext: number; // Total rentang XP di pangkat ini
	percentage: number; // 0 - 100 untuk progress bar
	isMaxRank: boolean;
}

// Konfigurasi Pangkat Tema Jaringan Komputer (dekoratif, level dihitung via rumus backend)
export const RANKS: RankTier[] = [
	{ level: 1, title: "Network Novice", colorClass: "text-base-content" },
	{ level: 2, title: "Active Node", colorClass: "text-info" },
	{ level: 3, title: "Switch Technician", colorClass: "text-success" },
	{ level: 4, title: "Router Admin", colorClass: "text-warning" },
	{ level: 5, title: "System Architect", colorClass: "text-primary" },
	{ level: 6, title: "Master Gateway", colorClass: "text-error" },
	{ level: 7, title: "Network Sentinel", colorClass: "text-secondary" },
	{ level: 8, title: "Cloud Commander", colorClass: "text-accent" },
	{ level: 9, title: "Protocol Master", colorClass: "text-info" },
	{ level: 10, title: "Internet Legend", colorClass: "text-warning" },
	{ level: 11, title: "GOAT 🐐", colorClass: "text-error drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" },
];

/**
 * Mendapatkan Pangkat saat ini berdasarkan total XP — level dihitung via rumus backend
 */
export const getCurrentRank = (totalXp: number): RankTier => {
	if (totalXp >= 9999) return RANKS[10];
	const level = Math.floor(Math.sqrt(totalXp / 30)) + 1;
	// Cari rank terdekat yang levelnya <= level hasil perhitungan
	const rankIndex = Math.min(level - 1, 9);
	return RANKS[rankIndex];
};

/**
 * Menghitung kalkulasi progres XP untuk UI (progress bar) — menggunakan rumus backend
 */
export const getRankProgress = (totalXp: number): RankProgress => {
	const currentRank = getCurrentRank(totalXp);
	const currentRankIndex = RANKS.findIndex(
		(r) => r.level === currentRank.level,
	);
	const nextRank = RANKS[currentRankIndex + 1] || null;

	// Gunakan rumus backend untuk threshold XP
	const getThresholdForLevel = (level: number): number => {
		if (level >= 11) return 9999;
		if (level <= 1) return 0;
		return Math.pow(level - 1, 2) * 30;
	};

	const currentThreshold = getThresholdForLevel(currentRank.level);
	const nextThreshold = nextRank
		? getThresholdForLevel(nextRank.level)
		: null;

	if (!nextRank || nextThreshold === null) {
		return {
			currentRank,
			nextRank: null,
			xpInCurrentLevel: totalXp - currentThreshold,
			xpRequiredForNext: 0,
			percentage: 100,
			isMaxRank: currentRankIndex >= RANKS.length - 1,
		};
	}

	const xpInCurrentLevel = totalXp - currentThreshold;
	const xpRequiredForNext = nextThreshold - currentThreshold;

	const percentage = Math.max(
		0,
		Math.min(100, Math.floor((xpInCurrentLevel / xpRequiredForNext) * 100)),
	);

	return {
		currentRank,
		nextRank,
		xpInCurrentLevel,
		xpRequiredForNext,
		percentage,
		isMaxRank: false,
	};
};
