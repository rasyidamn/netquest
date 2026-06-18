import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// 3. Tangani kasus ketika backend mati / tidak ada internet sama sekali
		if (!error.response) {
			// Anda bisa menghubungkan ini dengan sistem Toast notifikasi global
			console.error(
				"Network Error: Pastikan koneksi internet stabil atau server menyala.",
			);
			return Promise.reject(new Error("Gagal terhubung ke server."));
		}

		const { status } = error.response;
		const isLoginRequest = error.config.url?.includes("/login");
		const isProfileRequest = error.config.url?.includes("/profile");
		const isAlreadyOnAuthPage =
			window.location.pathname.startsWith("/auth");

		// 401: Sesi habis atau tidak sah
		if (status === 401 && !isLoginRequest && !isProfileRequest) {
			useAuthStore.getState().logout();
			if (!isAlreadyOnAuthPage) {
				window.location.href = "/auth/login";
			}
		}

		// 2. 403: Mencoba mengakses API di luar batas wewenang perannya
		if (status === 403) {
			// Lempar ke halaman unauthorized tanpa me-logout pengguna
			window.location.href = "/unauthorized";
		}

		// 500: Server Express meledak (Internal Server Error)
		if (status >= 500) {
			console.error("Server sedang mengalami masalah.");
		}
	},
);

export default apiClient;
