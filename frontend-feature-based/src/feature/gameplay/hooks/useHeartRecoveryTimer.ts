import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

const HEART_RECOVERY_INTERVAL_MS = 3 * 60 * 1000; // 30 menit (selaras dengan backend)

interface HeartRecoveryTimer {
	timeRemaining: number;
	formattedTime: string;
	isRecovering: boolean;
}

function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	if (minutes > 0) {
		return `${minutes}m ${seconds.toString().padStart(2, "0")}d`;
	}
	return `${seconds}d`;
}

/**
 * Menghitung countdown sampai pemulihan heart otomatis berikutnya.
 * Heart pulih 1 setiap 30 menit dari `heartsUpdatedAt`.
 * Saat timer menyentuh 0, profil di-invalidate agar nyawa segar dari server.
 * @param heartsUpdatedAt - ISO string dari profile
 * @param hearts - Jumlah heart saat ini
 */
export function useHeartRecoveryTimer(
	heartsUpdatedAt?: string,
	hearts?: number,
): HeartRecoveryTimer {
	const queryClient = useQueryClient();

	const calcTimeRemaining = useCallback((): { remaining: number; shouldSync: boolean } => {
		if (!heartsUpdatedAt || (hearts !== undefined && hearts >= 3)) {
			return { remaining: 0, shouldSync: false };
		}

		const updatedAt = dayjs(heartsUpdatedAt).valueOf();
		const now = Date.now();
		const elapsed = now - updatedAt;

		// Jika durasi sejak update terakhir sudah lebih dari batas cooldown, waktunya minta server sinkronisasi!
		if (elapsed >= HEART_RECOVERY_INTERVAL_MS) {
			return { remaining: 0, shouldSync: true };
		}

		// Jika timer belum selesai, hitung sisa waktunya
		// Math.max melindungi jika elapsed bernilai negatif (jam client lebih lambat dari server)
		const remaining = HEART_RECOVERY_INTERVAL_MS - Math.max(0, elapsed);
		return { remaining, shouldSync: false };
	}, [heartsUpdatedAt, hearts]);

	const [{ remaining: timeRemaining }, setTimeState] = useState(calcTimeRemaining());

	useEffect(() => {
		const checkAndSet = () => {
			const state = calcTimeRemaining();
			setTimeState(state);

			// Side effect: panggil ulang /profile jika waktu sudah habis,
			// agar backend memberikan nyawa segar & timer berikutnya
			if (state.shouldSync && (hearts ?? 3) < 3) {
				queryClient.invalidateQueries({ queryKey: ["profile"] });
			}
		};

		checkAndSet();

		const interval = setInterval(checkAndSet, 1000);
		return () => clearInterval(interval);
	}, [calcTimeRemaining, hearts, queryClient]);

	const isRecovering = timeRemaining > 0 && (hearts ?? 0) < 3;

	return {
		timeRemaining,
		formattedTime: formatTime(timeRemaining),
		isRecovering,
	};
}