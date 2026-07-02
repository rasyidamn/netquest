import { useRouter } from "@tanstack/react-router";
import { AlertTriangleIcon, RefreshCcwIcon } from "lucide-react";

// Properti standar yang dilempar oleh TanStack Router
interface GlobalErrorFallbackProps {
	error: Error;
	reset?: () => void;
}

export const GlobalErrorFallback = ({
	error,
	reset,
}: GlobalErrorFallbackProps) => {
	const router = useRouter();

	const handleReset = () => {
		// 1. Invalidate router untuk memaksa pemuatan ulang rute dan loader
		router.invalidate();

		// 2. Panggil fungsi reset bawaan (jika disediakan oleh router)
		if (reset) {
			reset();
		} else {
			// Opsi paling aman jika aplikasi benar-benar macet: hard reload
			window.location.reload();
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-md text-center">
				<AlertTriangleIcon
					size={64}
					className="mx-auto mb-4 text-red-500"
				/>
				<h1 className="mb-2 text-2xl font-bold text-gray-900">
					Terjadi Kesalahan
				</h1>
				<p className="mb-6 text-gray-600">
					Maaf, terjadi kesalahan yang tidak terduga. Silakan coba
					lagi.
				</p>

				{/* Hanya tampilkan detail error di mode Development (Vite) */}
				{import.meta.env.VITE_DEV && (
					<pre className="mb-6 max-h-32 overflow-auto rounded-lg bg-gray-200 p-3 text-left text-sm text-gray-800">
						{error.message}
					</pre>
				)}

				<button
					onClick={handleReset}
					className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
				>
					<RefreshCcwIcon size={20} />
					Coba Lagi
				</button>
			</div>
		</div>
	);
};
