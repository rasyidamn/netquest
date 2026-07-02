import { create } from "zustand";
import type { RoleEnumType } from "../schema/auth.schema";

interface AuthState {
	isAuthenticated: boolean;
	isInitialized: boolean;
	role: RoleEnumType | null;
	isLoggingOut: boolean; // 1. Tambahkan state baru
	setLoginParams: (role: RoleEnumType) => void;
	setLoggingOut: (status: boolean) => void; // 2. Tambahkan setter
	logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	isAuthenticated: false,
	isInitialized: false,
	role: null,
	isLoggingOut: false,
	setLoginParams: (role) =>
		set({
			isAuthenticated: true,
			role: role,
			isLoggingOut: false,
			isInitialized: true,
		}),
	setLoggingOut: (status) => set({ isLoggingOut: status }),
	logout: () =>
		set({
			isAuthenticated: false,
			role: null,
			isLoggingOut: false,
			isInitialized: true,
		}), // Reset juga di sini
}));
