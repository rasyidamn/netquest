import { IconLogout } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/utils/cn";
import LogoComponents from '@/public/NetQuest.svg?react'

export type NavBarRole = "auth" | "student" | "admin";

interface NavBarProps {
	role: NavBarRole;
	onLogout?: () => void;
	showThemeToggle?: boolean;
	className?: string;
}

const logoConfig: Record<NavBarRole, { to: string } | null> = {
	auth: null,
	student: { to: "/dashboard" },
	admin: { to: "/admin" },
};

export default function NavBar({
	role,
	onLogout,
	showThemeToggle = true,
	className,
}: NavBarProps) {
	const logo = logoConfig[role];

	return (
		<div
			className={cn(
				"navbar bg-base-200 px-4 lg:px-6 min-h-16",
				className,
			)}
		>
			<div className="flex-1">
				<LogoComponents className="w-48 h-fit" />
				{logo ? (
					<Link to={logo.to} className="btn btn-ghost text-xl gap-2 px-2">
						
						<span className="font-bold">NetQuest</span>
					</Link>
				) : (
					<div className="w-24" />
				)}
			</div>

			<div className="flex-none gap-2">
				{showThemeToggle && <ThemeToggle />}
				{onLogout && role !== "auth" && (
					<button
						onClick={onLogout}
						className="btn btn-ghost btn-sm gap-2"
					>
						<IconLogout size={18} />
						<span className="hidden sm:inline">Logout</span>
					</button>
				)}
			</div>
		</div>
	);
}
