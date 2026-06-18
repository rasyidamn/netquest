import { useNavigate } from "@tanstack/react-router";
import { IconLock, IconArrowLeft } from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth.store";

export function UnauthorizedPage() {
	const navigate = useNavigate();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	const handleBack = () => {
		if (isAuthenticated) {
			navigate({ to: "/" });
		} else {
			navigate({ to: "/auth/login" });
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
			<div className="w-full max-w-md text-center">
				<IconLock size={80} className="mx-auto mb-4 text-orange-400" />
				<h1 className="mb-2 text-6xl font-bold text-gray-900">403</h1>
				<h2 className="mb-2 text-xl font-semibold text-gray-700">
					Akses Ditolak
				</h2>
				<p className="mb-8 text-gray-500">
					Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
					hubungi administrator jika Anda yakin ini adalah kesalahan.
				</p>
				<button
					onClick={handleBack}
					className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
				>
					<IconArrowLeft size={20} />
					Kembali
				</button>
			</div>
		</div>
	);
}