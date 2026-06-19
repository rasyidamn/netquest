export class LevelingEngine {
    static BASE_EXP = 100;
    static calculateLevel = (totalXp) => {
        return Math.floor(Math.sqrt(totalXp / this.BASE_EXP)) + 1;
    };
    static getXpThresholdForLevel = (level) => {
        if (level <= 1)
            return 0;
        return Math.pow(level - 1, 2) * this.BASE_EXP;
    };
    static getProgressStats = (totalXp) => {
        const currentLevel = this.calculateLevel(totalXp);
        const nextLevel = currentLevel + 1;
        const currentLevelMinXp = this.getXpThresholdForLevel(currentLevel);
        const nextLevelMinXp = this.getXpThresholdForLevel(nextLevel);
        const xpIntoCurrentLevel = totalXp - currentLevelMinXp;
        const xpNeededForNextLevel = nextLevelMinXp - currentLevelMinXp;
        const progressPercentage = Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100);
        return {
            currentLevel,
            nextLevelMinXp,
            xpIntoCurrentLevel,
            xpNeededForNextLevel,
            progressPercentage,
        };
    };
}
//# sourceMappingURL=leveling.engine.js.map