import { useState, useEffect, useRef } from "react";
import { IconHeart, IconClock, IconHeartPlus, IconBook } from "@tabler/icons-react";
import { useRecoverHeart } from "@/hooks/gameplay/useRecoverHeart";
import { useHeartRecoveryTimer } from "@/hooks/gameplay/useHeartRecoveryTimer";
import { showXpGainToast } from "@/components/shared/XpGainToast";

interface RecoveryScreenProps {
	lessonId: string;
	hearts: number;
	heartsUpdatedAt?: string;
	onRecoverySuccess: () => void;
}

export function RecoveryScreen({
	lessonId,
	hearts,
	heartsUpdatedAt,
	onRecoverySuccess,
}: RecoveryScreenProps) {
	const [readStart] = useState(Date.now());
	const [readDuration, setReadDuration] = useState(0);
	const [isReading, setIsReading] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const recoverHeartMutation = useRecoverHeart();
	const { formattedTime, isRecovering } = useHeartRecoveryTimer(
		heartsUpdatedAt,
		hearts,
	);

	const MIN_READ_DURATION = 60;

	useEffect(() => {
		if (!isReading) return;

		intervalRef.current = setInterval(() => {
			const elapsed = Math.floor((Date.now() - readStart) / 1000);
			setReadDuration(elapsed);
		}, 1000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isReading, readStart]);

	const handleStartReading = () => {
		setIsReading(true);
	};

	const handleRecover = async () => {
		if (readDuration < MIN_READ_DURATION) return;

		try {
			await recoverHeartMutation.mutateAsync({
				lessonId,
				readDuration,
			});
			showXpGainToast(0);
			onRecoverySuccess();
		} catch {
			// error handled by mutation
		}
	};

	const canRecover = readDuration >= MIN_READ_DURATION && !recoverHeartMutation.isPending;

	return (
		<div className="mx-auto max-w-md space-y-6 py-8 text-center">
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-base-200">
				<IconHeart size={40} className="text-red-500" />
			</div>

			<div>
				<h2 className="text-2xl font-bold text-base-content">
					Pulihkan Nyawa
				</h2>
				<p className="mt-2 text-base text-base-content/60">
					{hearts < 3
						? "Baca materi selama 60 detik untuk memulihkan 1 nyawa."
						: "Nyawa sudah penuh."}
				</p>
			</div>

			{hearts < 3 && isRecovering && (
				<div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
					<IconClock size={16} />
					<span>Pemulihan otomatis: {formattedTime}</span>
				</div>
			)}

			{hearts < 3 && (
				<div className="rounded-xl bg-base-200 p-6 space-y-4">
					{!isReading ? (
						<button
							type="button"
							onClick={handleStartReading}
							className="btn btn-primary w-full gap-2"
						>
							<IconBook size={18} />
							Mulai Baca Materi
						</button>
					) : (
						<>
							<div className="text-center">
								<p className="text-sm text-base-content/60">Durasi Membaca</p>
								<p className="text-3xl font-bold text-base-content">
									{readDuration}s
								</p>
								{readDuration < MIN_READ_DURATION && (
									<p className="mt-1 text-xs text-base-content/40">
										Baca minimal {MIN_READ_DURATION} detik
									</p>
								)}
							</div>

							<button
								type="button"
								disabled={!canRecover}
								onClick={handleRecover}
								className="btn btn-success w-full gap-2"
							>
								{recoverHeartMutation.isPending ? (
									<span className="loading loading-spinner loading-sm" />
								) : (
									<IconHeartPlus size={18} />
								)}
								Pulihkan 1 Nyawa
							</button>
						</>
					)}
				</div>
			)}

			<button
				type="button"
				onClick={onRecoverySuccess}
				className="btn btn-ghost w-full"
			>
				Kembali
			</button>
		</div>
	);
}