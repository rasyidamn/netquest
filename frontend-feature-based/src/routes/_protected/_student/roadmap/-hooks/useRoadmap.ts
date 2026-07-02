import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useModules } from "@/feature/module/hooks/useModules";
import { useMyProgress } from "@/feature/progress/hooks/useMyProgress";
import { moduleApi } from "@/feature/module/api/moduleApi";
import type { RoadmapItem, RoadmapStatus } from "../-types/roadmap.type";


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
		const progressByModuleId = new Map<string, { status: RoadmapStatus, currentLessonId: string }>();
		if (progress) {
			for (const p of progress) {
				progressByModuleId.set(p.moduleId, { status: p.status as RoadmapStatus, currentLessonId: p.currentLessonId });
			}
		}

		const getStatusInfo = (index: number, moduleId: string): { status: RoadmapStatus, currentLessonId: string } => {
			// 1. Cek status dari backend progress (sumber kebenaran)
			const backendData = progressByModuleId.get(moduleId);
			if (backendData?.status === "COMPLETED") return { status: "COMPLETED", currentLessonId: backendData.currentLessonId };
			if (backendData?.status === "ACTIVE") return { status: "ACTIVE", currentLessonId: backendData.currentLessonId };

			// 2. Jika ini modul pertama dan belum ada progress, dia ACTIVE
			if (index === 0) return { status: "ACTIVE", currentLessonId: "" };

			// 3. Jika modul sebelumnya COMPLETED, maka modul ini ACTIVE
			if (index > 0) {
				const prevItem = roadmapItemsCache[index - 1];
				if (prevItem?.status === "COMPLETED") return { status: "ACTIVE", currentLessonId: "" };
			}

			// 4. Sisanya LOCKED
			return { status: "LOCKED", currentLessonId: "" };
		};

		// We need a mutable array to reference previous statuses during computation
		const roadmapItemsCache: RoadmapItem[] = [];

		for (let i = 0; i < sorted.length; i++) {
			const mod = sorted[i];
			const statusInfo = getStatusInfo(i, mod.id);
			
			// Jika belum ada progress di backend dan statusnya ACTIVE, currentLessonId harusnya materi pertama (jika ada)
			let currentId = statusInfo.currentLessonId;
			if (statusInfo.status === "ACTIVE" && !currentId && lessonsByModule[i]?.length > 0) {
				currentId = lessonsByModule[i][0].id;
			}

			const item: RoadmapItem = {
				module: mod,
				lessons: lessonsByModule[i] ?? [],
				status: statusInfo.status,
				currentLessonId: currentId,
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
