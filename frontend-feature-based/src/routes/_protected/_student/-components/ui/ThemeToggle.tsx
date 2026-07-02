import { useThemeStore } from "@/core/store/useThemeStore";
import { cn } from "@/utils/cn";
import { MoonIcon, SunIcon } from "lucide-react";

interface ThemeToggleProps {
	className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, toggleTheme } = useThemeStore();

	return (
		<button
			onClick={toggleTheme}
			className={cn(
				"inline-flex items-center justify-center rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
				className,
			)}
			aria-label={
				theme === "dark"
					? "Beralih ke mode terang"
					: "Beralih ke mode gelap"
			}
		>
			{theme === "dark" ? <SunIcon size={20} /> : <MoonIcon size={20} />}
		</button>
	);
}
