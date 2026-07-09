type GetProgressStatsType = {
	currentLevel: number;
	nextLevelMinXp: number;
	xpIntoCurrentLevel: number;
	xpNeededForNextLevel: number;
	progressPercentage: number;
};

export class LevelingEngine {
	private static readonly BASE_EXP = 30;

	static calculateLevel = (totalXp: number): number => {
		if (totalXp >= 9999) return 11;
		const level = Math.floor(Math.sqrt(totalXp / this.BASE_EXP)) + 1;
		return Math.min(level, 10);
	};

	static getXpThresholdForLevel = (level: number): number => {
		if (level >= 11) return 9999;
		if (level <= 1) return 0;
		return Math.pow(level - 1, 2) * this.BASE_EXP;
	};

	static getProgressStats = (totalXp: number): GetProgressStatsType => {
		const currentLevel = this.calculateLevel(totalXp);
		const nextLevel = currentLevel + 1;

		const currentLevelMinXp = this.getXpThresholdForLevel(currentLevel);
		const nextLevelMinXp = this.getXpThresholdForLevel(nextLevel);

		const xpIntoCurrentLevel = totalXp - currentLevelMinXp;
		const xpNeededForNextLevel = nextLevelMinXp - currentLevelMinXp;

		const progressPercentage = Math.floor(
			(xpIntoCurrentLevel / xpNeededForNextLevel) * 100,
		);

		return {
			currentLevel,
			nextLevelMinXp,
			xpIntoCurrentLevel,
			xpNeededForNextLevel,
			progressPercentage,
		};
	};
}
