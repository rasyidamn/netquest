import { Link, useRouter } from "@tanstack/react-router";
import {
	IconLayoutDashboard,
	IconBook2,
	IconChartBar,
	IconLogout,
	IconX,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";
import NetQuestLogo from "../NetQuestLogo";

interface AdminSidebarProps {
	open: boolean;
	onClose: () => void;
}

const navItems = [
	{ label: "Dashboard", path: "/admin", icon: IconLayoutDashboard },
	{ label: "Modul", path: "/admin/modules", icon: IconBook2 },
	{ label: "Progress", path: "/admin/progress", icon: IconChartBar },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
	const { user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.navigate({ to: "/auth/login" });
	};

	return (
		<>
			{/* Mobile overlay */}
			{open && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-base-200 transition-transform duration-200 lg:static lg:translate-x-0",
					open ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{/* Logo */}
				<div className="flex h-16 items-center justify-between border-b border-base-300 px-6">
					<Link
						to="/admin"
						className="text-xl font-bold text-foreground"
					>
						<NetQuestLogo className="w-40 h-fit"/>
					</Link>
					<button
						onClick={onClose}
						className="btn btn-ghost btn-square btn-sm lg:hidden"
					>
						<IconX size={20} />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 p-4">
					{navItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							onClick={onClose}
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-base-300 [&.active]:bg-base-300"
						>
							<item.icon size={20} />
							{item.label}
						</Link>
					))}
				</nav>

				{/* User info & Logout */}
				{user && (
					<div className="border-t border-base-300 p-4 space-y-2">
						<div className="flex items-center gap-3">
							<div className="avatar placeholder">
								<div className="w-10 rounded-full bg-primary text-primary-content">
									<span className="text-sm font-bold">
										{user.name.charAt(0).toUpperCase()}
									</span>
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<p className="truncate text-sm font-medium">
									{user.name}
								</p>
								<p className="truncate text-xs text-base-content/60">
									{user.nim}
								</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className="btn btn-ghost btn-sm w-full gap-2"
						>
							<IconLogout size={18} />
							Logout
						</button>
					</div>
				)}
			</aside>
		</>
	);
}