import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user.type";



interface AuthState {
	token: string | null;
	user: User | null;
	setAuth: (token: string, user: User) => void;
	logout: () => void;
	updateGameState: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
	persist<AuthState>(
		(set) => ({
			token: null,
			user: null,
			setAuth: (token, user) => set({ token, user }),
			logout: () => set({ token: null, user: null }),
			updateGameState: (data) =>
				set((state) => ({
					user: state.user ? { ...state.user, ...data } : null,
				})),
		}),
		{ name: "auth-store" },
	),
);
