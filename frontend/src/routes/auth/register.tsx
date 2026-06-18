import RegisterPage from "@/components/pages/auth/RegisterPage";
import { createFileRoute } from "@tanstack/react-router";
import { requireGuest } from "../-guard";

export const Route = createFileRoute("/auth/register")({
	component: RegisterPage,
});
