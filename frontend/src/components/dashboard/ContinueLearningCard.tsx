import { IconArrowRight, IconBook2 } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import type { ProgressItem } from "@/types/api.type";

interface ContinueLearningCardProps {
	isLoading?: boolean;
	progress?: ProgressItem[];
}

function findActiveLesson(progress: ProgressItem[] | undefined) {
	if (!progress) return null;
	return progress.find((p) => p.status === "ACTIVE") || null;
}

function ContinueLearningSkeleton() {
	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="flex items-start gap-4">
					<div className="skeleton size-12 rounded-lg" />
					<div className="flex-1 space-y-2">
						<div className="skeleton h-4 w-40" />
						<div className="skeleton h-3 w-64" />
						<div className="skeleton h-8 w-28 mt-3" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function ContinueLearningCard({ isLoading, progress }: ContinueLearningCardProps) {
	const router = useRouter();

	if (isLoading) {
		return <ContinueLearningSkeleton />;
	}

	const activeLesson = findActiveLesson(progress);

	if (!activeLesson) {
		return null;
	}

	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="flex items-start gap-4">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<IconBook2 size={24} className="text-primary" />
					</div>
					<div className="flex-1">
						<h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/60">
							Lanjutkan Belajar
						</h3>
						<p className="mt-1 text-sm text-base-content/70">
							Kamu memiliki lesson yang sedang aktif
						</p>
						<button
							onClick={() => router.navigate({ to: "/roadmap" })}
							className="btn btn-primary btn-sm mt-3 gap-2"
						>
							Lanjutkan
							<IconArrowRight size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}