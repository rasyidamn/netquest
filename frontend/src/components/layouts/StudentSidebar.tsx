import { Link, useRouter } from "@tanstack/react-router";
import {
	IconLayoutDashboard,
	IconMap,
	IconTrophy,
	IconHistory,
	IconUser,
	IconLogout,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import NetQuestLogo from "../NetQuestLogo";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile } from "@/hooks/auth/useProfile";
import { getCurrentRank } from "@/utils/rank.util";
import { useLogout } from "@/hooks/auth/useLogout";

interface NavigationItem {
	path: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
}

const MAIN_MENUS: NavigationItem[] = [
	{ path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
	{ path: "/roadmap", label: "Peta Belajar", icon: IconMap },
	{ path: "/leaderboard", label: "Leaderboard", icon: IconTrophy },
	{ path: "/history", label: "Riwayat Kuis", icon: IconHistory },
];

export function StudentSidebar() {
	const router = useRouter();
	const { mutate: logout } = useLogout();
	const { data: user } = useProfile();

	const getInitials = (name?: string) => {
		if (!name) return "M";
		return name.substring(0, 2).toUpperCase();
	};

	const handleLogout = () => {
		logout();
		router.navigate({ to: "/auth/login" });
	};

	return (
		<div className="drawer-side is-drawer-close:overflow-visible z-50">
			<label
				htmlFor="my-drawer-4"
				aria-label="close sidebar"
				className="drawer-overlay"
			></label>

			{/* PERUBAHAN 1: is-drawer-close:w-14 diubah menjadi w-20 */}
			<div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-20 is-drawer-open:w-64 transition-all duration-300">
				{/* Logo */}
				<div className="flex h-16 w-full items-center border-b border-base-300 px-4 is-drawer-close:hidden">
					<Link to="/dashboard">
						<NetQuestLogo className="h-fit w-50 mt-6" />
					</Link>
				</div>

				{/* Grup Atas: Menu navigasi utama */}
				<ul className="menu w-full grow flex-nowrap overflow-y-clip space-y-2 pt-4">
					{MAIN_MENUS.map((menu) => (
						<li key={menu.path}>
							<Link
								to={menu.path as any}
								activeProps={{
									className:
										"active bg-primary/10 text-primary",
								}}
								className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-3 px-4 py-3"
								data-tip={menu.label}
							>
								<menu.icon className="size-6 shrink-0" />
								<span className="is-drawer-close:hidden truncate font-medium">
									{menu.label}
								</span>
							</Link>
						</li>
					))}
				</ul>

				{/* Grup Bawah: Profil & Logout */}
				<ul className="menu mt-auto w-full border-t border-base-300 pb-4 pt-2">
					<li>
						<Link
							to="/profile"
							activeProps={{ className: "active bg-base-300" }}
							className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-3 py-3 px-4"
							data-tip="Profil"
						>
							{/* PERUBAHAN 4: Perbesar avatar dari size-8 ke size-10 */}
							<div className="avatar placeholder shrink-0">
								<div className="bg-primary text-primary-content size-10 rounded-full flex items-center justify-center">
									<span className="text-sm font-bold">
										{getInitials(user?.name)}
									</span>
								</div>
							</div>

							<div className="is-drawer-close:hidden flex flex-col items-start overflow-hidden">
								<span className="truncate w-full font-semibold text-sm leading-tight">
									{user?.name || "Nama Mahasiswa"}
								</span>
								<span className="truncate w-full text-xs text-primary font-medium mt-0.5">
									{getCurrentRank(user?.xp ?? 0).title ||
										"Pangkat Belum Ada"}
								</span>
							</div>
						</Link>
					</li>

					<li>
						<button
							onClick={handleLogout}
							className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center is-drawer-close:justify-center is-drawer-open:justify-start gap-x-3 px-4 py-3 text-error hover:bg-error/10"
							data-tip="Keluar"
						>
							<IconLogout className="size-6 shrink-0" />
							<span className="is-drawer-close:hidden font-medium">
								Keluar
							</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
}
