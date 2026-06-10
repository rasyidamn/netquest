export declare class ProgressService {
    static getMyProgress: (userId: string) => Promise<{
        moduleId: string;
        title: string;
        sequence: number;
        status: string;
        bestScore: number;
        currentLessonId: string;
    }[]>;
    /**
     * Endpoint 2: GET /api/progress/all (Admin)
     * Menarik rekap data progres seluruh mahasiswa untuk dashboard Admin.
     */
    static getAllProgress: () => Promise<any[]>;
}
//# sourceMappingURL=progress.service.d.ts.map