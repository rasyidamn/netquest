import { createFileRoute } from "@tanstack/react-router";
import { RoadmapPage } from "./-components/page/RoadmapPage";

export const Route = createFileRoute("/_protected/_student/roadmap/")({
	component: RoadmapPage,
});
