import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../types";



interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
	persist<ThemeState>(
		(set) => ({
			theme: "dark",
			setTheme: (theme: Theme) => set({ theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "dark" ? "light" : "dark",
				})),
		}),
		{
			name: "theme-storage",
		},
	),
);
