import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { GlobalErrorFallback } from "@/core/error/GlobalErrorFallback";
import type { QueryClient } from "@tanstack/react-query";
import type { useAuthStore } from "@/feature/auth/stores/useAuthStore";
import { authApi } from "@/feature/auth/api/authApi";
import { RootLayout } from "@/components/layout/RootLayout";
import { LoaderCircle } from "lucide-react";
import { NotFoundPage } from "@/core/components/pages/NotFoundPage";

export interface MyRouterContext {
	queryClient: QueryClient;
	auth: typeof useAuthStore;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }: { context: MyRouterContext }) => {
		const store = context.auth.getState();

		if (!store.isInitialized) {
			try {
				const user = await context.queryClient.fetchQuery({
					queryKey: ["auth", "profile"],
					queryFn: async () => {
						const res = await authApi.getProfile();
						if (!res.success) throw new Error(res.message);
						return res.data;
					},
					staleTime: Infinity,
				});
				if (user && user.role) {
					store.setLoginParams(user?.role);
				}
			} catch (error) {
				store.logout();
			}
		}
	},
	pendingComponent: () => (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="flex items-center justify-center gap-6">
				<LoaderCircle className="size-14 animate-spin"/>
				<p className="text-xl font-oxanium font-bold">Memuat....</p>
			</div>
		</div>
	),
	component: () => (
		<RootLayout>
			<Outlet />
		</RootLayout>
	),
	errorComponent: GlobalErrorFallback,
	notFoundComponent: NotFoundPage
});
