import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "./-components/page/DashboardPage";

export const Route = createFileRoute("/_protected/_student/dashboard/")({
	component: DashboardPage,
});
