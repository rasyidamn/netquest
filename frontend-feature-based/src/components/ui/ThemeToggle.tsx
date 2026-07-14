import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/core/store/useThemeStore";

interface ThemeToggleProps {
	className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
	const { theme, toggleTheme } = useThemeStore();

	return (
		<button
			onClick={toggleTheme}
			aria-label={theme === "dark" ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
			title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
			className={`btn btn-ghost btn-sm btn-circle transition-all duration-300 hover:bg-base-200 ${className}`}
		>
			{theme === "dark" ? (
				<Sun className="w-4 h-4 text-warning" />
			) : (
				<Moon className="w-4 h-4 text-base-content/70" />
			)}
		</button>
	);
}

