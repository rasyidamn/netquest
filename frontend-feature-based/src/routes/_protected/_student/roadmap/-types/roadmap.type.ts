import type { LessonType } from "@/feature/module/schema/lesson.schema";
import type { ModuleType } from "@/schemas/module.schema";

export type RoadmapStatus = "LOCKED" | "ACTIVE" | "COMPLETED";

export interface RoadmapItem {
	module: ModuleType;
	lessons: LessonType[];
	status: RoadmapStatus;
	currentLessonId: string;
}
