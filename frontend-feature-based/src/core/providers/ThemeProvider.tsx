import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "../store/useThemeStore";

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const theme = useThemeStore((state) => state.theme);
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return <>{children}</>;
};
