import { BarChart2, CheckCircle2, Lock, Loader2, BookOpen } from "lucide-react";
import clsx from "clsx";
import { useUserProgress } from "@/feature/user/hooks/useUserProgress";
import type { UserType } from "@/feature/user/schema/user.schema";

interface UserProgressModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: UserType | null;
}

const statusConfig = {
	COMPLETED: { label: "Selesai", className: "badge-success", icon: CheckCircle2 },
	ACTIVE: { label: "Sedang Dikerjakan", className: "badge-primary", icon: BookOpen },
	LOCKED: { label: "Terkunci", className: "badge-ghost", icon: Lock },
};

export function UserProgressModal({ isOpen, onClose, user }: UserProgressModalProps) {
	const { data: progressData, isLoading } = useUserProgress(isOpen && user ? user.id : null);

	if (!isOpen || !user) return null;

	return (
		<div className="modal modal-open bg-base-300/40 backdrop-blur-sm">
			<div className="modal-box max-w-xl p-0 overflow-hidden bg-base-100 flex flex-col max-h-[90vh] rounded-3xl shadow-2xl border border-base-200 animate-in zoom-in-95 duration-200">
				{/* Header */}
				<div className="p-6 pb-5 border-b border-base-200/50 bg-gradient-to-br from-info/10 to-base-100 shrink-0">
					<h3 className="text-xl font-black flex items-center gap-3">
						<div className="p-2 bg-info/10 rounded-xl">
							<BarChart2 className="w-5 h-5 text-info" />
						</div>
						Progres Belajar
					</h3>
					<p className="text-sm text-base-content/60 mt-2 font-medium ml-[3.25rem]">
						<span className="text-base-content font-bold">{user.name}</span>{" "}
						<span className="font-mono opacity-60">({user.nim})</span>
					</p>
				</div>

				{/* Body */}
				<div className="p-6 overflow-y-auto custom-scrollbar space-y-3">
					{isLoading ? (
						<div className="flex justify-center items-center py-16">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
						</div>
					) : !progressData || progressData.length === 0 ? (
						<div className="text-center py-12 text-base-content/50">
							<BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
							<p className="font-medium">Belum ada progres yang tercatat.</p>
						</div>
					) : (
						progressData.map((mod: any, idx: number) => {
							const cfg = statusConfig[mod.status as keyof typeof statusConfig] ?? statusConfig.LOCKED;
							const Icon = cfg.icon;
							return (
								<div
									key={mod.moduleId ?? idx}
									className="flex items-center justify-between gap-4 p-4 bg-base-200/30 rounded-2xl border border-base-200/50"
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-xl bg-base-300/50 flex items-center justify-center text-sm font-black text-base-content/60">
											{mod.sequence ?? idx + 1}
										</div>
										<div>
											<p className="font-bold text-sm text-base-content">{mod.title}</p>
											<span className={clsx("badge badge-sm border-0 mt-1", cfg.className)}>
												<Icon className="w-3 h-3 mr-1" />
												{cfg.label}
											</span>
										</div>
									</div>
									<div className="text-right shrink-0">
										<p className="font-black text-warning text-sm">{mod.bestScore}</p>
										<p className="text-xs text-base-content/40 font-medium">Skor</p>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Footer */}
				<div className="p-5 border-t border-base-200/50 bg-base-200/30 shrink-0 flex justify-end">
					<button type="button" className="btn btn-ghost rounded-xl font-bold" onClick={onClose}>
						Tutup
					</button>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop bg-transparent" onClick={onClose}>
				<button type="button">close</button>
			</form>
		</div>
	);
}
