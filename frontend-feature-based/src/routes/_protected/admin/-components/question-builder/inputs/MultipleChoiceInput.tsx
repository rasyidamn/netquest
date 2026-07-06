import { Plus, Trash2 } from "lucide-react";

interface MultipleChoiceInputProps {
	register: any;
	errors: any;
	optionFields: any[];
	appendOption: (val: any) => void;
	removeOption: (index: number) => void;
	setCorrectAnswer: (index: number) => void;
}

export const MultipleChoiceInput = ({
	register,
	errors,
	optionFields,
	appendOption,
	removeOption,
	setCorrectAnswer,
}: MultipleChoiceInputProps) => {
	return (
		<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
			{optionFields.map((field, index) => (
				<div key={field.id} className="flex items-start gap-3">
					<div className="pt-3">
						<input
							type="radio"
							name="correctAnswer"
							className="radio radio-success radio-sm"
							checked={field.isCorrect}
							onChange={() => setCorrectAnswer(index)}
						/>
					</div>
					<div className="flex-1">
						<input
							{...register(`options.${index}.optionText` as const)}
							className={`input input-bordered w-full ${
								field.isCorrect ? "border-success" : ""
							}`}
							placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
						/>
						{errors.options?.[index]?.optionText && (
							<span className="text-error text-xs mt-1 block">
								{errors.options[index]?.optionText?.message}
							</span>
						)}
					</div>
					{optionFields.length > 2 && (
						<button
							type="button"
							onClick={() => removeOption(index)}
							className="btn btn-square btn-ghost text-error"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					)}
				</div>
			))}

			<button
				type="button"
				onClick={() =>
					appendOption({
						optionText: "",
						isCorrect: false,
					})
				}
				className="btn btn-outline btn-sm w-full mt-2 border-dashed"
				disabled={optionFields.length >= 5}
			>
				<Plus className="w-4 h-4" /> Tambah Opsi Lainnya
			</button>
		</div>
	);
};
