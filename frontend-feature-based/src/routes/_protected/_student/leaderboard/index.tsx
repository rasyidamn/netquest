import { createFileRoute } from '@tanstack/react-router'
import { Trophy, Medal, Star, MedalIcon } from 'lucide-react'
import { useProfile } from '@/feature/auth/hooks'
import { useLeaderboardFull } from '@/feature/leaderboard/hooks/useLeaderboardFull'
import { getCurrentRank } from '@/utils/rank.util'
import { clsx } from 'clsx'

export const Route = createFileRoute('/_protected/_student/leaderboard/')({
  component: LeaderboardPage,
})

function LeaderboardSkeleton() {
	return (
		<div className="w-full max-w-4xl mx-auto space-y-4 mt-8">
			<div className="flex justify-center items-end gap-4 md:gap-8 mb-12 h-64">
				{[2, 1, 3].map((pos) => (
					<div key={pos} className={clsx("flex flex-col items-center gap-2", pos === 1 ? "h-56" : "h-48")}>
						<div className="w-16 h-16 rounded-full bg-base-300 animate-pulse" />
						<div className="w-24 h-4 bg-base-300 rounded animate-pulse" />
						<div className={clsx("w-20 md:w-28 bg-base-200/50 rounded-t-xl animate-pulse", pos === 1 ? "h-full" : "h-3/4")} />
					</div>
				))}
			</div>
			{Array.from({ length: 7 }).map((_, i) => (
				<div key={i} className="h-16 bg-base-200/50 rounded-xl animate-pulse" />
			))}
		</div>
	)
}

function LeaderboardPage() {
	const { data: user } = useProfile()
	const { data: leaderboard, isLoading } = useLeaderboardFull(20)

	if (isLoading) {
		return (
			<div className="p-4 md:p-8">
				<LeaderboardSkeleton />
			</div>
		)
	}

	if (!leaderboard || leaderboard.length === 0) {
		return (
			<div className="p-8 text-center text-base-content/60">
				<Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
				<h2 className="text-xl font-bold mb-2">Belum ada peringkat</h2>
				<p>Jadilah yang pertama untuk mendapatkan XP!</p>
			</div>
		)
	}

	// Pisahkan Top 3 dan sisanya
	const top3 = leaderboard.slice(0, 3)
	const restList = leaderboard.slice(3)

	// Urutkan top 3 untuk podium visual: [Rank 2, Rank 1, Rank 3]
	const podiumOrder = [
		top3[1], // Rank 2 (Kiri)
		top3[0], // Rank 1 (Tengah)
		top3[2], // Rank 3 (Kanan)
	].filter(Boolean)

	return (
		<div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			
			<div className="text-center mb-10">
				<h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center justify-center gap-3">
					<Trophy className="w-8 h-8 md:w-10 md:h-10 text-primary" />
					Papan Peringkat
				</h1>
				<p className="text-base-content/60 mt-2">Daftar 20 mahasiswa terbaik dengan akumulasi XP tertinggi.</p>
			</div>

			{/* PODIUM TOP 3 */}
			<div className="flex justify-center items-end gap-2 md:gap-6 mb-12 min-h-[280px]">
				{podiumOrder.map((entry) => {
					const isFirst = entry.rank === 1
					const isCurrentUser = user?.name === entry.name
					const userRank = getCurrentRank(entry.xp)
					
					let podiumStyle = ""
					let heightStyle = ""
					let icon = null
					
					if (entry.rank === 1) {
						podiumStyle = "bg-gradient-to-t from-amber-500/20 to-amber-400/40 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
						heightStyle = "h-48 md:h-56"
						icon = <Trophy className="w-8 h-8 text-amber-400 mb-2 drop-shadow-md" />
					} else if (entry.rank === 2) {
						podiumStyle = "bg-gradient-to-t from-slate-400/20 to-slate-300/40 border-slate-300"
						heightStyle = "h-36 md:h-44"
						icon = <MedalIcon className="w-7 h-7 text-slate-300 mb-2" />
					} else if (entry.rank === 3) {
						podiumStyle = "bg-gradient-to-t from-orange-700/20 to-orange-500/40 border-orange-500"
						heightStyle = "h-28 md:h-36"
						icon = <Medal className="w-6 h-6 text-orange-500 mb-2" />
					}

					return (
						<div key={entry.rank} className="flex flex-col items-center w-24 md:w-36 group relative">
							{/* Profil Atas Podium */}
							<div className="flex flex-col items-center mb-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
								{icon}
								<div className={clsx(
									"w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold border-2 mb-2 shadow-lg",
									isFirst ? "bg-amber-100 text-amber-600 border-amber-400" : 
									entry.rank === 2 ? "bg-slate-100 text-slate-600 border-slate-400" :
									"bg-orange-100 text-orange-700 border-orange-500",
									isCurrentUser && "ring-4 ring-primary ring-offset-2 ring-offset-base-100"
								)}>
									{entry.name.charAt(0).toUpperCase()}
								</div>
								
								<div className="text-center w-full px-1 flex flex-col items-center">
									<div className="font-bold text-sm md:text-base truncate w-full">
										{entry.name.split(" ")[0]}
									</div>
									<div className={clsx("text-[10px] md:text-xs font-semibold leading-tight mt-0.5 whitespace-nowrap", userRank.colorClass)}>
										{userRank.title}
									</div>
								</div>

								<div className="flex items-center gap-1 text-primary font-black text-xs md:text-sm bg-primary/10 px-2 py-0.5 rounded-full mt-1.5">
									<Star className="w-3 h-3 fill-current" />
									{entry.xp.toLocaleString('id-ID')}
								</div>
							</div>

							{/* Balok Podium */}
							<div className={clsx(
								"w-full rounded-t-xl border-t-4 flex items-start justify-center pt-4 transition-all duration-300 group-hover:brightness-125",
								podiumStyle,
								heightStyle
							)}>
								<span className="text-2xl md:text-4xl font-black text-white/50">{entry.rank}</span>
							</div>
						</div>
					)
				})}
			</div>

			{/* SISA PERINGKAT (4 - 20) */}
			<div className="space-y-3">
				{restList.map((entry, idx) => {
					const isCurrentUser = user?.name === entry.name
					const userRank = getCurrentRank(entry.xp)
					
					return (
						<div 
							key={entry.rank}
							className={clsx(
								"flex items-center p-3 md:p-4 rounded-2xl transition-all duration-300",
								"animate-in fade-in slide-in-from-bottom-4",
								isCurrentUser 
									? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.1)] scale-[1.02]" 
									: "bg-base-200/50 hover:bg-base-200 hover:scale-[1.01] border border-transparent"
							)}
							style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
						>
							<div className="w-8 md:w-10 text-center font-black text-base-content/40 text-lg md:text-xl">
								{entry.rank}
							</div>
							
							<div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-base-300 flex items-center justify-center font-bold text-base-content/60 mx-3 md:mx-4 shrink-0">
								{entry.name.charAt(0).toUpperCase()}
							</div>

							<div className="flex-1 flex flex-col justify-center min-w-0 pr-4">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-sm md:text-base truncate">
										{entry.name}
									</span>
									{isCurrentUser && (
										<span className="text-[10px] md:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
											ANDA
										</span>
									)}
								</div>
								<div className={clsx("text-xs md:text-sm font-medium mt-0.5 truncate", userRank.colorClass)}>
									{userRank.title} <span className="opacity-50 text-[10px] ml-1">(Lv.{userRank.level})</span>
								</div>
							</div>

							<div className="flex items-center gap-1.5 md:gap-2 font-black text-primary text-sm md:text-base shrink-0">
								<Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
								{entry.xp.toLocaleString('id-ID')}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
