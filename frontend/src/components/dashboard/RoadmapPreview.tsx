import { cn } from "@/utils/cn";
import { IconLock, IconCircleCheck, IconPlayerPlay, IconArrowRight } from "@tabler/icons-react";
import type { ProgressItem, ModuleType } from "@/types/api.type";
import { useRouter } from "@tanstack/react-router";

interface RoadmapPreviewProps {
	isLoading?: boolean;
	modules?: ModuleType[];
	progress?: ProgressItem[];
}

function getModuleStatus(
	moduleId: string,
	progress: ProgressItem[] | undefined,
	modules: ModuleType[] | undefined,
): "LOCKED" | "ACTIVE" | "COMPLETED" {
	if (!progress || !modules) return "LOCKED";

	const allModuleProgress = progress.filter((p) => {
		const module = modules.find((m) => m.id === moduleId);
		return module && p.lessonId;
	});

	if (!allModuleProgress.length) {
		return modules[0]?.id === moduleId ? "ACTIVE" : "LOCKED";
	}

	const completedCount = allModuleProgress.filter(
		(p) => p.status === "COMPLETED",
	).length;

	if (completedCount === allModuleProgress.length) return "COMPLETED";
	if (completedCount > 0) return "ACTIVE";

	return "LOCKED";
}

function getStatusIcon(status: "LOCKED" | "ACTIVE" | "COMPLETED") {
	switch (status) {
		case "LOCKED":
			return <IconLock size={20} className="text-base-content/30" />;
		case "ACTIVE":
			return <IconPlayerPlay size={20} className="text-primary" />;
		case "COMPLETED":
			return <IconCircleCheck size={20} className="text-success" />;
	}
}

function RoadmapSkeleton() {
	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<div className="skeleton h-4 w-32 mb-4" />
				<div className="space-y-2">
					<div className="skeleton h-12 w-full rounded-lg" />
					<div className="skeleton h-12 w-full rounded-lg" />
					<div className="skeleton h-12 w-full rounded-lg" />
				</div>
			</div>
		</div>
	);
}

export function RoadmapPreview({ isLoading, modules, progress }: RoadmapPreviewProps) {
	const router = useRouter();

	if (isLoading) {
		return <RoadmapSkeleton />;
	}

	if (!modules || modules.length === 0) {
		return null;
	}

	return (
		<div className="card card-compact bg-base-100 shadow-sm border border-base-200">
			<div className="card-body">
				<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/60">
					Roadmap Belajar
				</h3>
				<div className="space-y-2">
					{modules.map((mod, index) => {
						const status = getModuleStatus(mod.id, progress, modules);
						return (
							<button
								key={mod.id}
								onClick={() => router.navigate({ to: "/roadmap" })}
								className={cn(
									"flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all",
									status === "ACTIVE"
										? "bg-primary/10 hover:bg-primary/20"
										: "hover:bg-base-200",
								)}
							>
								<span className="flex size-8 items-center justify-center rounded-full bg-base-200 text-sm font-bold text-base-content/60">
									{index + 1}
								</span>
								<div className="flex-1">
									<p
										className={cn(
											"font-medium",
											status === "LOCKED" && "text-base-content/40",
										)}
									>
										{mod.title}
									</p>
								</div>
								<div className="flex items-center gap-1">
									{getStatusIcon(status)}
									{status === "ACTIVE" && (
										<IconArrowRight size={16} className="text-primary" />
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}