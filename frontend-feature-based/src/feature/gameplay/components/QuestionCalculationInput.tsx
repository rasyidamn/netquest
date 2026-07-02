import { SendHorizonal, Calculator } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface QuestionCalculationInputProps {
	value: string;
	onChange: (val: string) => void;
	disabled?: boolean;
}

export function QuestionCalculationInput({
	value,
	onChange,
	disabled = false,
}: QuestionCalculationInputProps) {
	const [inputValue, setInputValue] = useState(value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!disabled && inputValue.trim()) {
			onChange(inputValue);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-2xl mx-auto">
			<div className="bg-base-200/50 p-6 rounded-2xl border-2 border-base-300 shadow-inner">
				<div className="flex items-center gap-3 mb-4 text-base-content/60 border-b border-base-300 pb-3">
					<Calculator className="w-5 h-5 text-secondary" />
					<span className="text-sm font-bold uppercase tracking-widest text-secondary">Area Kalkulasi</span>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="calc-input" className="text-sm font-medium text-base-content/70">
						Masukkan Angka/Hasil Akhir:
					</label>
					<input
						id="calc-input"
						type="text"
						autoFocus
						autoComplete="off"
						spellCheck="false"
						disabled={disabled}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="input input-lg input-bordered w-full bg-base-100 text-lg font-mono focus:border-secondary focus:ring-1 focus:ring-secondary disabled:opacity-50 transition-all"
						placeholder="Contoh: 62"
					/>
				</div>
			</div>
			<div className="flex justify-end">
				<button
					type="submit"
					disabled={disabled || !inputValue.trim()}
					className={clsx(
						"btn btn-secondary",
						disabled ? "btn-disabled" : ""
					)}
				>
					<span>Kunci Jawaban</span>
					<SendHorizonal className="w-4 h-4 ml-2" />
				</button>
			</div>
		</form>
	);
}
