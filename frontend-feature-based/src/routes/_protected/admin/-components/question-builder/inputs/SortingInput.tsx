import { Plus, Trash2 } from "lucide-react";

interface SortingInputProps {
	register: any;
	errors: any;
	labelFields: any[];
	appendLabel: (val: any) => void;
	removeLabel: (index: number) => void;
}

export const SortingInput = ({
	register,
	errors,
	labelFields,
	appendLabel,
	removeLabel,
}: SortingInputProps) => {
	return (
		<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
			<div className="mb-2 px-1">
				<span className="text-xs font-bold text-base-content/70">
					Daftar Label (Susun sesuai urutan yang benar dari Atas ke Bawah)
				</span>
			</div>
			{labelFields.map((field, index) => (
				<div key={field.id} className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center font-bold text-xs">
						{index + 1}
					</div>
					<div className="flex-1">
						<input
							{...register(`imageLabels.${index}.value` as const)}
							className="input input-bordered w-full input-sm md:input-md"
							placeholder={`Label ${index + 1}...`}
						/>
						{errors.imageLabels?.[index]?.value && (
							<span className="text-error text-xs mt-1 block">
								{errors.imageLabels[index]?.value?.message}
							</span>
						)}
					</div>
					{labelFields.length > 2 && (
						<button
							type="button"
							onClick={() => removeLabel(index)}
							className="btn btn-square btn-sm md:btn-md btn-ghost text-error"
						>
							<Trash2 className="w-4 h-4 md:w-5 md:h-5" />
						</button>
					)}
				</div>
			))}

			<button
				type="button"
				onClick={() => appendLabel({ value: "" })}
				className="btn btn-outline btn-sm w-full mt-2 border-dashed"
				disabled={labelFields.length >= 10}
			>
				<Plus className="w-4 h-4" /> Tambah Label Baru
			</button>
		</div>
	);
};
