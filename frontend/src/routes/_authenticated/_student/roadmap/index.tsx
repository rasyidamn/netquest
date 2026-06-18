// _authenticated/_student/roadmap.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";

export const Route = createFileRoute("/_authenticated/_student/roadmap/")({
	component: () => (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Peta Belajar</h1>
			<p className="text-base-content/60 mb-6">
				Jelajahi modul-modul pembelajaran secara berurutan.
			</p>
			<div className="flex justify-center">
				<RoadmapTimeline />
			</div>
		</div>
	),
});