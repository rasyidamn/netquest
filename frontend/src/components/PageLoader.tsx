import { LoadingSpinner } from "./LoadingSpinner";

interface PageLoaderProps {
	message?: string;
}

export function PageLoader({ message = "Memuat..." }: PageLoaderProps) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<LoadingSpinner size="lg" />
			<p className="text-sm text-muted-foreground">{message}</p>
		</div>
	);
}