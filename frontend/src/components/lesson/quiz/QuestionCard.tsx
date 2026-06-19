import type { Question, Option } from "@/types/api.type";
import { cn } from "@/utils/cn";

interface QuestionCardProps {
	question: Question;
	selectedOptionId: string | null;
	submittedOptionId?: string | null;
	isCorrect?: boolean | null;
	correctOptionId?: string | null;
	disabled: boolean;
	onSelectOption: (optionId: string) => void;
}

export function QuestionCard({
	question,
	selectedOptionId,
	submittedOptionId,
	isCorrect,
	correctOptionId,
	disabled,
	onSelectOption,
}: QuestionCardProps) {
	const hasSubmitted = submittedOptionId !== undefined && submittedOptionId !== null;

	function getOptionClass(option: Option): string {
		const base =
			"w-full rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer";

		if (!hasSubmitted) {
			return cn(
				base,
				selectedOptionId === option.id
					? "border-primary bg-primary/10"
					: "border-base-300 bg-base-100 hover:border-primary/50 hover:bg-base-200",
			);
		}

		// After submission - show correct/wrong
		if (option.id === correctOptionId) {
			return cn(base, "border-success bg-success/10 text-success");
		}
		if (option.id === submittedOptionId && !isCorrect) {
			return cn(base, "border-error bg-error/10 text-error");
		}
		return cn(base, "border-base-300 bg-base-100 opacity-60");
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-base-content">
				{question.questionText}
			</h3>

			<div className="space-y-3">
				{question.options.map((option) => (
					<button
						key={option.id}
						type="button"
						disabled={disabled || hasSubmitted}
						onClick={() => onSelectOption(option.id)}
						className={getOptionClass(option)}
					>
						<span className="block text-sm md:text-base">
							{option.optionText}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}