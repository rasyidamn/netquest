// prisma/seed.ts
import { prisma } from "../src/configs/database.config.js";
import bcrypt from "bcrypt";
import {
	RoleEnum,
	LessonTypeEnum,
	ProgressStatusEnum,
} from "../src/generated/prisma/enums.js";

async function main() {
	console.log("Memulai proses seeding... 🌱");

	// 0. Membersihkan seluruh isi database untuk menjaga konsistensi data
	console.log("Membersihkan data lama... 🧹");
	await prisma.userProgress.deleteMany({});
	await prisma.option.deleteMany({});
	await prisma.question.deleteMany({});
	await prisma.material.deleteMany({});
	await prisma.lesson.deleteMany({});
	await prisma.module.deleteMany({});
	await prisma.user.deleteMany({});

	// 1. Buat Akun Default (Admin)
	const hashedPassword = await bcrypt.hash("12345678", 10);

	const adminUser = await prisma.user.create({
		data: {
			nim: "A710220052",
			name: "Super Admin",
			password: hashedPassword,
			role: RoleEnum.ADMIN,
			xp: 9999,
			level: 99,
			hearts: 99,
		},
	});
	console.log(`✅ Admin berhasil dibuat: ${adminUser.name}`);

	// 2. Buat Akun Mahasiswa (3 Mahasiswa)
	const studentBudi = await prisma.user.create({
		data: {
			nim: "A710220001",
			name: "Budi Prasetyo",
			password: hashedPassword,
			role: RoleEnum.MAHASISWA,
			xp: 150,
			level: 2,
			hearts: 3,
		},
	});

	const studentAni = await prisma.user.create({
		data: {
			nim: "A710220002",
			name: "Ani Wijaya",
			password: hashedPassword,
			role: RoleEnum.MAHASISWA,
			xp: 50,
			level: 1,
			hearts: 2,
		},
	});

	const studentCandra = await prisma.user.create({
		data: {
			nim: "A710220003",
			name: "Candra Kirana",
			password: hashedPassword,
			role: RoleEnum.MAHASISWA,
			xp: 0,
			level: 1,
			hearts: 3,
		},
	});
	console.log(`✅ Akun mahasiswa berhasil dibuat!`);

	// 3. Buat Modul dan Pelajaran (Lesson)
	const module1 = await prisma.module.create({
		data: {
			title: "Pengenalan Jaringan Komputer Dasar",
			sequence: 1,
		},
	});

	const lesson1_1 = await prisma.lesson.create({
		data: {
			moduleId: module1.id,
			title: "Konsep Jaringan Komputer",
			lessonSequence: 1,
			type: LessonTypeEnum.THEORY,
			xpReward: 50,
		},
	});

	await prisma.material.create({
		data: {
			lessonId: lesson1_1.id,
			content:
				"Jaringan komputer adalah dua atau lebih perangkat komputer yang saling terhubung menggunakan media kabel maupun nirkabel untuk membagikan data, informasi, dan sumber daya lainnya.",
			mediaUrl:
				"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
		},
	});

	const lesson1_2 = await prisma.lesson.create({
		data: {
			moduleId: module1.id,
			title: "Kuis Dasar Jaringan Komputer",
			lessonSequence: 2,
			type: LessonTypeEnum.QUIZ,
			xpReward: 100,
		},
	});

	const q1 = await prisma.question.create({
		data: {
			lessonId: lesson1_2.id,
			questionText:
				"Perangkat yang berfungsi menghubungkan dua atau lebih jaringan yang berbeda segmen/subnet adalah...",
			xpReward: 15,
		},
	});

	await prisma.option.createMany({
		data: [
			{ questionId: q1.id, optionText: "Router", isCorrect: true },
			{ questionId: q1.id, optionText: "Switch", isCorrect: false },
			{ questionId: q1.id, optionText: "Hub", isCorrect: false },
			{ questionId: q1.id, optionText: "Repeater", isCorrect: false },
		],
	});

	const q2 = await prisma.question.create({
		data: {
			lessonId: lesson1_2.id,
			questionText:
				"Apa kepanjangan dari istilah LAN dalam jaringan komputer?",
			xpReward: 15,
		},
	});

	await prisma.option.createMany({
		data: [
			{ questionId: q2.id, optionText: "Local Area Network", isCorrect: true },
			{ questionId: q2.id, optionText: "Local Access Network", isCorrect: false },
			{ questionId: q2.id, optionText: "Logical Area Network", isCorrect: false },
			{ questionId: q2.id, optionText: "Link Active Network", isCorrect: false },
		],
	});

	const module2 = await prisma.module.create({
		data: {
			title: "Topologi Jaringan",
			sequence: 2,
		},
	});

	const lesson2_1 = await prisma.lesson.create({
		data: {
			moduleId: module2.id,
			title: "Mengenal Macam-macam Topologi",
			lessonSequence: 1,
			type: LessonTypeEnum.THEORY,
			xpReward: 50,
		},
	});

	await prisma.material.create({
		data: {
			lessonId: lesson2_1.id,
			content:
				"Topologi jaringan adalah aspek fisik dan logis yang mendefinisikan bagaimana perangkat dalam jaringan saling terhubung dan bertukar data. Beberapa topologi populer meliputi Star, Bus, Ring, dan Mesh.",
			mediaUrl:
				"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
		},
	});

	const lesson2_2 = await prisma.lesson.create({
		data: {
			moduleId: module2.id,
			title: "Kuis Topologi Jaringan",
			lessonSequence: 2,
			type: LessonTypeEnum.QUIZ,
			xpReward: 100,
		},
	});

	const q3 = await prisma.question.create({
		data: {
			lessonId: lesson2_2.id,
			questionText:
				"Topologi jaringan yang menggunakan satu kabel pusat sebagai tulang punggung (backbone) adalah topologi...",
			xpReward: 15,
		},
	});

	await prisma.option.createMany({
		data: [
			{ questionId: q3.id, optionText: "Bus", isCorrect: true },
			{ questionId: q3.id, optionText: "Star", isCorrect: false },
			{ questionId: q3.id, optionText: "Ring", isCorrect: false },
			{ questionId: q3.id, optionText: "Mesh", isCorrect: false },
		],
	});

	const q4 = await prisma.question.create({
		data: {
			lessonId: lesson2_2.id,
			questionText: "Kelebihan utama dari topologi Mesh (Full Mesh) adalah...",
			xpReward: 15,
		},
	});

	await prisma.option.createMany({
		data: [
			{
				questionId: q4.id,
				optionText: "Toleransi kesalahan sangat tinggi (redundancy optimal)",
				isCorrect: true,
			},
			{ questionId: q4.id, optionText: "Biaya instalasi sangat murah", isCorrect: false },
			{ questionId: q4.id, optionText: "Kemudahan konfigurasi kabel", isCorrect: false },
			{ questionId: q4.id, optionText: "Menghemat penggunaan switch", isCorrect: false },
		],
	});

	console.log(
		`✅ Modul, Lesson, Material, Soal, & Opsi berhasil dibuat!`,
	);

	// 4. Seeding Progres Belajar Mahasiswa (Mengikuti pola `auth.service.register` -> Logika buka lesson)
	// Pola pendaftaran: User dibuat, lalu lesson pertama dari modul dengan sequence terkecil otomatis dibuka (ACTIVE)
	// Berikut adalah simulasi progres beberapa mahasiswa setelah beberapa kali bermain:

	// Budi: Sudah menyelesaikan Modul 1 (kedua lesson), saat ini berada di Lesson 1 Modul 2 (ACTIVE)
	await prisma.userProgress.createMany({
		data: [
			{
				userId: studentBudi.id,
				lessonId: lesson1_1.id,
				status: ProgressStatusEnum.COMPLETED,
				bestScore: 100,
			},
			{
				userId: studentBudi.id,
				lessonId: lesson1_2.id,
				status: ProgressStatusEnum.COMPLETED,
				bestScore: 85,
			},
			{
				userId: studentBudi.id,
				lessonId: lesson2_1.id,
				status: ProgressStatusEnum.ACTIVE,
				bestScore: 0,
			},
		],
	});

	// Ani: Sudah menyelesaikan Lesson 1 Modul 1, saat ini mengerjakan Kuis Modul 1 (ACTIVE)
	await prisma.userProgress.createMany({
		data: [
			{
				userId: studentAni.id,
				lessonId: lesson1_1.id,
				status: ProgressStatusEnum.COMPLETED,
				bestScore: 100,
			},
			{
				userId: studentAni.id,
				lessonId: lesson1_2.id,
				status: ProgressStatusEnum.ACTIVE,
				bestScore: 0,
			},
		],
	});

	// Candra: Fresh user, hanya Lesson 1 Modul 1 yang ACTIVE (sama persis dengan logika register)
	await prisma.userProgress.create({
		data: {
			userId: studentCandra.id,
			lessonId: lesson1_1.id,
			status: ProgressStatusEnum.ACTIVE,
			bestScore: 0,
		},
	});

	console.log(`✅ Progres belajar mahasiswa berhasil disinkronisasi!`);
	console.log("Seeding selesai! 🌳");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
