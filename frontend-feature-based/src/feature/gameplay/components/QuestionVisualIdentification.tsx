import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Option {
	id: string;
	optionText: string;
	isCorrect: boolean;
}

interface QuestionVisualIdentificationProps {
	questionText: string;
	options: Option[];
	onAnswer: (optionIds: string[]) => void;
	disabled?: boolean;
}

export const QuestionVisualIdentification = ({
	questionText,
	options,
	onAnswer,
	disabled = false,
}: QuestionVisualIdentificationProps) => {
	const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

	// Extract base image and hotspots from options. Order is not guaranteed from DB.
	const baseImageOpt = options.find((opt) => !opt.optionText.trim().startsWith("{"));
	const hotspotOpts = options.filter((opt) => opt.id !== baseImageOpt?.id);

	const handleHotspotClick = (id: string) => {
		if (disabled) return;
		setSelectedHotspot(id);
		onAnswer([id]);
	};

	if (!baseImageOpt) return <div className="text-error">Data gambar tidak valid</div>;

	return (
		<div className="w-full flex flex-col items-center">
			<div className="relative inline-block border-4 border-base-300 rounded-xl overflow-hidden bg-base-200/50 shadow-inner max-w-full">
				<img 
					src={baseImageOpt.optionText} 
					alt="Canvas Kuis" 
					className="max-w-full max-h-[500px] object-contain select-none pointer-events-none"
					draggable={false}
				/>
				
				{hotspotOpts.map((opt, index) => {
					try {
						const coords = JSON.parse(opt.optionText);
						const isSelected = selectedHotspot === opt.id;
						
						return (
							<motion.div
								key={opt.id}
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 20 }}
								className="absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer group"
								style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
								onClick={() => handleHotspotClick(opt.id)}
							>
								{/* Pulsing rings effect */}
								{!disabled && !isSelected && (
									<>
										<span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-75"></span>
										<span className="absolute inset-1 rounded-full bg-primary/30 animate-pulse"></span>
									</>
								)}
								
								{/* Core Marker */}
								<div className={`absolute inset-0 rounded-full border-2 flex items-center justify-center transition-all shadow-md transform group-hover:scale-110 ${
									isSelected
										? "bg-primary border-primary text-primary-content z-10 scale-110 shadow-primary/50 shadow-lg"
										: "bg-base-100 border-primary text-primary group-hover:bg-primary/10"
								}`}>
									{isSelected ? (
										<div className="w-3 h-3 bg-white rounded-full" />
									) : (
										<MapPin className="w-4 h-4" />
									)}
								</div>
							</motion.div>
						);
					} catch (e) {
						return null;
					}
				})}
			</div>
			
			<div className="mt-6 text-sm text-base-content/60 bg-base-200/50 px-4 py-2 rounded-full font-medium">
				Ketuk salah satu penanda pada gambar di atas
			</div>
		</div>
	);
};
