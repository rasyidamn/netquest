import type { LeaderBoardItem } from "@/schemas/models/leaderboard.model";
import type { ModuleModel } from "@/schemas/models/module.model";
import type { UserProgressModel } from "@/schemas/models/user-progress.model";
import type { UserModel } from "@/schemas/models/user.model";
import type { LessonModel } from "@/schemas/models/lesson.model";
import type z from "zod";

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	errors?: unknown;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface JwtPayload {
	id: string;
	nim: string;
	role: string;
}

type User = z.infer<typeof UserModel>;
export type UserWithoutPassword = Omit<User, "password">;

export type ProgressItem = z.infer<typeof UserProgressModel>;

export type LeaderboardEntry = z.infer<typeof LeaderBoardItem>[];

export type ModuleType = z.infer<typeof ModuleModel>;

export type LessonType = z.infer<typeof LessonModel>;

export type RoleEnum = "ADMIN" | "MAHASISWA" | string | null;

export type RoadmapStatus = "LOCKED" | "ACTIVE" | "COMPLETED";

export interface RoadmapItem {
	module: ModuleType;
	lessons: LessonType[];
	status: RoadmapStatus;
}

export interface MaterialType {
	id: string;
	lessonId: string;
	content: string;
	mediaUrl?: string | null;
}

export interface LessonDetailType extends LessonType {
	material?: MaterialType;
}

export interface TheoryDoneResponse {
	xpGained: number;
	currentTotalXp: number;
}