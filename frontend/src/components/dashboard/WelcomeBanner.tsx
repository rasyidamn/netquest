import { cn } from "@/utils/cn";

interface WelcomeBannerProps {
	isLoading?: boolean;
	name?: string;
}

const MOTIVATIONS = [
	"Terus belajar, kuasai jaringan komputer!",
	"Setiap lesson membawamu lebih dekat jadi ahli jaringan!",
	"Jangan menyerah, pahlawan jaringan!",
	"Belajar itu perjalanan, nikmati prosesnya!",
	"Koneksikan dirimu dengan ilmu baru!",
];

function getRandomMotivation() {
	return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
}

export function WelcomeBanner({ isLoading, name }: WelcomeBannerProps) {
	if (isLoading) {
		return <div className="skeleton h-24 w-full rounded-xl" />;
	}

	return (
		<div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-6 text-primary-content shadow-md">
			<h1 className="text-2xl font-bold">
				Halo, {name || "Mahasiswa"}! 👋
			</h1>
			<p className="mt-1 text-primary-content/80">
				{getRandomMotivation()}
			</p>
		</div>
	);
}