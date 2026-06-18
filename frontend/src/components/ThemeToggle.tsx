import { useThemeStore } from "@/stores/theme.store";
import { cn } from "@/utils/cn";
import { IconMoon, IconSun } from "@tabler/icons-react";



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
			{theme === "dark" ? <IconSun size={20} /> : <IconMoon size={20} />}
		</button>
	);
}
