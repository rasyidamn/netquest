import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { queryClient } from "./core/providers/QueryProvider";
import { useAuthStore } from "./feature/auth/stores/useAuthStore";

export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: useAuthStore,
	},
	// Opsional tapi disarankan: atur pending element global jika transisi halaman agak lama
	defaultPreload: "intent", // Preload rute saat user melakukan hover pada link
	defaultPreloadStaleTime: 0,
});

// 2. Registrasi type safety global
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
