// prisma/seed.ts
import { prisma } from "../src/configs/database.config.js";
import bcrypt from "bcrypt";
import {
	RoleEnum,
	LessonTypeEnum,
	ProgressStatusEnum,
} from "../src/generated/prisma/enums.js";

const SYLLABUS = [
	// ==========================================
	// MODULE 1: PENGENALAN JARINGAN KOMPUTER DASAR
	// ==========================================
	{
		title: "Pengenalan Jaringan Komputer Dasar",
		sequence: 1,
		lessons: [
			{
				title: "Konsep Dasar & Manfaat",
				lessonSequence: 1,
				type: LessonTypeEnum.THEORY,
				xpReward: 50,
				material: {
					content:
						"Jaringan komputer adalah dua atau lebih perangkat komputer yang saling terhubung menggunakan media kabel maupun nirkabel untuk membagikan data, informasi, dan sumber daya lainnya. Dengan adanya jaringan, pengguna dapat berkomunikasi, berbagi file, serta menggunakan perangkat keras seperti printer secara bersama-sama. Jaringan komputer juga memungkinkan akses ke internet, yang membuka pintu menuju sumber informasi global.",
					mediaUrl:
						"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
				},
			},
			{
				title: "Jenis Jaringan (LAN, MAN, WAN)",
				lessonSequence: 2,
				type: LessonTypeEnum.THEORY,
				xpReward: 50,
				material: {
					content:
						"Berdasarkan jangkauan geografisnya, jaringan dibagi menjadi tiga jenis utama. LAN (Local Area Network) mencakup area terbatas seperti gedung atau kampus. MAN (Metropolitan Area Network) mencakup area kota besar. WAN (Wide Area Network) menjangkau antar kota, negara, bahkan benua. Contoh paling terkenal dari WAN adalah internet. Semakin luas jangkauannya, semakin kompleks teknologi yang digunakan dan semakin tinggi biaya implementasinya.",
					mediaUrl:
						"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
				},
			},
			{
				title: "Kuis Dasar Jaringan",
				lessonSequence: 3,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Perangkat yang berfungsi menghubungkan dua atau lebih jaringan yang berbeda segmen/subnet adalah...",
						reward: 50,
						options: [
							{ text: "Router", isCorrect: true },
							{ text: "Switch", isCorrect: false },
							{ text: "Hub", isCorrect: false },
							{ text: "Repeater", isCorrect: false },
						],
					},
					{
						text: "Apa kepanjangan dari istilah LAN dalam jaringan komputer?",
						reward: 50,
						options: [
							{ text: "Local Area Network", isCorrect: true },
							{ text: "Local Access Network", isCorrect: false },
							{ text: "Logical Area Network", isCorrect: false },
							{ text: "Link Active Network", isCorrect: false },
						],
					},
					{
						text: "Jaringan komputer yang mencakup area perkotaan disebut...",
						reward: 50,
						options: [
							{ text: "MAN", isCorrect: true },
							{ text: "LAN", isCorrect: false },
							{ text: "WAN", isCorrect: false },
							{ text: "PAN", isCorrect: false },
						],
					},
					{
						text: "Berikut ini yang BUKAN merupakan manfaat dari jaringan komputer adalah...",
						reward: 50,
						options: [
							{ text: "Meningkatkan biaya operasional secara drastis", isCorrect: true },
							{ text: "Berbagi sumber daya (printer, scanner)", isCorrect: false },
							{ text: "Komunikasi antar pengguna", isCorrect: false },
							{ text: "Akses informasi dan data bersama", isCorrect: false },
						],
					},
				],
			},
		],
	},
	// ==========================================
	// MODULE 2: TOPOLOGI JARINGAN
	// ==========================================
	{
		title: "Topologi Jaringan",
		sequence: 2,
		lessons: [
			{
				title: "Mengenal Macam-macam Topologi",
				lessonSequence: 1,
				type: LessonTypeEnum.THEORY,
				xpReward: 70,
				material: {
					content:
						"Topologi jaringan adalah desain fisik dan logis yang mendefinisikan bagaimana perangkat saling terhubung. Topologi Star menggunakan switch/hub sentral sebagai pusat koneksi. Topologi Bus menggunakan satu kabel utama (backbone) dengan terminasi di kedua ujungnya. Topologi Ring menghubungkan perangkat secara melingkar, di mana data melewati setiap perangkat secara bergiliran. Topologi Mesh menyediakan jalur terdedikasi antar setiap perangkat, memberikan redundansi tinggi namun biaya besar.",
					mediaUrl:
						"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
				},
			},
			{
				title: "Kelebihan & Kekurangan Topologi",
				lessonSequence: 2,
				type: LessonTypeEnum.THEORY,
				xpReward: 70,
				material: {
					content:
						"Setiap topologi memiliki trade-off. Topologi Star mudah dikelola dan jika satu kabel putus tidak mengganggu yang lain, tetapi bergantung penuh pada perangkat pusat. Topologi Bus murah dan mudah dipasang, namun sulit dideteksi jika terjadi masalah. Topologi Ring memiliki performa stabil, tetapi jika satu titik putus seluruh jaringan terganggu. Topologi Mesh sangat andal dan aman, namun membutuhkan banyak kabel dan port, sehingga mahal.",
					mediaUrl:
						"https://images.unsplash.com/photo-1663681837878-55c67d6a2692?w=800",
				},
			},
			{
				title: "Kuis Topologi",
				lessonSequence: 3,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Topologi jaringan yang menggunakan satu kabel pusat sebagai tulang punggung (backbone) adalah...",
						reward: 50,
						options: [
							{ text: "Bus", isCorrect: true },
							{ text: "Star", isCorrect: false },
							{ text: "Ring", isCorrect: false },
							{ text: "Mesh", isCorrect: false },
						],
					},
					{
						text: "Jika titik pusat (hub/switch) mengalami kerusakan, maka seluruh jaringan akan lumpuh. Ini adalah kelemahan dari topologi...",
						reward: 50,
						options: [
							{ text: "Star", isCorrect: true },
							{ text: "Bus", isCorrect: false },
							{ text: "Tree", isCorrect: false },
							{ text: "Mesh", isCorrect: false },
						],
					},
					{
						text: "Topologi yang menyediakan jalur komunikasi terdedikasi antar setiap perangkat sehingga memiliki redundansi tinggi disebut...",
						reward: 50,
						options: [
							{ text: "Mesh", isCorrect: true },
							{ text: "Star", isCorrect: false },
							{ text: "Ring", isCorrect: false },
							{ text: "Bus", isCorrect: false },
						],
					},
					{
						text: "Kelemahan utama dari topologi Ring adalah...",
						reward: 50,
						options: [
							{ text: "Kerusakan satu perangkat dapat mengganggu seluruh jaringan", isCorrect: true },
							{ text: "Biaya pemasangan sangat mahal", isCorrect: false },
							{ text: "Sulit dalam pengelolaan kabel", isCorrect: false },
							{ text: "Kecepatan transfer sangat lambat", isCorrect: false },
						],
					},
				],
			},
		],
	},
	// ==========================================
	// MODULE 3: MODEL REFERENSI OSI
	// ==========================================
	{
		title: "Model Referensi OSI",
		sequence: 3,
		lessons: [
			{
				title: "Tujuh Lapisan OSI",
				lessonSequence: 1,
				type: LessonTypeEnum.THEORY,
				xpReward: 100,
				material: {
					content:
						"Model OSI (Open Systems Interconnection) memiliki 7 layer yang bekerja secara berurutan: Physical (bit, sinyal listrik), Data Link (frame, MAC Address), Network (paket, routing IP), Transport (segment, TCP/UDP), Session (sesi koneksi), Presentation (enkripsi, kompresi), dan Application (antarmuka pengguna). Setiap layer hanya berkomunikasi dengan layer di atas dan di bawahnya secara langsung, menciptakan abstraksi yang memudahkan pengembangan dan troubleshooting.",
					mediaUrl:
						"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
				},
			},
			{
				title: "Proses Enkapsulasi Data",
				lessonSequence: 2,
				type: LessonTypeEnum.THEORY,
				xpReward: 100,
				material: {
					content:
						"Enkapsulasi data adalah proses di mana data dibungkus dengan header (dan kadang trailer) dari setiap layer OSI sebelum dikirimkan. Saat data bergerak dari Application Layer ke Physical Layer, setiap layer menambahkan informasinya sendiri. Di sisi penerima, proses sebaliknya disebut dekapsulasi: setiap layer membaca dan melepas header-nya sebelum meneruskan ke layer di atasnya. Proses ini memastikan data dikirim dengan lengkap, aman, dan sampai ke tujuan yang benar.",
					mediaUrl:
						"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
				},
			},
			{
				title: "Ujian OSI Layer",
				lessonSequence: 3,
				type: LessonTypeEnum.QUIZ,
				xpReward: 200,
				questions: [
					{
						text: "Protokol IP (Internet Protocol) beroperasi pada layer ke berapa dalam model OSI?",
						reward: 100,
						options: [
							{ text: "Network Layer (Layer 3)", isCorrect: true },
							{ text: "Transport Layer (Layer 4)", isCorrect: false },
							{ text: "Data Link Layer (Layer 2)", isCorrect: false },
							{ text: "Physical Layer (Layer 1)", isCorrect: false },
						],
					},
					{
						text: "Pengalamatan fisik atau MAC Address bekerja pada layer...",
						reward: 100,
						options: [
							{ text: "Data Link Layer", isCorrect: true },
							{ text: "Network Layer", isCorrect: false },
							{ text: "Physical Layer", isCorrect: false },
							{ text: "Session Layer", isCorrect: false },
						],
					},
					{
						text: "Layer manakah yang bertanggung jawab dalam proses routing paket data?",
						reward: 100,
						options: [
							{ text: "Network Layer", isCorrect: true },
							{ text: "Data Link Layer", isCorrect: false },
							{ text: "Transport Layer", isCorrect: false },
							{ text: "Application Layer", isCorrect: false },
						],
					},
					{
						text: "Proses penambahan header oleh setiap layer OSI sebelum data dikirim disebut...",
						reward: 100,
						options: [
							{ text: "Enkapsulasi", isCorrect: true },
							{ text: "Dekapsulasi", isCorrect: false },
							{ text: "Fragmentasi", isCorrect: false },
							{ text: "Multiplexing", isCorrect: false },
						],
					},
				],
			},
		],
	},
	// ==========================================
	// MODULE 4: IP ADDRESSING & SUBNETTING
	// ==========================================
	{
		title: "IP Addressing & Subnetting",
		sequence: 4,
		lessons: [
			{
				title: "IPv4 dan Kelas IP",
				lessonSequence: 1,
				type: LessonTypeEnum.THEORY,
				xpReward: 80,
				material: {
					content:
						"Alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet, setiap oktet bernilai 0-255. Kelas IP dibagi menjadi: Kelas A (1.0.0.0 - 126.255.255.255) untuk jaringan besar, Kelas B (128.0.0.0 - 191.255.255.255) untuk jaringan menengah, Kelas C (192.0.0.0 - 223.255.255.255) untuk jaringan kecil. Selain itu ada Kelas D untuk multicast dan Kelas E untuk eksperimen. IP publik dapat diakses dari internet, sedangkan IP privat (seperti 192.168.x.x) hanya berlaku di jaringan lokal.",
					mediaUrl:
						"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
				},
			},
			{
				title: "Dasar Subnetting & CIDR",
				lessonSequence: 2,
				type: LessonTypeEnum.THEORY,
				xpReward: 80,
				material: {
					content:
						"Subnetting adalah teknik membagi jaringan besar menjadi sub-jaringan yang lebih kecil untuk efisiensi alokasi IP dan mengurangi lalu lintas broadcast. CIDR (Classless Inter-Domain Routing) menggunakan notasi prefix seperti /24 yang berarti 24 bit pertama adalah network ID. Contoh: 192.168.1.0/24 berarti network ID 192.168.1 dan tersedia 254 host address. Subnet mask juga bisa ditulis sebagai 255.255.255.0 untuk /24. Teknik ini memungkinkan pengelolaan alamat IP yang lebih fleksibel.",
					mediaUrl:
						"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
				},
			},
			{
				title: "Kuis IP & Subnetting",
				lessonSequence: 3,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Alamat IP 192.168.1.1 termasuk dalam kelas...",
						reward: 50,
						options: [
							{ text: "Kelas C", isCorrect: true },
							{ text: "Kelas A", isCorrect: false },
							{ text: "Kelas B", isCorrect: false },
							{ text: "Kelas D", isCorrect: false },
						],
					},
					{
						text: "Subnet mask 255.255.255.0 setara dengan notasi CIDR...",
						reward: 50,
						options: [
							{ text: "/24", isCorrect: true },
							{ text: "/16", isCorrect: false },
							{ text: "/8", isCorrect: false },
							{ text: "/32", isCorrect: false },
						],
					},
					{
						text: "IP address 10.0.0.1 termasuk dalam rentang IP...",
						reward: 50,
						options: [
							{ text: "Kelas A", isCorrect: true },
							{ text: "Kelas B", isCorrect: false },
							{ text: "Kelas C", isCorrect: false },
							{ text: "Kelas E", isCorrect: false },
						],
					},
					{
						text: "Berapa jumlah maksimal host yang dapat ditampung dalam jaringan dengan subnet mask /24?",
						reward: 50,
						options: [
							{ text: "254", isCorrect: true },
							{ text: "256", isCorrect: false },
							{ text: "255", isCorrect: false },
							{ text: "512", isCorrect: false },
						],
					},
				],
			},
		],
	},
];

// ==========================================
// USER DEFINITIONS (8 Users)
// ==========================================
interface StudentInfo {
	nim: string;
	name: string;
	xp: number;
	hearts: number;
	completedCount: number;
	bestScores: number[]; // bestScore untuk setiap lesson yang completed (urutan sesuai completion)
}

const STUDENTS: StudentInfo[] = [
	{
		nim: "A710220001",
		name: "Andi Pratama",
		xp: 2500,
		hearts: 4,
		completedCount: 10,
		bestScores: [100, 90, 85, 100, 70, 80, 75, 85, 90, 80],
	},
	{
		nim: "A710220002",
		name: "Budi Santoso",
		xp: 850,
		hearts: 3,
		completedCount: 6,
		bestScores: [80, 70, 60, 90, 75, 85],
	},
	{
		nim: "A710220003",
		name: "Citra Dewi",
		xp: 150,
		hearts: 3,
		completedCount: 2,
		bestScores: [90, 80],
	},
	{
		nim: "A710220004",
		name: "Dewi Lestari",
		xp: 0,
		hearts: 3,
		completedCount: 0,
		bestScores: [],
	},
	{
		nim: "A710220005",
		name: "Eko Saputra",
		xp: 200,
		hearts: 0,
		completedCount: 3,
		bestScores: [60, 50, 70],
	},
	{
		nim: "A710220006",
		name: "Fajar Ramadhan",
		xp: 5000,
		hearts: 5,
		completedCount: 12, // completed semua
		bestScores: [100, 95, 100, 90, 100, 95, 100, 90, 100, 95, 100, 90],
	},
	{
		nim: "A710220007",
		name: "Gina Amalia",
		xp: 400,
		hearts: 2,
		completedCount: 5,
		bestScores: [40, 100, 60, 80, 55],
	},
];

// ==========================================
// MAIN SEEDING LOGIC
// ==========================================
async function main() {
	console.log("Memulai proses seeding... 🌱");

	// Bersihkan DB berurutan dari child ke parent
	console.log("Membersihkan data lama... 🧹");
	await prisma.userProgress.deleteMany();
	await prisma.option.deleteMany();
	await prisma.question.deleteMany();
	await prisma.material.deleteMany();
	await prisma.lesson.deleteMany();
	await prisma.module.deleteMany();
	await prisma.user.deleteMany();

	const hashedPassword = await bcrypt.hash("12345678", 10);

	// 1. SEED USERS
	console.log("Membuat entitas pengguna... 👥");
	const admin = await prisma.user.create({
		data: {
			nim: "A710220052",
			name: "Super Admin",
			password: hashedPassword,
			role: RoleEnum.ADMIN,
			xp: 9999,
			hearts: 5,
		},
	});

	const studentRecords = await Promise.all(
		STUDENTS.map((s) =>
			prisma.user.create({
				data: {
					nim: s.nim,
					name: s.name,
					password: hashedPassword,
					role: RoleEnum.MAHASISWA,
					xp: s.xp,
					hearts: s.hearts,
				},
			})
		)
	);

	console.log(`  ✓ ${1 + studentRecords.length} pengguna berhasil dibuat`);

	// 2. SEED SYLLABUS
	console.log("Membangun silabus pembelajaran... 📚");
	const lessonIds: string[] = []; // Semua lesson ID berurutan

	for (const mod of SYLLABUS) {
		const createdModule = await prisma.module.create({
			data: { title: mod.title, sequence: mod.sequence },
		});

		for (const lesson of mod.lessons) {
			const createdLesson = await prisma.lesson.create({
				data: {
					moduleId: createdModule.id,
					title: lesson.title,
					lessonSequence: lesson.lessonSequence,
					type: lesson.type,
					xpReward: lesson.xpReward,
				},
			});

			lessonIds.push(createdLesson.id);

			if (lesson.type === LessonTypeEnum.THEORY && lesson.material) {
				await prisma.material.create({
					data: {
						lessonId: createdLesson.id,
						content: lesson.material.content,
						mediaUrl: lesson.material.mediaUrl,
					},
				});
			}

			if (lesson.type === LessonTypeEnum.QUIZ && lesson.questions) {
				for (const q of lesson.questions) {
					const createdQuestion = await prisma.question.create({
						data: {
							lessonId: createdLesson.id,
							questionText: q.text,
							xpReward: q.reward,
						},
					});

					await prisma.option.createMany({
						data: q.options.map((opt) => ({
							questionId: createdQuestion.id,
							optionText: opt.text,
							isCorrect: opt.isCorrect,
						})),
					});
				}
			}
		}
	}

	console.log(`  ✓ ${SYLLABUS.length} modul dengan ${lessonIds.length} lesson berhasil dibuat`);

	// 3. SEED USER PROGRESS
	console.log("Mensimulasikan progres mahasiswa... 📈");

	const TOTAL_LESSONS = lessonIds.length;

	for (let i = 0; i < studentRecords.length; i++) {
		const student = studentRecords[i];
		const info = STUDENTS[i];
		const { completedCount, bestScores } = info;

		// --- COMPLETED lessons ---
		for (let j = 0; j < completedCount; j++) {
			await prisma.userProgress.create({
				data: {
					userId: student.id,
					lessonId: lessonIds[j],
					status: ProgressStatusEnum.COMPLETED,
					bestScore: bestScores[j] ?? 100,
				},
			});
		}

		// --- ACTIVE lesson (lesson berikutnya jika belum completed semua) ---
		if (completedCount < TOTAL_LESSONS) {
			await prisma.userProgress.create({
				data: {
					userId: student.id,
					lessonId: lessonIds[completedCount],
					status: ProgressStatusEnum.ACTIVE,
					bestScore: 0,
				},
			});
		}

		console.log(
			`  ✓ ${info.name}: ${completedCount} completed, ${completedCount < TOTAL_LESSONS ? "1 active" : "all completed"}`
		);
	}

	console.log("Seeding selesai dengan sukses! 🌳");
}

main()
	.catch((e) => {
		console.error("Terjadi kesalahan saat seeding:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});