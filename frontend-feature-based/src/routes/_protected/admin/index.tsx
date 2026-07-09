import { createFileRoute } from '@tanstack/react-router';
import { LayoutDashboard, Users, BookOpen, Hash, Zap, Trophy, UserPlus, Clock } from 'lucide-react';
import { useAdminDashboard } from '@/feature/dashboard/hooks/useAdminDashboard';
import clsx from 'clsx';

export const Route = createFileRoute('/_protected/admin/')({
	component: AdminDashboardPage,
});

function AdminDashboardPage() {
	const { data: stats, isLoading, isError } = useAdminDashboard();

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	if (isError || !stats) {
		return (
			<div className="flex h-[60vh] items-center justify-center flex-col gap-4">
				<p className="text-error font-medium">Gagal memuat data dashboard.</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500 pb-10">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200/50 pb-6">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 rounded-2xl">
						<LayoutDashboard className="w-8 h-8 text-primary" />
					</div>
					<div>
						<h1 className="text-3xl font-black bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent">
							Dashboard Utama
						</h1>
						<p className="text-sm text-base-content/60 mt-1">
							Ringkasan aktivitas dan performa komunitas NetQuest.
						</p>
					</div>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1 */}
				<div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200/50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
					<div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
					<div className="flex items-center justify-between mb-4 relative z-10">
						<h3 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">Total Mahasiswa</h3>
						<div className="p-2 bg-primary/10 rounded-xl text-primary">
							<Users className="w-5 h-5" />
						</div>
					</div>
					<div className="relative z-10">
						<span className="text-4xl font-black text-base-content">{stats.totalStudents}</span>
					</div>
				</div>

				{/* Card 2 */}
				<div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200/50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
					<div className="absolute -right-6 -top-6 w-24 h-24 bg-info/5 rounded-full blur-xl group-hover:bg-info/10 transition-colors"></div>
					<div className="flex items-center justify-between mb-4 relative z-10">
						<h3 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">Modul & Misi</h3>
						<div className="p-2 bg-info/10 rounded-xl text-info">
							<BookOpen className="w-5 h-5" />
						</div>
					</div>
					<div className="relative z-10 flex flex-wrap items-baseline gap-x-2 gap-y-1">
						<div className="whitespace-nowrap">
							<span className="text-4xl font-black text-base-content">{stats.totalModules}</span>
							<span className="text-sm font-bold text-base-content/50 ml-1">Modul</span>
						</div>
						<span className="text-base-content/30 opacity-50 hidden xl:inline">•</span>
						<div className="whitespace-nowrap">
							<span className="text-2xl font-black text-base-content/80">{stats.totalLessons}</span>
							<span className="text-sm font-bold text-base-content/50 ml-1">Misi</span>
						</div>
					</div>
				</div>

				{/* Card 3 */}
				<div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200/50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
					<div className="absolute -right-6 -top-6 w-24 h-24 bg-warning/5 rounded-full blur-xl group-hover:bg-warning/10 transition-colors"></div>
					<div className="flex items-center justify-between mb-4 relative z-10">
						<h3 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">Total XP Komunitas</h3>
						<div className="p-2 bg-warning/10 rounded-xl text-warning">
							<Zap className="w-5 h-5" />
						</div>
					</div>
					<div className="relative z-10">
						<span className="text-4xl font-black text-warning">{stats.totalXp}</span>
					</div>
				</div>

				{/* Card 4 */}
				<div className="bg-base-100 p-6 rounded-3xl shadow-sm border border-base-200/50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
					<div className="absolute -right-6 -top-6 w-24 h-24 bg-success/5 rounded-full blur-xl group-hover:bg-success/10 transition-colors"></div>
					<div className="flex items-center justify-between mb-4 relative z-10">
						<h3 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">Tingkat Partisipasi</h3>
						<div className="p-2 bg-success/10 rounded-xl text-success">
							<Hash className="w-5 h-5" />
						</div>
					</div>
					<div className="relative z-10 flex items-end justify-between">
						<div>
							<span className="text-4xl font-black text-base-content">{stats.activeUsersRate}%</span>
							<p className="text-xs font-medium text-base-content/50 mt-1">Siswa mulai belajar</p>
						</div>
						
						{/* Radial Progress Graphic */}
						<div 
							className="radial-progress text-success bg-base-200 text-xs font-bold border-4 border-base-200" 
							style={{ "--value": stats.activeUsersRate, "--size": "2.5rem" } as any}
						>
							{stats.activeUsersRate}%
						</div>
					</div>
				</div>
			</div>

			{/* Highlight / Alert Banner */}
			{stats.mostActiveModule && (
				<div className="bg-gradient-to-r from-primary/10 to-info/10 border border-primary/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="bg-base-100 p-3 rounded-2xl shadow-sm text-primary">
							<Zap className="w-6 h-6 fill-primary/20" />
						</div>
						<div>
							<h3 className="font-bold text-base-content text-lg">Modul Paling Aktif Saat Ini</h3>
							<p className="text-sm text-base-content/70">
								Modul <span className="font-bold">"{stats.mostActiveModule.title}"</span> memiliki interaksi tertinggi dengan {stats.mostActiveModule.interactions} riwayat aktivitas pengerjaan.
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top 5 Leaderboard */}
				<div className="bg-base-100 rounded-3xl shadow-sm border border-base-200/50 flex flex-col overflow-hidden">
					<div className="p-6 border-b border-base-200/50 bg-base-200/30 flex items-center gap-3">
						<Trophy className="w-5 h-5 text-warning" />
						<h2 className="text-lg font-black text-base-content">Top 5 Mahasiswa</h2>
					</div>
					<div className="p-2">
						{stats.topStudents.length === 0 ? (
							<div className="p-8 text-center text-base-content/50 font-medium">Belum ada data.</div>
						) : (
							<ul className="space-y-1">
								{stats.topStudents.map((student, idx) => (
									<li key={student.id} className="flex items-center justify-between p-3 hover:bg-base-200/50 rounded-xl transition-colors">
										<div className="flex items-center gap-4">
											<div className={clsx(
												"w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
												idx === 0 ? "bg-warning/20 text-warning" :
												idx === 1 ? "bg-base-300 text-base-content/70" :
												idx === 2 ? "bg-orange-500/20 text-orange-600" :
												"bg-base-200 text-base-content/50"
											)}>
												#{idx + 1}
											</div>
											<div>
												<p className="font-bold text-base-content text-sm">{student.name}</p>
												<p className="text-xs text-base-content/50 font-mono mt-0.5">{student.nim}</p>
											</div>
										</div>
										<div className="font-black text-warning bg-warning/10 px-3 py-1 rounded-lg text-sm">
											{student.xp} XP
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Recent Registrations */}
				<div className="bg-base-100 rounded-3xl shadow-sm border border-base-200/50 flex flex-col overflow-hidden">
					<div className="p-6 border-b border-base-200/50 bg-base-200/30 flex items-center gap-3">
						<UserPlus className="w-5 h-5 text-info" />
						<h2 className="text-lg font-black text-base-content">Pendaftar Terbaru</h2>
					</div>
					<div className="p-2">
						{stats.recentUsers.length === 0 ? (
							<div className="p-8 text-center text-base-content/50 font-medium">Belum ada pendaftar.</div>
						) : (
							<ul className="space-y-1">
								{stats.recentUsers.map((user) => (
									<li key={user.id} className="flex items-center justify-between p-3 hover:bg-base-200/50 rounded-xl transition-colors">
										<div>
											<p className="font-bold text-base-content text-sm">{user.name}</p>
											<p className="text-xs text-base-content/50 font-mono mt-0.5">{user.nim}</p>
										</div>
										<div className="flex items-center gap-1.5 text-xs font-bold text-base-content/40 bg-base-200 px-3 py-1.5 rounded-lg">
											<Clock className="w-3.5 h-3.5" />
											{new Date(user.createdAt).toLocaleDateString('id-ID', {
												day: 'numeric',
												month: 'short',
											})}
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
