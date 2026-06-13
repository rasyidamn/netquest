import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "@tanstack/react-router";

/**
 * Memastikan user sudah login (token ada).
 * Jika tidak, redirect ke /auth/login.
 */
export function requireAuth() {
	const { token } = useAuthStore.getState();
	if (!token) {
		throw redirect({ to: "/auth/login" });
	}
}

/**
 * Memastikan user sudah login dan role-nya MAHASISWA.
 * Jika tidak login → redirect /auth/login.
 * Jika sudah login tapi bukan MAHASISWA → redirect /unauthorized.
 */
export function requireMahasiswa() {
	const { token, user } = useAuthStore.getState();
	if (!token) {
		throw redirect({ to: "/auth/login" });
	}
	if (user?.role !== "MAHASISWA") {
		throw redirect({ to: "/unauthorized" });
	}
}

/**
 * Memastikan user sudah login dan role-nya ADMIN.
 * Jika tidak login → redirect /auth/login.
 * Jika sudah login tapi bukan ADMIN → redirect /unauthorized.
 */
export function requireAdmin() {
	const { token, user } = useAuthStore.getState();
	if (!token) {
		throw redirect({ to: "/auth/login" });
	}
	if (user?.role !== "ADMIN") {
		throw redirect({ to: "/unauthorized" });
	}
}

/**
 * Memastikan user BELUM login (guest).
 * Jika sudah login, redirect ke halaman sesuai role.
 * Cocok untuk halaman login/register.
 */
export function requireGuest() {
	const { token, user } = useAuthStore.getState();
	if (!token) return; // belum login, aman

	// Sudah login, redirect sesuai role
	if (user?.role === "ADMIN") {
		throw redirect({ to: "/admin" });
	}
	throw redirect({ to: "/dashboard" });
}