import { prisma } from "../configs/database.config.js";
import { RoleEnum } from "../generated/prisma/enums.js";

export class AdminDashboardService {
	static getDashboardStats = async () => {
		// 1. Basic Counts
		const totalStudents = await prisma.user.count({
			where: { role: RoleEnum.MAHASISWA },
		});
		
		const totalModules = await prisma.module.count();
		
		const totalLessons = await prisma.lesson.count();

		// 2. Total XP Komunitas
		const users = await prisma.user.findMany({
			where: { role: RoleEnum.MAHASISWA },
			select: { xp: true, id: true, createdAt: true, name: true, nim: true },
			orderBy: { xp: "desc" }
		});
		
		const totalXp = users.reduce((sum, user) => sum + user.xp, 0);

		// 3. Top 5 Leaderboard
		const topStudents = users.slice(0, 5).map(u => ({
			id: u.id,
			name: u.name,
			nim: u.nim,
			xp: u.xp
		}));

		// 4. Recent Registrations
		const recentUsers = [...users]
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice(0, 5)
			.map(u => ({
				id: u.id,
				name: u.name,
				nim: u.nim,
				createdAt: u.createdAt
			}));

		// 5. Active Users Rate (Tingkat Partisipasi)
		// Cari jumlah unik mahasiswa yang ada di tabel UserProgress
		const activeUsersCount = await prisma.userProgress.groupBy({
			by: ['userId'],
		});
		
		const activeUsersRate = totalStudents > 0 
			? Math.round((activeUsersCount.length / totalStudents) * 100) 
			: 0;

		// 6. Modul Paling Aktif (Most Active Module)
		const modulesWithProgress = await prisma.module.findMany({
			include: {
				lessons: {
					include: {
						_count: {
							select: { userProgress: true }
						}
					}
				}
			}
		});

		let mostActiveModule = null;
		let maxProgressCount = -1;

		for (const mod of modulesWithProgress) {
			const totalProgressInModule = mod.lessons.reduce((sum, lesson) => sum + lesson._count.userProgress, 0);
			if (totalProgressInModule > maxProgressCount) {
				maxProgressCount = totalProgressInModule;
				mostActiveModule = {
					id: mod.id,
					title: mod.title,
					interactions: totalProgressInModule
				};
			}
		}

		return {
			totalStudents,
			totalModules,
			totalLessons,
			totalXp,
			activeUsersRate,
			mostActiveModule,
			topStudents,
			recentUsers
		};
	};
}
