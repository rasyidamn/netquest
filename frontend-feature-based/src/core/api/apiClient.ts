import axios from "axios";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// 1. Tangani kasus ketika backend mati / tidak ada internet sama sekali
		if (!error.response) {
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

		// 2. 401: Sesi habis atau tidak sah
		if (status === 401 && !isLoginRequest && !isProfileRequest) {
			if (!isAlreadyOnAuthPage) {
				window.location.href = "/auth/login";
			}
		}

		// 3. 403: Mencoba mengakses API di luar batas wewenang perannya
		if (status === 403) {
			window.location.href = "/unauthorized";
		}

		// 4. 500: Server meledak (Internal Server Error)
		if (status >= 500) {
			console.error("Server sedang mengalami masalah.", error.response?.data);
		}

		// 🔥 WAJIB: Teruskan error agar TanStack Query di komponen UI bisa menangkapnya!
		return Promise.reject(error);
	},
);
