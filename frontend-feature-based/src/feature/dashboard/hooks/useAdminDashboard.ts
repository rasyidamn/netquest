import { useQuery } from "@tanstack/react-query";
import { adminDashboardApi } from "../api/adminDashboardApi";

export const useAdminDashboard = () => {
	return useQuery({
		queryKey: ["admin-dashboard-stats"],
		queryFn: () => adminDashboardApi.getStats(),
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});
};
