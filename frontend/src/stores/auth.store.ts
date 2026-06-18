import type { RoleEnum } from "@/types/api.type";
import { create } from "zustand";

interface AuthState {
   isAuthenticated: boolean;
   role: RoleEnum | null;
   isLoggingOut: boolean; // 1. Tambahkan state baru
   setLoginParams: (role: RoleEnum) => void;
   setLoggingOut: (status: boolean) => void; // 2. Tambahkan setter
   logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
   isAuthenticated: false,
   role: null,
   isLoggingOut: false,
   setLoginParams: (role) => set({ isAuthenticated: true, role, isLoggingOut: false }),
   setLoggingOut: (status) => set({ isLoggingOut: status }),
   logout: () => set({ isAuthenticated: false, role: null, isLoggingOut: false }), // Reset juga di sini
}));