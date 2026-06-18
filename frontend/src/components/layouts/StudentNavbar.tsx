import { ThemeToggle } from "../ThemeToggle";
import HeartDisplay from "../HeartDisplay";
import XpDisplay from "../XpDisplay";
import Notification from "../Notification";
import { useProfile } from "@/hooks/auth/useProfile";
import { useRouterState } from "@tanstack/react-router";

const titleMap: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/roadmap": "Peta Belajar",
	"/leaderboard": "Leaderboard",
	"/history": "Riwayat Kuis",
	"/profile": "Profil",
};

export function StudentNavbar() {
	const { data } = useProfile();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const pageTitle = titleMap[pathname] ?? "NetQuest";

	return (
		<header className="navbar sticky top-0 z-30 bg-base-200 shadow-sm">
			<div className="navbar-start gap-2">
				<label
					htmlFor="my-drawer-4"
					aria-label="open sidebar"
					className="btn btn-square btn-ghost"
				>
					{/* Sidebar toggle icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						strokeLinejoin="round"
						strokeLinecap="round"
						strokeWidth="2"
						fill="none"
						stroke="currentColor"
						className="my-1.5 inline-block size-4"
					>
						<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
						<path d="M9 4v16"></path>
						<path d="M14 10l2 2l-2 2"></path>
					</svg>
				</label>
				{/* Judul halaman dinamis */}
				<span className="font-bold text-base max-lg:hidden">
					{pageTitle}
				</span>
			</div>
			<div className="navbar-center gap-6">
				<XpDisplay xpValue={data?.xp ?? "-"} />
				<HeartDisplay heartValue={data?.hearts ?? 0} />
			</div>
			<div className="navbar-end">
				<div className="flex items-center sm:gap-4 sm:mr-4">
					<Notification />
					<ThemeToggle className="hidden sm:flex" />
				</div>
			</div>
		</header>
	);
}