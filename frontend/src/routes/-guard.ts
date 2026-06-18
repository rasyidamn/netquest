import { authApi } from "@/api/auth.api";
import { queryClient } from "@/providers/QueryProvider";
import { useAuthStore } from "@/stores/auth.store";
import { isRedirect, redirect } from "@tanstack/react-router";
import type { MyRouterContext } from "./__root";

/**
 * Memastikan user sudah login (isAuthenticated).
 * Jika tidak, redirect ke /auth/login.
 */

interface GuardPropsType {
	context: MyRouterContext;
}

export async function requireAuth({ context }: GuardPropsType) {
	try {
		const user = await context.queryClient.ensureQueryData({
			queryKey: ["profile"],
			queryFn: async () => {
				const res = await authApi.getProfile();
				// Asumsi API Anda membungkus data di dalam res.success
				if (!res.success) throw new Error(res.message);
				return res.data;
			},
			staleTime: 5 * 60 * 1000,
		});

		if (!user || !user.role) {
			throw redirect({ to: "/auth/login" });
		}
		useAuthStore.getState().setLoginParams(user.role);
		return { user };
	} catch (error) {
		if (isRedirect(error)) {
			throw error;
		}

		// 2. Tangani error lain (misal: token expired, server mati, atau error dari API)
		useAuthStore.getState().logout();
		throw redirect({ to: "/auth/login" });
	}
}

/**
 * Memastikan user sudah login dan role-nya MAHASISWA.
 * Jika tidak login → redirect /auth/login.
 * Jika sudah login tapi bukan MAHASISWA → redirect /unauthorized.
 */
export async function requireMahasiswa({ context }: GuardPropsType) {
	// 1. Panggil sumber kebenaran mutlak (akan melempar ke /login jika token mati)
	const { user } = await requireAuth({ context });

	// 2. Lakukan pengecekan peran (role) dari data server, BUKAN dari Zustand
	if (user?.role !== "MAHASISWA") {
		throw redirect({ to: "/unauthorized" });
	}

	return {user};
}

export async function requireAdmin({ context }: GuardPropsType) {
	const { user } = await requireAuth({ context });

	if (user?.role !== "ADMIN") {
		throw redirect({ to: "/unauthorized" });
	}

	return {user};
}

/**
 * Memastikan user BELUM login (guest).
 * Jika sudah login, redirect ke halaman sesuai role.
 * Cocok untuk halaman login/register.
 */
export async function requireGuest({ context }: GuardPropsType) {
   // --- FASE 1: CEK CEPAT (LOCAL STATE) ---
   const role = context.auth.role;

   // Jika memori lokal mencatat user sudah login, langsung usir instan (0ms)
   if (role === "ADMIN") {
      throw redirect({ to: "/admin" });
   }
   if (role === "MAHASISWA") {
      throw redirect({ to: "/dashboard" });
   }

   // --- FASE 2: CEK DALAM (SERVER VALIDATION) ---
   // Jika state lokal kosong (mungkin terhapus saat refresh), 
   // pastikan ke server apakah HttpOnly Cookie masih hidup.
   try {
      const user = await context.queryClient.ensureQueryData({
         queryKey: ["profile"],
         queryFn: async () => {
            const res = await authApi.getProfile();
            if (!res.success) throw new Error("Not logged in");
            return res.data;
         },
         // Beri waktu stale yang singkat (misal 1 menit) agar tidak 
         // menembak API berulang kali jika user bolak-balik halaman publik
         staleTime: 60 * 1000, 
      });

      // Jika kode berhasil sampai baris ini, berarti API sukses merespons data (Cookie VALID).
      // Jangan biarkan user berada di halaman login. Lempar ke rute yang tepat.
      if (user?.role === "ADMIN") {
         throw redirect({ to: "/admin" });
      }
      if (user?.role === "MAHASISWA") {
         throw redirect({ to: "/dashboard" });
      }

   } catch (error) {
      // 2a. Tangkap lemparan redirect dari pengecekan di atas agar router bekerja
      if (isRedirect(error)) {
         throw error;
      }

      // 2b. Jika error adalah 401 Unauthorized dari server,
      // Berarti pengguna BENAR-BENAR BELUM LOGIN (Guest).
      // Biarkan fungsi selesai (return) agar halaman /auth/login berhasil ditampilkan.
      return;
   }
}
