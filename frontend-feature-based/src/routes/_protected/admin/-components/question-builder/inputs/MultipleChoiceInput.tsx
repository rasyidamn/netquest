import { Plus, Trash2 } from "lucide-react";
import { MatchingImageUpload } from "./MatchingInput";
import { useWatch } from "react-hook-form";

interface MultipleChoiceInputProps {
	register: any;
	errors: any;
	setValue: any;
	getValues: any;
	control: any;
	optionFields: any[];
	appendOption: (val: any) => void;
	removeOption: (index: number) => void;
	setCorrectAnswer: (index: number) => void;
}

const AdminMultipleChoiceOption = ({
	field,
	index,
	register,
	errors,
	setValue,
	getValues,
	control,
	removeOption,
	setCorrectAnswer,
	canRemove
}: any) => {
	const fieldName = `options.${index}.optionText`;
	const value = (useWatch({ control, name: fieldName }) as string) || "";
	
	const imgMatch = value.match(/!\[(.*?)\]\((.*?)\)/);
	let imageUrl = null;
	let altText = null;
	
	if (imgMatch) {
		altText = imgMatch[1];
		imageUrl = imgMatch[2];
	}

	return (
		<div className="flex items-start gap-3">
			<div className="pt-3">
				<input
					type="radio"
					name="correctAnswer"
					className="radio radio-success radio-sm"
					checked={field.isCorrect}
					onChange={() => setCorrectAnswer(index)}
				/>
			</div>
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex gap-2">
					<div className="flex items-start">
						<MatchingImageUpload
							onUpload={(mdImage) => {
								const currentVal = getValues(fieldName) || "";
								setValue(fieldName, currentVal ? `${currentVal} ${mdImage}` : mdImage, { shouldValidate: true });
							}}
						/>
					</div>
					<div className="flex-1">
						<input
							{...register(fieldName)}
							className={`input input-bordered w-full ${
								field.isCorrect ? "border-success" : ""
							}`}
							placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
						/>
					</div>
				</div>
				{imageUrl && (
					<div className="mt-1 p-2 bg-base-200/50 rounded-lg border border-base-300 w-full max-w-sm">
						<img 
							src={imageUrl} 
							alt={altText || "Preview"} 
							className="h-24 w-auto object-contain rounded-md"
						/>
					</div>
				)}
				{errors.options?.[index]?.optionText && (
					<span className="text-error text-xs block">
						{errors.options[index]?.optionText?.message}
					</span>
				)}
			</div>
			{canRemove && (
				<button
					type="button"
					onClick={() => removeOption(index)}
					className="btn btn-square btn-ghost text-error"
				>
					<Trash2 className="w-5 h-5" />
				</button>
			)}
		</div>
	);
};

export const MultipleChoiceInput = ({
	register,
	errors,
	setValue,
	getValues,
	control,
	optionFields,
	appendOption,
	removeOption,
	setCorrectAnswer,
}: MultipleChoiceInputProps) => {
	return (
		<div className="space-y-4 bg-base-200/30 p-4 rounded-xl border border-base-200">
			{optionFields.map((field, index) => (
				<AdminMultipleChoiceOption
					key={field.id}
					field={field}
					index={index}
					register={register}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					control={control}
					removeOption={removeOption}
					setCorrectAnswer={setCorrectAnswer}
					canRemove={optionFields.length > 2}
				/>
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
