import { UnauthorizedPage } from "@/components/pages/UnauthorizedPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
	component: UnauthorizedPage,
});
