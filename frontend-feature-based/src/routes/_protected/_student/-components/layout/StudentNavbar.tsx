import { useRouterState } from "@tanstack/react-router";
import { useProfile } from "@/feature/auth/hooks/useProfile";
import { MenuIcon } from "lucide-react";
import { HeartDisplay, Notification, ThemeToggle, XpDisplay } from "../ui";

const titleMap: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/roadmap": "Peta Perjalanan",
	"/leaderboard": "Papan Peringkat",
	"/history": "Arsip Misi",
	"/profile": "Identitas",
};

export function StudentNavbar() {
	const { data } = useProfile();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const pageTitle = titleMap[pathname] ?? "NetQuest";

	return (
		<header className="navbar sticky top-0 z-50 bg-base-100/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] px-2 sm:px-4">
			{/* Bagian Kiri: Tombol Menu & Judul Halaman */}
			<div className="navbar-start gap-3">
				<label
					htmlFor="my-drawer-4"
					aria-label="open sidebar"
					className="btn btn-circle btn-ghost btn-sm sm:btn-md border border-transparent hover:border-white/10 hover:bg-base-200/50"
				>
					<MenuIcon size={20} className="text-base-content/80" />
				</label>

				<span className="font-black text-lg tracking-tight bg-linear-to-br from-base-content to-base-content/60 bg-clip-text text-transparent max-lg:hidden drop-shadow-sm">
					{pageTitle}
				</span>
			</div>

			{/* Bagian Tengah: Indikator HUD Pemain */}
			<div className="navbar-center gap-2 sm:gap-16">
				<XpDisplay xpValue={data?.xp ?? "-"} />
				<HeartDisplay heartValue={data?.hearts ?? 0} heartsUpdatedAt={data?.heartsUpdatedAt?.toString()} />
			</div>

			{/* Bagian Kanan: Notifikasi & Tema */}
			<div className="navbar-end gap-1 sm:gap-2">
				<div className="flex items-center gap-1 sm:gap-3">
					<div className="hover:bg-base-200/50 p-1 sm:p-2 sm:flex flex rounded-full transition-colors border border-transparent hover:border-white/10">
						<Notification />
					</div>
					<div className="hidden sm:flex hover:bg-base-200/50 p-2 rounded-full transition-colors border border-transparent hover:border-white/10">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
