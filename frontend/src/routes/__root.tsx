import {
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import RootLayout from "@/components/layouts/RootLayout";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import type { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
	queryClient: QueryClient;
	auth: {
		isAuthenticated: boolean;
		role: string | null;
	};
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<RootLayout>
			<Outlet />
		</RootLayout>
	),
	notFoundComponent: NotFoundPage,
});
