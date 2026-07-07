import { Plus, Trash2 } from "lucide-react";
import { MatchingImageUpload } from "./MatchingInput";
import { useWatch } from "react-hook-form";

interface SortingInputProps {
	register: any;
	errors: any;
	setValue: any;
	getValues: any;
	control: any;
	labelTitle?: string;
	labelFields: any[];
	appendLabel: (val: any) => void;
	removeLabel: (index: number) => void;
}

const AdminSortingOption = ({
	field,
	index,
	register,
	errors,
	setValue,
	getValues,
	control,
	removeLabel,
	canRemove
}: any) => {
	const fieldName = `imageLabels.${index}.value`;
	const value = (useWatch({ control, name: fieldName }) as string) || "";
	
	const imgMatch = value.match(/!\[(.*?)\]\((.*?)\)/);
	let imageUrl = null;
	let altText = null;
	
	if (imgMatch) {
		altText = imgMatch[1];
		imageUrl = imgMatch[2];
	}

	return (
		<div 
			className="group flex items-start gap-3 p-3 bg-base-100 rounded-xl border-2 border-base-200 hover:border-primary/40 transition-colors shadow-sm"
		>
			<div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
				{index + 1}
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
							className="input w-full input-sm md:input-md bg-transparent border-none focus:outline-none focus:ring-0 px-0 font-medium"
							placeholder={`Teks Jawaban #${index + 1}...`}
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
				{errors.imageLabels?.[index]?.value && (
					<span className="text-error text-xs block mt-1 px-1">
						{errors.imageLabels[index]?.value?.message}
					</span>
				)}
			</div>
			{canRemove && (
				<button
					type="button"
					onClick={() => removeLabel(index)}
					className="btn btn-square btn-sm md:btn-md btn-ghost text-base-content/40 hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
					title="Hapus"
				>
					<Trash2 className="w-4 h-4 md:w-5 md:h-5" />
				</button>
			)}
		</div>
	);
};

export const SortingInput = ({
	register,
	errors,
	setValue,
	getValues,
	control,
	labelTitle = "Daftar Label (Susun sesuai urutan yang benar dari Atas ke Bawah)",
	labelFields,
	appendLabel,
	removeLabel,
}: SortingInputProps) => {
	return (
		<div className="space-y-4 bg-base-200/30 p-4 rounded-xl border border-base-200">
			<div className="mb-2 px-1">
				<span className="text-xs font-bold text-base-content/70">
					{labelTitle}
				</span>
			</div>
			{labelFields.map((field, index) => (
				<AdminSortingOption
					key={field.id}
					field={field}
					index={index}
					register={register}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					control={control}
					removeLabel={removeLabel}
					canRemove={labelFields.length > 2}
				/>
			))}

			<button
				type="button"
				onClick={() => appendLabel({ value: "" })}
				className="btn btn-outline btn-primary btn-sm w-full mt-4 border-dashed rounded-xl font-bold bg-primary/5 hover:bg-primary/10 transition-all"
				disabled={labelFields.length >= 10}
			>
				<Plus className="w-4 h-4 mr-1" /> Tambah Label Jawaban
			</button>
		</div>
	);
};
