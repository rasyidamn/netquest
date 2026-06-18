import LoginPage from "@/components/pages/auth/LoginPage";
import { createFileRoute } from "@tanstack/react-router";
import { requireGuest } from "../-guard";

export const Route = createFileRoute("/auth/login")({
	component: LoginPage,
});
