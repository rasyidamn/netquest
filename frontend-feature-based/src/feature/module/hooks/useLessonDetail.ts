import { useQuery } from "@tanstack/react-query";
import type { LessonDetailType } from "../schema/lesson.schema";
import { lessonApi } from "../api/lessonApi";


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