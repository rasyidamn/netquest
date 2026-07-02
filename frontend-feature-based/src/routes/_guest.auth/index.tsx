import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest/auth/")({
	beforeLoad: () => redirect({ to: "/auth/login" }),
});
