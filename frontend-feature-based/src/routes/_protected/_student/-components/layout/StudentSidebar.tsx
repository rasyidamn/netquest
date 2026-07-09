import { Link } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { getCurrentRank } from "@/utils/rank.util";
import { useLogout } from "@/feature/auth/hooks/useLogout";
import NetQuestLogo from "@/public/netquest-logo.svg?react";
import { useProfile } from "@/feature/auth/hooks/useProfile";
import {
	LayoutDashboard,
	LogOut,
	MapIcon,
	TrophyIcon,
} from "lucide-react";

interface NavigationItem {
	path: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
}

const MAIN_MENUS: NavigationItem[] = [
	{ path: "/dashboard", label: "Pusat Komando", icon: LayoutDashboard },
	{ path: "/roadmap", label: "Peta Perjalanan", icon: MapIcon },
	{ path: "/leaderboard", label: "Papan Peringkat", icon: TrophyIcon },
];

export function StudentSidebar() {
	const { mutate: logout } = useLogout();
	const { data: user } = useProfile();

	const getInitials = (name?: string) => {
		if (!name) return "M";
		return name.substring(0, 2).toUpperCase();
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="drawer-side is-drawer-close:overflow-visible z-60">
			<label
				htmlFor="my-drawer-4"
				aria-label="close sidebar"
				className="drawer-overlay backdrop-blur-sm bg-base-300/30 transition-all duration-500"
			></label>

			{/* Latar Belakang Glassmorphism Utama */}
			<div className="flex min-h-full flex-col items-start bg-base-200/70 backdrop-blur-2xl border-r border-white/5 shadow-[4px_0_30px_rgba(0,0,0,0.1)] is-drawer-close:w-20 is-drawer-open:w-72  relative overflow-hidden">
				{/* Cahaya Ambient Tersembunyi (Kiri Atas) */}
				<div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

				{/* Logo */}
				<div className="flex h-20 w-full items-center justify-center border-b border-white/5 relative z-10 is-drawer-close:hidden">
					<Link
						to="/dashboard"
						className="transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
					>
						<NetQuestLogo className="h-fit w-40" />
					</Link>
				</div>

				{/* Grup Atas: Menu navigasi utama */}
				<ul className="menu w-full grow flex-nowrap overflow-y-clip space-y-3 pt-6 px-3 relative z-10">
					{MAIN_MENUS.map((menu) => (
						<li key={menu.path}>
							<Link
								to={menu.path as any}
								activeProps={{
									className:
										"bg-gradient-to-r from-primary/15 to-transparent border-l-[4px] border-primary text-primary shadow-[inset_0_0_20px_rgba(var(--color-primary),0.05)]",
								}}
								className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-4 px-4 py-3.5 rounded-r-xl border-l-[4px] border-transparent text-base-content/60 hover:bg-base-100/50 hover:text-base-content hover:border-white/10 transition-all duration-300 group"
								data-tip={menu.label}
							>
								<menu.icon className="size-5.5 shrink-0 transition-transform duration-300 group-hover:scale-110 group-[.active]:drop-shadow-[0_0_8px_rgba(var(--color-primary),0.6)]" />
								<span className="is-drawer-close:hidden truncate font-bold tracking-wide">
									{menu.label}
								</span>
							</Link>
						</li>
					))}
				</ul>

				{/* Grup Bawah: Profil & Logout */}
				<ul className="menu mt-auto w-full border-t border-white/5 pb-4 pt-4 px-3 relative z-10 bg-gradient-to-t from-base-300/30 to-transparent">
					<li className="mb-2">
						<Link
							to="/profile"
							activeProps={{
								className:
									"bg-base-100/50 border-white/10 shadow-sm pointer-events-none",
							}}
							className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-4 py-3 px-3 rounded-2xl border border-transparent hover:bg-base-100/30 hover:border-white/5 transition-all duration-300"
							data-tip="Identitas Pemain"
						>
							{/* Desain Avatar Glow */}
							<div className="avatar shrink-0 relative">
								<div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
								<div className="bg-gradient-to-br from-primary to-secondary text-primary-content size-11 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary),0.4)] border-2 border-base-200 relative z-10">
									<span className="text-sm font-black tracking-widest drop-shadow-sm">
										{getInitials(user?.name)}
									</span>
								</div>
							</div>

							{/* Detail Pemain */}
							<div className="is-drawer-close:hidden flex flex-col items-start overflow-hidden">
								<span className="truncate w-full font-black text-sm leading-tight text-base-content">
									{user?.name || "Nama Mahasiswa"}
								</span>
								<div className="flex items-center gap-1.5 mt-1">
									<span className="relative flex h-1.5 w-1.5">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
										<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
									</span>
									<span className="truncate w-full text-[10px] uppercase tracking-widest text-primary font-bold">
										{getCurrentRank(user?.xp ?? 0).title ||
											"Level Belum Ada"}
									</span>
								</div>
							</div>
						</Link>
					</li>

					{/* Tombol Logout (Eject) */}
					<li>
						<button
							onClick={handleLogout}
							className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-4 px-4 py-3.5 rounded-xl text-error/70 hover:text-error hover:bg-error/10 hover:shadow-[inset_0_0_20px_rgba(var(--color-error),0.15)] border border-transparent hover:border-error/20 transition-all duration-300 w-full group"
							data-tip="Keluar Sistem"
						>
							<LogOut className="size-[22px] shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
							<span className="is-drawer-close:hidden font-bold tracking-wide">
								Keluar Sistem
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
