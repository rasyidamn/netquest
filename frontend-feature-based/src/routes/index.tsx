import { createFileRoute, redirect } from "@tanstack/react-router";
import type { MyRouterContext } from "./__root";

export const Route = createFileRoute("/")({
	beforeLoad: ({ context }: { context: MyRouterContext }) => {
		const store = context.auth.getState();
		if (!store.isAuthenticated) {
			throw redirect({ to: "/auth" });
		}
		if (store.role === "ADMIN") throw redirect({ to: "/admin" });
		throw redirect({ to: "/dashboard" });
	},
	component: () => null,
});
