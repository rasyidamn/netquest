import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest/auth/")({
	beforeLoad: () => {
		throw redirect({ to: "/auth/login" });
	},
});
