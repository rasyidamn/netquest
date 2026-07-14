import { Link, useLocation } from "@tanstack/react-router";
import {
	LayoutDashboard,
	BookOpen,
	Users,
	BarChart,
	Menu,
	LogOut,
} from "lucide-react";
import clsx from "clsx";
import { useLogout } from "@/feature/auth/hooks/useLogout";
import { useProfile } from "@/feature/auth/hooks";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const ADMIN_MENUS = [
	{
		title: "Dashboard",
		icon: <LayoutDashboard className="w-5 h-5" />,
		path: "/admin",
	},
	{
		title: "Manajemen Konten",
		icon: <BookOpen className="w-5 h-5" />,
		path: "/admin/content",
	},
	{
		title: "Manajemen Pengguna",
		icon: <Users className="w-5 h-5" />,
		path: "/admin/users",
	},
	{
		title: "Laporan & Analitik",
		icon: <BarChart className="w-5 h-5" />,
		path: "/admin/reports",
	},
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const { data: user } = useProfile();
	const { mutate: logout } = useLogout();

	return (
		<div className="drawer lg:drawer-open min-h-screen bg-base-200">
			<input
				id="admin-drawer"
				type="checkbox"
				className="drawer-toggle"
			/>

			<div className="drawer-content flex flex-col items-stretch">
				{/* Mobile Navbar - Only visible on small screens to toggle drawer */}
				<div className="w-full navbar bg-base-100 lg:hidden shadow-sm">
					<div className="flex-none">
						<label
							htmlFor="admin-drawer"
							aria-label="open sidebar"
							className="btn btn-square btn-ghost"
						>
							<Menu className="w-6 h-6" />
						</label>
					</div>
					<div className="flex-1 px-2 mx-2 font-bold text-xl text-primary">
						Admin Panel
					</div>
					<div className="flex-none">
						<ThemeToggle />
					</div>
				</div>

				{/* Main Content Area */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
			</div>

			{/* Sidebar Area */}
			<div className="drawer-side z-40 shadow-xl lg:shadow-none">
				<label
					htmlFor="admin-drawer"
					aria-label="close sidebar"
					className="drawer-overlay"
				></label>
				<div className="menu p-4 w-72 min-h-full bg-base-100 text-base-content flex flex-col">
					{/* Sidebar Header / Logo */}
					<div className="flex items-center gap-3 px-4 py-6 mb-4">
						<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-primary-content text-xl shadow-md shadow-primary/30">
							A
						</div>
						<div>
							<h2 className="font-black text-xl tracking-tight text-base-content">
								NetQuest
							</h2>
							<p className="text-xs font-bold text-primary tracking-widest uppercase">
								Admin Panel
							</p>
						</div>
					</div>

					{/* Sidebar Menu Items */}
					<ul className="flex-1 space-y-2">
						{ADMIN_MENUS.map((menu) => {
							const isActive =
								location.pathname === menu.path ||
								(menu.path !== "/admin" &&
									location.pathname.startsWith(menu.path));

							return (
								<li key={menu.path}>
									<Link
										to={menu.path}
										className={clsx(
											"flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
											isActive
												? "bg-primary text-primary-content shadow-md shadow-primary/20 hover:bg-primary/90"
												: "hover:bg-base-200 text-base-content/80 hover:text-base-content",
										)}
									>
										{menu.icon}
										<span>{menu.title}</span>
									</Link>
								</li>
							);
						})}
					</ul>

					{/* Sidebar Footer (Profile / Logout) */}
					<div className="mt-8 border-t border-base-200 pt-6 px-2 space-y-4">
						{/* Theme Toggle Row */}
						<div className="flex items-center justify-between px-2">
							<span className="text-xs font-bold text-base-content/50 uppercase tracking-wider">Tampilan</span>
							<ThemeToggle />
						</div>
						<div className="flex items-center gap-3 px-2">
							<div className="avatar placeholder">
								<div className="bg-neutral text-neutral-content rounded-full w-10">
									<span className="font-bold">
										{user?.name?.charAt(0) || "U"}
									</span>
								</div>
							</div>
							<div className="overflow-hidden">
								<p className="font-bold text-sm truncate">
									{user?.name || "Admin User"}
								</p>
								<p className="text-xs text-base-content/60 truncate">
									{user?.nim}
								</p>
							</div>
						</div>
						<button
							onClick={() => logout()}
							className="btn btn-outline btn-error btn-sm w-full rounded-lg"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
