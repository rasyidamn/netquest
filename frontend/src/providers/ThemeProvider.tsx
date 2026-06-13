import { useThemeStore } from "@/stores/theme.store";
import { useEffect, type ReactNode } from "react";

interface ThemeProviderProps {
	children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
	const theme = useThemeStore((state) => state.theme);

	useEffect(() => {
		// DaisyUI menggunakan data-theme, bukan class "dark"
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return <>{children}</>;
}

export default ThemeProvider
