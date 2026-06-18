import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "@phosphor-icons/react";

interface XpGainToastProps {
	xpGained: number;
	visible: boolean;
}

function XpGainToastContent({ xpGained, visible }: XpGainToastProps) {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: -20 }}
					transition={{ type: "spring", stiffness: 400, damping: 25 }}
					className="flex items-center gap-3 rounded-box border border-success/30 bg-success/10 px-5 py-4 shadow-lg backdrop-blur-sm"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 text-success">
						<Trophy size={22} weight="fill" />
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-success">
							Quest Selesai!
						</span>
						<span className="text-lg font-bold text-warning">
							+{xpGained} XP
						</span>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export function showXpGainToast(xpGained: number) {
	toast.custom(
		(t) => <XpGainToastContent xpGained={xpGained} visible={t.visible} />,
		{
			duration: 3000,
			position: "top-center",
		},
	);
}