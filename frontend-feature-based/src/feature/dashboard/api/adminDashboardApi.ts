import { apiClient } from "@/core/api/apiClient";

export interface DashboardStats {
	totalStudents: number;
	totalModules: number;
	totalLessons: number;
	totalXp: number;
	activeUsersRate: number;
	mostActiveModule: {
		id: string;
		title: string;
		interactions: number;
	} | null;
	topStudents: Array<{
		id: string;
		name: string;
		nim: string;
		xp: number;
	}>;
	recentUsers: Array<{
		id: string;
		name: string;
		nim: string;
		createdAt: string;
	}>;
}

export const adminDashboardApi = {
	getStats: async (): Promise<DashboardStats> => {
		const response = await apiClient.get("/admin-dashboard");
		return response.data.data;
	},
};
