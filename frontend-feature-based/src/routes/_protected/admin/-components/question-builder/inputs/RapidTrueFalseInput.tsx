import React from "react";

interface RapidTrueFalseInputProps {
	register: any;
	errors: any;
	optionFields: any[];
	setCorrectAnswer: (index: number) => void;
}

export const RapidTrueFalseInput = ({
	register,
	errors,
	optionFields,
	setCorrectAnswer,
}: RapidTrueFalseInputProps) => {
	// For RAPID_TRUE_FALSE, we expect exactly 2 options: index 0 is "Benar", index 1 is "Salah"
	// The parent component should ensure these options are populated when the type is selected.
	
	const isTrueCorrect = optionFields[0]?.isCorrect;
	
	return (
		<div className="space-y-4 bg-base-200/30 p-5 rounded-xl border border-base-200">
			<div className="mb-2">
				<span className="text-sm font-bold text-base-content/80 block mb-1">
					Kunci Jawaban untuk Pernyataan di Atas
				</span>
				<p className="text-xs text-base-content/50">
					Tentukan apakah pernyataan di atas bernilai Benar atau Salah.
				</p>
			</div>
			
			<div className="flex gap-4">
				<label 
					className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
						isTrueCorrect 
							? "border-success bg-success/10 text-success" 
							: "border-base-300 bg-base-100 hover:border-success/50"
					}`}
				>
					<input
						type="radio"
						name="correctAnswer"
						className="hidden"
						checked={isTrueCorrect}
						onChange={() => setCorrectAnswer(0)}
					/>
					<div className="font-black text-lg">BENAR</div>
					<div className="text-xs opacity-70">Pernyataan ini valid</div>
				</label>
				
				<label 
					className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
						!isTrueCorrect 
							? "border-error bg-error/10 text-error" 
							: "border-base-300 bg-base-100 hover:border-error/50"
					}`}
				>
					<input
						type="radio"
						name="correctAnswer"
						className="hidden"
						checked={!isTrueCorrect}
						onChange={() => setCorrectAnswer(1)}
					/>
					<div className="font-black text-lg">SALAH</div>
					<div className="text-xs opacity-70">Pernyataan ini tidak valid</div>
				</label>
			</div>
			
			{errors.options?.root && (
				<span className="text-error text-xs mt-1 block text-center">
					{errors.options.root.message}
				</span>
			)}
		</div>
	);
};
