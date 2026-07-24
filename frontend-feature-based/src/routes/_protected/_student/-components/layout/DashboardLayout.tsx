import { type ReactNode } from "react";
import { useAuthStore } from "@/feature/auth/stores/useAuthStore";
import { StudentNavbar } from "./StudentNavbar";
import { StudentSidebar, LogoutConfirmDialog } from "./StudentSidebar";




interface DashboardLayoutProps {
	children: ReactNode;
}

function LogoutCurtain() {
	return (
		<div className="space-y-6 p-4 lg:p-6">
			{/* Welcome banner skeleton */}
			<div className="skeleton h-24 w-full rounded-xl" />

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					{/* Stats card skeleton */}
					<div className="skeleton h-28 w-full rounded-xl" />

					{/* Status bar skeleton */}
					<div className="skeleton h-32 w-full rounded-xl" />

					{/* Continue learning card skeleton */}
					<div className="skeleton h-20 w-full rounded-xl" />

					{/* Roadmap skeleton — 3 baris */}
					<div className="space-y-2">
						<div className="skeleton h-12 w-full rounded-lg" />
						<div className="skeleton h-12 w-full rounded-lg" />
						<div className="skeleton h-12 w-full rounded-lg" />
					</div>
				</div>
				<div className="space-y-6">
					{/* Leaderboard skeleton — 5 baris */}
					<div className="space-y-2">
						<div className="skeleton h-10 w-full rounded-lg" />
						<div className="skeleton h-10 w-full rounded-lg" />
						<div className="skeleton h-10 w-full rounded-lg" />
						<div className="skeleton h-10 w-full rounded-lg" />
						<div className="skeleton h-10 w-full rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const isLoggingOut = useAuthStore((s) => s.isLoggingOut);

	return (
		<div className="drawer lg:drawer-open">
			<input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				{/* Navbar */}
				<StudentNavbar />
				{/* Page content here */}
				<main className="flex-1">
					{isLoggingOut ? <LogoutCurtain /> : children}
				</main>
			</div>

			<StudentSidebar />
			<LogoutConfirmDialog />
		</div>
	);
}
