import { Terminal, SendHorizonal } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface QuestionCommandTypingProps {
	value: string;
	onChange: (val: string) => void;
	disabled?: boolean;
}

export function QuestionCommandTyping({
	value,
	onChange,
	disabled = false,
}: QuestionCommandTypingProps) {
	const [inputValue, setInputValue] = useState(value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!disabled && inputValue.trim()) {
			onChange(inputValue);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6 space-y-4">
			<div className="bg-neutral text-neutral-content p-4 rounded-xl font-mono shadow-inner shadow-black/20">
				<div className="flex items-center gap-2 mb-2 text-neutral-content/50 border-b border-neutral-content/10 pb-2">
					<Terminal className="w-4 h-4" />
					<span className="text-xs uppercase tracking-wider">Terminal Simulator</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-success font-bold">root@netquest:~#</span>
					<input
						type="text"
						autoFocus
						autoComplete="off"
						spellCheck="false"
						disabled={disabled}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-neutral-content/30 disabled:opacity-50"
						placeholder="Ketik perintah di sini..."
					/>
				</div>
			</div>
			<div className="flex justify-end">
				<button
					type="submit"
					disabled={disabled || !inputValue.trim()}
					className={clsx(
						"btn btn-primary",
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
