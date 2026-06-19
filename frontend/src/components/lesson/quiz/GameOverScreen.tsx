import { IconHeartBroken, IconBook } from "@tabler/icons-react";

interface GameOverScreenProps {
	onBackToMaterial: () => void;
}

export function GameOverScreen({ onBackToMaterial }: GameOverScreenProps) {
	return (
		<div className="mx-auto max-w-md space-y-6 py-8 text-center">
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
				<IconHeartBroken size={40} className="text-error" />
			</div>

			<div>
				<h2 className="text-2xl font-bold text-base-content">
					Nyawa Habis!
				</h2>
				<p className="mt-2 text-base text-base-content/60">
					Kamu kehabisan nyawa. Bacalah ulang materi teori untuk
					memulihkan nyawa sebelum mencoba lagi.
				</p>
			</div>

			<button
				type="button"
				onClick={onBackToMaterial}
				className="btn btn-primary w-full gap-2"
			>
				<IconBook size={18} />
				Baca Ulang Materi
			</button>
		</div>
	);
}