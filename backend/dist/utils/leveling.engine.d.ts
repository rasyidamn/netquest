type GetProgressStatsType = {
    currentLevel: number;
    nextLevelMinXp: number;
    xpIntoCurrentLevel: number;
    xpNeededForNextLevel: number;
    progressPercentage: number;
};
export declare class LevelingEngine {
    private static readonly BASE_EXP;
    static calculateLevel: (totalXp: number) => number;
    static getXpThresholdForLevel: (level: number) => number;
    static getProgressStats: (totalXp: number) => GetProgressStatsType;
}
export {};
//# sourceMappingURL=leveling.engine.d.ts.map