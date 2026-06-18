import { BookOpen, ClipboardText, Star } from "@phosphor-icons/react";
import type { LessonDetailType } from "@/types/api.type";

interface LessonHeaderProps {
	title: LessonDetailType["title"];
	type: LessonDetailType["type"];
	xpReward: LessonDetailType["xpReward"];
}

export function LessonHeader({ title, type, xpReward }: LessonHeaderProps) {
	return (
		<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
			<h1 className="text-2xl font-bold text-base-content sm:text-3xl">
				{title}
			</h1>
			<div className="flex flex-wrap items-center gap-2">
				{type === "THEORY" ? (
					<span className="badge badge-ghost badge-md gap-1">
						<BookOpen size={16} weight="fill" />
						Teori
					</span>
				) : (
					<span className="badge badge-secondary badge-md gap-1">
						<ClipboardText size={16} weight="fill" />
						Kuis
					</span>
				)}
				<span className="badge badge-success badge-md gap-1">
					<Star size={16} weight="fill" />
					+{xpReward} XP
				</span>
			</div>
		</div>
	);
}
