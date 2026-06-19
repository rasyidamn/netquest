import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

const HEART_RECOVERY_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 jam

interface HeartRecoveryTimer {
	timeRemaining: number;
	formattedTime: string;
	isRecovering: boolean;
}

function formatTime(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}j ${minutes}m`;
	}
	if (minutes > 0) {
		return `${minutes}m ${seconds}d`;
	}
	return `${seconds}d`;
}

/**
 * Menghitung countdown sampai pemulihan heart otomatis berikutnya.
 * Heart pulih 1 setiap 4 jam dari `heartsUpdatedAt`.
 * @param heartsUpdatedAt - ISO string dari profile
 * @param hearts - Jumlah heart saat ini
 */
export function useHeartRecoveryTimer(
	heartsUpdatedAt?: string,
	hearts?: number,
): HeartRecoveryTimer {
	const calcTimeRemaining = useCallback((): number => {
		if (!heartsUpdatedAt || (hearts !== undefined && hearts >= 3)) return 0;

		const updatedAt = dayjs(heartsUpdatedAt).valueOf();
		const now = Date.now();
		const elapsed = now - updatedAt;
		const remaining = HEART_RECOVERY_INTERVAL_MS - (elapsed % HEART_RECOVERY_INTERVAL_MS);

		return Math.max(0, remaining);
	}, [heartsUpdatedAt, hearts]);

	const [timeRemaining, setTimeRemaining] = useState(calcTimeRemaining);

	useEffect(() => {
		setTimeRemaining(calcTimeRemaining());

		const interval = setInterval(() => {
			setTimeRemaining(calcTimeRemaining());
		}, 1000);

		return () => clearInterval(interval);
	}, [calcTimeRemaining]);

	const isRecovering = timeRemaining > 0 && (hearts ?? 0) < 3;

	return {
		timeRemaining,
		formattedTime: formatTime(timeRemaining),
		isRecovering,
	};
}