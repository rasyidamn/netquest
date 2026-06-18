import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireGuest } from "../-guard";

export const Route = createFileRoute("/auth/")({
	beforeLoad: () => redirect({ to: "/auth/login" }),
	component: () => null,
});
