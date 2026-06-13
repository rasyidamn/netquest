import { Outlet, createRootRoute } from "@tanstack/react-router";
import RootLayout from "@/components/layouts/RootLayout";
import { NotFoundPage } from "@/components/pages/NotFoundPage";

export const Route = createRootRoute({
	component: () => (
		<RootLayout>
			<Outlet />
		</RootLayout>
	),
	notFoundComponent: NotFoundPage,
});
