import { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Check, X, Timer } from "lucide-react";

interface Option {
	id: string;
	optionText: string;
}

interface QuestionRapidTrueFalseProps {
	questionText: string;
	options: Option[];
	onAnswer: (optionIds: string[]) => void;
	isRetry?: boolean;
}

export const QuestionRapidTrueFalse = ({
	questionText,
	options,
	onAnswer,
	isRetry = false,
}: QuestionRapidTrueFalseProps) => {
	const TIME_LIMIT = 20; // 20 seconds
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
	const [isAnswered, setIsAnswered] = useState(false);
	const [isPaused, setIsPaused] = useState(isRetry);
	
	const controls = useAnimation();
	const x = useMotionValue(0);
	
	// Create opacity, rotate and background color transforms based on X position
	const rotate = useTransform(x, [-200, 200], [-15, 15]);
	const opacityRight = useTransform(x, [0, 100], [0, 1]);
	const opacityLeft = useTransform(x, [0, -100], [0, 1]);
	
	const trueOption = options.find(o => o.optionText.toLowerCase() === "benar") || options[0];
	const falseOption = options.find(o => o.optionText.toLowerCase() === "salah") || options[1];

	// Handle Timer
	useEffect(() => {
		if (isAnswered || isPaused) return;
		
		if (timeLeft <= 0) {
			handleAnswerTimeout();
			return;
		}
		
		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 0.1);
		}, 100);
		
		return () => clearInterval(timer);
	}, [timeLeft, isAnswered, isPaused]);

	const handleAnswerTimeout = async () => {
		setIsAnswered(true);
		// Animate dropping down
		await controls.start({ y: 300, opacity: 0, transition: { duration: 0.4 } });
		
		// Send an invalid ID so the backend evaluates it as wrong
		onAnswer(["TIMEOUT"]);
	};

	const handleAnswer = async (isTrue: boolean) => {
		if (isAnswered) return;
		setIsAnswered(true);
		
		const direction = isTrue ? 1 : -1;
		
		// Animate flying out
		await controls.start({ 
			x: direction * window.innerWidth, 
			y: -50,
			opacity: 0,
			transition: { duration: 0.3 }
		});
		
		const selectedOption = isTrue ? trueOption : falseOption;
		onAnswer([selectedOption.id]);
	};

	const handleDragEnd = async (_e: any, info: any) => {
		if (isAnswered) return;
		
		const offset = info.offset.x;
		const velocity = info.velocity.x;
		
		if (offset > 100 || velocity > 500) {
			handleAnswer(true);
		} else if (offset < -100 || velocity < -500) {
			handleAnswer(false);
		} else {
			// Bounce back to center
			controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
		}
	};

	// Progress bar color based on time left
	const getProgressColor = () => {
		if (timeLeft > 5) return "progress-primary";
		if (timeLeft > 2) return "progress-warning";
		return "progress-error";
	};

	return (
		<div className="w-full flex flex-col items-center justify-center max-w-lg mx-auto min-h-[400px] relative overflow-hidden px-4">
			
			{/* Timer Bar */}
			<div className="w-full max-w-sm mb-8 flex flex-col gap-2 items-center">
				<div className="flex items-center justify-between w-full font-bold text-base-content/70">
					<span className="flex items-center gap-1"><Timer className="w-4 h-4" /> Sisa Waktu</span>
					<span className={timeLeft <= 3 ? "text-error animate-pulse font-black" : ""}>
						{Math.max(0, timeLeft).toFixed(1)}s
					</span>
				</div>
				<progress 
					className={`progress w-full h-3 ${getProgressColor()} transition-all duration-100 ease-linear`} 
					value={Math.max(0, timeLeft)} 
					max={TIME_LIMIT}
				></progress>
			</div>

			{/* Swipe Indicators Background (Removed) */}

			{/* Draggable Card or Paused State */}
			<div className="relative w-full max-w-sm z-10 perspective-1000">
				{isPaused ? (
					<div className="w-full bg-base-100 p-8 rounded-3xl shadow-xl border border-warning/50 min-h-[250px] flex flex-col items-center justify-center text-center">
						<div className="w-16 h-16 rounded-full bg-warning/20 text-warning flex items-center justify-center mb-4">
							<Timer className="w-8 h-8" />
						</div>
						<h3 className="text-xl font-bold mb-2">Siap Mencoba Lagi?</h3>
						<p className="text-base-content/60 text-sm mb-6">
							Waktu 20 detik akan langsung berjalan saat Anda menekan tombol di bawah.
						</p>
						<button 
							onClick={() => setIsPaused(false)}
							className="btn btn-warning w-full rounded-xl"
						>
							Mulai Lagi
						</button>
					</div>
				) : (
					<motion.div
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.8}
						onDragEnd={handleDragEnd}
						animate={controls}
						style={{ x, rotate }}
						className="w-full bg-base-100 p-8 rounded-3xl shadow-xl border border-base-200 cursor-grab active:cursor-grabbing min-h-[250px] flex flex-col items-center justify-center text-center select-none"
					>
						{/* Overlay for True (Green) */}
						<motion.div 
							style={{ opacity: opacityRight }} 
							className="absolute inset-0 bg-success/20 rounded-3xl z-10 flex items-center justify-center border-4 border-success"
						>
							<span className="text-success font-black text-4xl border-4 border-success p-4 rounded-xl transform -rotate-12 uppercase">
								BENAR
							</span>
						</motion.div>
						
						{/* Overlay for False (Red) */}
						<motion.div 
							style={{ opacity: opacityLeft }} 
							className="absolute inset-0 bg-error/20 rounded-3xl z-10 flex items-center justify-center border-4 border-error"
						>
							<span className="text-error font-black text-4xl border-4 border-error p-4 rounded-xl transform rotate-12 uppercase">
								SALAH
							</span>
						</motion.div>

						<h3 className="text-xl md:text-2xl font-bold leading-relaxed relative z-0 pointer-events-none">
							{questionText}
						</h3>
					</motion.div>
				)}
			</div>

			{/* Desktop / Fallback Buttons */}
			<div className="flex gap-6 mt-8 w-full max-w-sm">
				<button 
					onClick={() => handleAnswer(false)}
					disabled={isAnswered || isPaused}
					className="flex-1 btn btn-lg btn-error btn-outline border-2 border-error hover:bg-error/20 text-error rounded-2xl flex flex-col h-auto py-3 gap-1 disabled:opacity-50"
				>
					<X className="w-8 h-8" />
					<span className="font-bold">SALAH</span>
				</button>
				
				<button 
					onClick={() => handleAnswer(true)}
					disabled={isAnswered || isPaused}
					className="flex-1 btn btn-lg btn-success btn-outline border-2 border-success hover:bg-success/20 text-success rounded-2xl flex flex-col h-auto py-3 gap-1 disabled:opacity-50"
				>
					<Check className="w-8 h-8" />
					<span className="font-bold">BENAR</span>
				</button>
			</div>
			
			<div className="mt-6 text-sm font-medium text-base-content/50 text-center animate-pulse">
				Geser kartu ke Kiri/Kanan atau tekan tombol
			</div>
		</div>
	);
};
