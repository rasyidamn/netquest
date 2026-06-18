// Ekstrak tipe data sesuai aturan verbatimModuleSyntax
export interface RankTier {
	level: number;
	title: string;
	minXp: number;
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

// Konfigurasi Pangkat Tema Jaringan Komputer
export const RANKS: RankTier[] = [
	{
		level: 1,
		title: "Network Novice",
		minXp: 0,
		colorClass: "text-base-content",
	},
	{ level: 2, title: "Active Node", minXp: 500, colorClass: "text-info" },
	{
		level: 3,
		title: "Switch Technician",
		minXp: 1200,
		colorClass: "text-success",
	},
	{
		level: 4,
		title: "Router Admin",
		minXp: 2200,
		colorClass: "text-warning",
	},
	{
		level: 5,
		title: "System Architect",
		minXp: 3500,
		colorClass: "text-primary",
	},
	// Level 6 dihapus, atau jadikan gelar ultimate rahasia jika user mendapat 100% perfect score
	{
		level: 6,
		title: "Master Gateway",
		minXp: 4000,
		colorClass: "text-error",
	},
];

/**
 * Mendapatkan Pangkat saat ini berdasarkan total XP
 */
export const getCurrentRank = (totalXp: number): RankTier => {
	// Iterasi dari pangkat tertinggi ke terendah
	for (let i = RANKS.length - 1; i >= 0; i--) {
		if (totalXp >= RANKS[i].minXp) {
			return RANKS[i];
		}
	}
	return RANKS[0]; // Fallback ke pangkat terendah
};

/**
 * Menghitung kalkulasi progres XP untuk UI (progress bar)
 */
export const getRankProgress = (totalXp: number): RankProgress => {
	const currentRank = getCurrentRank(totalXp);
	const currentRankIndex = RANKS.findIndex(
		(r) => r.level === currentRank.level,
	);
	const nextRank = RANKS[currentRankIndex + 1] || null;

	if (!nextRank) {
		// Jika user sudah mencapai pangkat maksimum
		return {
			currentRank,
			nextRank: null,
			xpInCurrentLevel: totalXp - currentRank.minXp,
			xpRequiredForNext: 0,
			percentage: 100,
			isMaxRank: true,
		};
	}

	// Logika kalkulasi batas rentang XP
	const xpInCurrentLevel = totalXp - currentRank.minXp;
	const xpRequiredForNext = nextRank.minXp - currentRank.minXp;

	// Hindari pembagian dengan nol, amankan angka desimal
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
