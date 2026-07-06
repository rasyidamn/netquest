import { useState } from "react";
import { useWatch } from "react-hook-form";
import { ImageIcon, Loader2 } from "lucide-react";
import { uploadApi } from "@/core/api/upload.api";
import toast from "react-hot-toast";

export const MatchingImageUpload = ({
	onUpload,
}: {
	onUpload: (markdownImage: string) => void;
}) => {
	const [isUploading, setIsUploading] = useState(false);

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setIsUploading(true);
			const url = await uploadApi.uploadImage(file);
			onUpload(`![Image](${url})`);
			toast.success("Gambar berhasil diunggah!");
		} catch (error) {
			toast.error("Gagal mengunggah gambar");
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	return (
		<label
			className="btn btn-square btn-sm md:btn-md btn-ghost border border-dashed border-base-300 relative overflow-hidden group"
			title="Upload Gambar untuk bagian ini"
		>
			{isUploading ? (
				<Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
			) : (
				<ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-base-content/50 group-hover:text-primary transition-colors" />
			)}
			<input
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleUpload}
				disabled={isUploading}
			/>
		</label>
	);
};

export const AdminMatchInput = ({
	register,
	getValues,
	setValue,
	errors,
	control,
	index,
	side,
	placeholder,
}: {
	register: any;
	getValues: any;
	setValue: any;
	errors: any;
	control: any;
	index: number;
	side: "left" | "right";
	placeholder: string;
}) => {
	const fieldName = `matchingPairs.${index}.${side}`;
	const value = (useWatch({ control, name: fieldName }) as string) || "";
	
	const imgMatch = value.match(/!\[(.*?)\]\((.*?)\)/);
	let imageUrl = null;
	let altText = null;
	
	if (imgMatch) {
		altText = imgMatch[1];
		imageUrl = imgMatch[2];
	}

	return (
		<div className="flex-1 flex flex-col gap-2">
			<div className="flex gap-2">
				<MatchingImageUpload
					onUpload={(md) => {
						const currentVal = getValues(fieldName) || "";
						setValue(fieldName, currentVal ? `${currentVal} ${md}` : md, {
							shouldValidate: true,
						});
					}}
				/>
				<input
					{...register(fieldName)}
					className="input input-bordered w-full input-sm md:input-md"
					placeholder={placeholder}
				/>
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
			{errors.matchingPairs?.[index]?.[side] && (
				<span className="text-error text-xs mt-1 block">
					{errors.matchingPairs[index]?.[side]?.message}
				</span>
			)}
		</div>
	);
};

interface MatchingInputGroupProps {
	pairFields: any[];
	register: any;
	getValues: any;
	setValue: any;
	errors: any;
	control: any;
	removePair: (index: number) => void;
	appendPair: (val: any) => void;
}

import { Link as LinkIcon, Plus, Trash2 } from "lucide-react";

export const MatchingInputGroup = ({
	pairFields,
	register,
	getValues,
	setValue,
	errors,
	control,
	removePair,
	appendPair,
}: MatchingInputGroupProps) => {
	return (
		<div className="space-y-3 bg-base-200/30 p-4 rounded-xl border border-base-200">
			<div className="grid grid-cols-2 gap-4 mb-2 px-1">
				<span className="text-xs font-bold text-base-content/70 text-center">
					Sisi Kiri (Pertanyaan)
				</span>
				<span className="text-xs font-bold text-base-content/70 text-center">
					Sisi Kanan (Jawaban)
				</span>
			</div>
			{pairFields.map((field, index) => (
				<div key={field.id} className="flex items-start gap-2">
					<AdminMatchInput
						register={register}
						getValues={getValues}
						setValue={setValue}
						errors={errors}
						control={control}
						index={index}
						side="left"
						placeholder="Teks Kiri..."
					/>
					<div className="pt-2 md:pt-3">
						<LinkIcon className="w-4 h-4 text-base-content/30" />
					</div>
					<AdminMatchInput
						register={register}
						getValues={getValues}
						setValue={setValue}
						errors={errors}
						control={control}
						index={index}
						side="right"
						placeholder="Teks Kanan Pasangan..."
					/>
					{pairFields.length > 2 && (
						<button
							type="button"
							onClick={() => removePair(index)}
							className="btn btn-square btn-sm md:btn-md btn-ghost text-error"
						>
							<Trash2 className="w-4 h-4 md:w-5 md:h-5" />
						</button>
					)}
				</div>
			))}

			<button
				type="button"
				onClick={() => appendPair({ left: "", right: "" })}
				className="btn btn-outline btn-sm w-full mt-2 border-dashed"
				disabled={pairFields.length >= 8}
			>
				<Plus className="w-4 h-4" /> Tambah Pasangan Baru
			</button>
		</div>
	);
};
