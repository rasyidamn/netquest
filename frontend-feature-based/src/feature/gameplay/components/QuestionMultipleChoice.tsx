import type { Option } from "@/feature/module/schema/question.schema";
import { CheckCircle2, Circle } from "lucide-react";
import clsx from "clsx";

interface QuestionMultipleChoiceProps {
	options: Option[];
	selectedOptionId: string | null;
	onSelect: (optionId: string) => void;
	disabled?: boolean;
}

export function QuestionMultipleChoice({
	options,
	selectedOptionId,
	onSelect,
	disabled = false,
}: QuestionMultipleChoiceProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
			{options.map((option) => {
				const isSelected = selectedOptionId === option.id;
				
				return (
					<button
						key={option.id}
						disabled={disabled}
						onClick={() => onSelect(option.id)}
						className={clsx(
							"relative p-4 rounded-xl border-2 text-left transition-all duration-200",
							"hover:border-primary/50 hover:bg-primary/5 active:scale-95",
							"flex items-center gap-4 group",
							isSelected
								? "border-primary bg-primary/10 shadow-sm shadow-primary/20"
								: "border-base-300 bg-base-100",
							disabled && "opacity-70 cursor-not-allowed active:scale-100 hover:border-base-300 hover:bg-base-100"
						)}
					>
						<div className={clsx(
							"shrink-0 transition-colors",
							isSelected ? "text-primary" : "text-base-content/30 group-hover:text-primary/50"
						)}>
							{isSelected ? (
								<CheckCircle2 className="w-6 h-6" />
							) : (
								<Circle className="w-6 h-6" />
							)}
						</div>
						<span className={clsx(
							"font-medium text-lg leading-snug",
							isSelected ? "text-primary" : "text-base-content"
						)}>
							{option.optionText}
						</span>
					</button>
				);
			})}
		</div>
	);
}
