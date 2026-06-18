import { useTheoryDone } from "@/hooks/gameplay/useTheoryDone";
import { showXpGainToast } from "@/components/shared/XpGainToast";
import { Spinner, CheckCircle } from "@phosphor-icons/react";

interface TheoryDoneButtonProps {
	lessonId: string;
	isScrollThresholdReached: boolean;
}

export function TheoryDoneButton({
	lessonId,
	isScrollThresholdReached,
}: TheoryDoneButtonProps) {
	const theoryDoneMutation = useTheoryDone();

	const isCompleted = theoryDoneMutation.isSuccess;

	const handleClick = async () => {
		if (!isScrollThresholdReached || isCompleted) return;

		try {
			const result = await theoryDoneMutation.mutateAsync(lessonId);
			showXpGainToast(result.xpGained);
		} catch {
			// Error handled by react-query / toast notification system
		}
	};

	if (isCompleted) {
		return (
			<button
				type="button"
				disabled
				className="btn btn-success btn-lg w-full gap-2"
			>
				<CheckCircle size={20} weight="fill" />
				Selesai Dibaca
			</button>
		);
	}

	if (theoryDoneMutation.isPending) {
		return (
			<button type="button" disabled className="btn btn-primary btn-lg w-full gap-2">
				<Spinner size={20} className="animate-spin" />
				Menyelesaikan...
			</button>
		);
	}

	return (
		<button
			type="button"
			disabled={!isScrollThresholdReached}
			onClick={handleClick}
			className="btn btn-primary btn-lg w-full gap-2"
			title={
				!isScrollThresholdReached
					? "Baca seluruh materi terlebih dahulu"
					: undefined
			}
		>
			{!isScrollThresholdReached ? "🔒" : "✓"} Tandai Selesai
		</button>
	);
}