import { useState, type ReactNode } from "react";
import { IconMenu2, IconLogout } from "@tabler/icons-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "@tanstack/react-router";
import { ThemeToggle } from "../ThemeToggle";

interface AdminLayoutProps {
	children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.navigate({ to: "/auth/login" });
	};

	return (
		<div className="flex min-h-screen bg-background">
			<AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex flex-1 flex-col">
				<header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
					<button
						onClick={() => setSidebarOpen(true)}
						className="btn btn-ghost btn-square lg:hidden"
					>
						<IconMenu2 size={20} />
					</button>

					<div className="flex-1" />

					<div className="flex items-center gap-2">
						<ThemeToggle />
						<button
							onClick={handleLogout}
							className="btn btn-ghost btn-sm gap-2"
						>
							<IconLogout size={18} />
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>
				</header>

				<main className="flex-1 p-4 lg:p-6">{children}</main>
			</div>
		</div>
	);
}
