interface ShortAnswerInputProps {
	register: any;
	errors: any;
	selectedType: string;
}

export const ShortAnswerInput = ({
	register,
	errors,
	selectedType,
}: ShortAnswerInputProps) => {
	return (
		<div className="bg-success/5 p-4 rounded-xl border border-success/20">
			<label className="label pt-0">
				<span className="label-text font-bold text-success-content">
					Kunci Jawaban Tepat
				</span>
			</label>
			<input
				{...register(`options.0.optionText` as const)}
				className="input input-bordered w-full border-success font-mono"
				placeholder={
					selectedType === "COMMAND_TYPING"
						? "Contoh: ping 192.168.1.1"
						: "Contoh: 62"
				}
			/>
			{errors.options?.[0]?.optionText && (
				<span className="text-error text-xs mt-1 block">
					{errors.options[0]?.optionText?.message}
				</span>
			)}
			<p className="text-xs text-base-content/50 mt-2">
				*Jawaban mahasiswa harus sama persis (huruf besar/kecil diabaikan)
			</p>
		</div>
	);
};
