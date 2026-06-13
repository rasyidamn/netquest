import { useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
	IconLayoutDashboard,
	IconBook2,
	IconChartBar,
	IconLogout,
	IconMenu2,
	IconX,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "../ThemeToggle";

interface AdminLayoutProps {
	children: ReactNode;
}

const navItems = [
	{ label: "Dashboard", path: "/admin", icon: IconLayoutDashboard },
	{ label: "Modul", path: "/admin/modules", icon: IconBook2 },
	{ label: "Progress", path: "/admin/progress", icon: IconChartBar },
];

export function AdminLayout({ children }: AdminLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.navigate({ to: "/auth/login" });
	};

	return (
		<div className="flex min-h-screen bg-background">
			{/* Mobile overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0",
					sidebarOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{/* Logo */}
				<div className="flex h-16 items-center justify-between border-b px-6">
					<Link
						to="/admin"
						className="text-xl font-bold text-foreground"
					>
						NetQuest
					</Link>
					<button
						onClick={() => setSidebarOpen(false)}
						className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
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
							onClick={() => setSidebarOpen(false)}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								"text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								"[&.active]:bg-accent [&.active]:text-accent-foreground",
							)}
						>
							<item.icon size={20} />
							{item.label}
						</Link>
					))}
				</nav>

				{/* User info */}
				{user && (
					<div className="border-t p-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
								{user.name.charAt(0).toUpperCase()}
							</div>
							<div className="flex-1 min-w-0">
								<p className="truncate text-sm font-medium text-foreground">
									{user.name}
								</p>
								<p className="truncate text-xs text-muted-foreground">
									{user.nim}
								</p>
							</div>
						</div>
					</div>
				)}
			</aside>

			{/* Main content */}
			<div className="flex flex-1 flex-col">
				{/* Navbar */}
				<header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
					<button
						onClick={() => setSidebarOpen(true)}
						className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
					>
						<IconMenu2 size={20} />
					</button>

					<div className="flex-1" />

					<div className="flex items-center gap-2">
						<ThemeToggle />
						<button
							onClick={handleLogout}
							className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							<IconLogout size={18} />
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
