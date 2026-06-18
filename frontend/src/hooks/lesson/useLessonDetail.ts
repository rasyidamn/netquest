import { useQuery } from "@tanstack/react-query";
import { lessonApi } from "@/api/lesson.api";
import type { LessonDetailType } from "@/types/api.type";

export function useLessonDetail(lessonId: string) {
	return useQuery<LessonDetailType>({
		queryKey: ["lesson", lessonId],
		queryFn: async () => {
			const res = await lessonApi.getLessonDetail(lessonId);
			if (!res.success) {
				throw new Error(res.message || "Gagal mengambil detail materi");
			}
			return res.data as LessonDetailType;
		},
		enabled: !!lessonId,
	});
}