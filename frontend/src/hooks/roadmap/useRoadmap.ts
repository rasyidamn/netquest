import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useModules } from "@/hooks/module/useModules";
import { useMyProgress } from "@/hooks/progress/useMyProgress";
import { moduleApi } from "@/api/module.api";
import type { RoadmapItem, RoadmapStatus } from "@/types/api.type";

export function useRoadmap() {
	const modulesQuery = useModules();
	const progressQuery = useMyProgress();

	const lessonQueries = useQueries({
		queries: (modulesQuery.data ?? []).map((mod) => ({
			queryKey: ["lessons", mod.id],
			queryFn: async () => {
				const res = await moduleApi.getLessons(mod.id);
				if (!res.success) {
					throw new Error(res.message || "Gagal mengambil pelajaran");
				}
				return res.data ?? [];
			},
			enabled: !!modulesQuery.data,
		})),
	});

	const roadmapItems = useMemo<RoadmapItem[]>(() => {
		const modules = modulesQuery.data;
		const progress = progressQuery.data;
		const lessonsByModule = lessonQueries.map((q) => q.data ?? []);

		if (!modules) return [];

		const sorted = [...modules].sort((a, b) => a.sequence - b.sequence);

		// Build a map of moduleId -> module progress status from backend
		// Backend returns per-modul progress: { moduleId, status, bestScore, currentLessonId }
		const progressByModuleId = new Map<string, RoadmapStatus>();
		if (progress) {
			for (const p of progress) {
				progressByModuleId.set(p.moduleId, p.status as RoadmapStatus);
			}
		}

		const getStatus = (index: number, moduleId: string): RoadmapStatus => {
			// 1. Cek status dari backend progress (sumber kebenaran)
			const backendStatus = progressByModuleId.get(moduleId);
			if (backendStatus === "COMPLETED") return "COMPLETED";
			if (backendStatus === "ACTIVE") return "ACTIVE";

			// 2. Jika ini modul pertama dan belum ada progress, dia ACTIVE
			if (index === 0) return "ACTIVE";

			// 3. Jika modul sebelumnya COMPLETED, maka modul ini ACTIVE
			if (index > 0) {
				const prevItem = roadmapItemsCache[index - 1];
				if (prevItem?.status === "COMPLETED") return "ACTIVE";
			}

			// 4. Sisanya LOCKED
			return "LOCKED";
		};

		// We need a mutable array to reference previous statuses during computation
		const roadmapItemsCache: RoadmapItem[] = [];

		for (let i = 0; i < sorted.length; i++) {
			const mod = sorted[i];
			const status = getStatus(i, mod.id);
			const item: RoadmapItem = {
				module: mod,
				lessons: lessonsByModule[i] ?? [],
				status,
			};
			roadmapItemsCache.push(item);
		}

		return roadmapItemsCache;
	}, [modulesQuery.data, progressQuery.data, lessonQueries]);

	const isLoading =
		modulesQuery.isLoading ||
		progressQuery.isLoading ||
		lessonQueries.some((q) => q.isLoading);

	const isError =
		modulesQuery.isError ||
		progressQuery.isError ||
		lessonQueries.some((q) => q.isError);

	return { data: roadmapItems, isLoading, isError };
}
