// prisma/seed.ts
import { prisma } from "../src/configs/database.config.js";
import bcrypt from "bcrypt";
import {
	RoleEnum,
	LessonTypeEnum,
	ProgressStatusEnum,
	QuestionType,
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
					content: "Jaringan komputer adalah dua atau lebih perangkat komputer yang saling terhubung menggunakan media kabel maupun nirkabel untuk membagikan data, informasi, dan sumber daya lainnya...",
					mediaUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
				},
				questions: [
					{
						text: "Pop-Quiz: Apa tujuan utama dari jaringan komputer?",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 20,
						options: [
							{ text: "Membagikan data dan sumber daya", isCorrect: true },
							{ text: "Mempercepat CPU", isCorrect: false },
							{ text: "Membuat dokumen teks", isCorrect: false },
							{ text: "Mengurangi tagihan listrik", isCorrect: false },
						]
					}
				],
			},
			{
				title: "Jenis Jaringan (LAN, MAN, WAN)",
				lessonSequence: 2,
				type: LessonTypeEnum.THEORY,
				xpReward: 50,
				material: {
					content: "Berdasarkan jangkauan geografisnya, jaringan dibagi menjadi tiga jenis utama. LAN (Local Area Network)...",
					mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
				},
				questions: [
					{
						text: "Pop-Quiz: Jaringan yang mencakup area satu gedung atau ruangan disebut?",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 20,
						options: [
							{ text: "LAN", isCorrect: true },
							{ text: "MAN", isCorrect: false },
							{ text: "WAN", isCorrect: false },
							{ text: "PAN", isCorrect: false },
						]
					}
				],
			},
			{
				title: "Kuis Dasar Jaringan",
				lessonSequence: 3,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Perangkat yang berfungsi menghubungkan dua atau lebih jaringan yang berbeda segmen/subnet adalah...",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 50,
						options: [
							{ text: "Router", isCorrect: true },
							{ text: "Switch", isCorrect: false },
							{ text: "Hub", isCorrect: false },
							{ text: "Repeater", isCorrect: false },
						],
					},
					{
						text: "Ketik perintah ping ke alamat 192.168.1.1 untuk mengecek koneksi jaringan.",
						type: QuestionType.COMMAND_TYPING,
						reward: 100,
						options: [
							{ text: "ping 192.168.1.1", isCorrect: true },
						]
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
					content: "Topologi jaringan adalah desain fisik dan logis yang mendefinisikan bagaimana perangkat saling terhubung...",
					mediaUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
				},
				questions: [
					{
						text: "Pop-Quiz: Topologi yang menggunakan satu titik pusat (hub/switch) disebut?",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 20,
						options: [
							{ text: "Topologi Star", isCorrect: true },
							{ text: "Topologi Bus", isCorrect: false },
							{ text: "Topologi Ring", isCorrect: false },
							{ text: "Topologi Mesh", isCorrect: false },
						]
					}
				],
			},
			{
				title: "Kuis Topologi",
				lessonSequence: 2,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Topologi jaringan yang menggunakan satu kabel pusat sebagai tulang punggung (backbone) adalah...",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 50,
						options: [
							{ text: "Bus", isCorrect: true },
							{ text: "Star", isCorrect: false },
							{ text: "Ring", isCorrect: false },
							{ text: "Mesh", isCorrect: false },
						],
					},
					{
						text: "![Topologi Star](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800)\nPerhatikan gambar topologi di atas. Tarik label ke area yang tepat untuk mengidentifikasi komponennya.",
						type: QuestionType.IMAGE_LABELING,
						reward: 150,
						advancedOptions: ["Switch / Hub Pusat", "Kabel UTP", "PC Client"],
						answerPattern: [0, 1, 2] // The correct sorting for zone 1, 2, 3
					},
					{
						text: "Rangkailah sebuah jaringan peer-to-peer sederhana dengan menghubungkan dua PC menggunakan kabel Cross-Over.",
						type: QuestionType.TOPOLOGY,
						reward: 200,
						advancedOptions: JSON.stringify([
							{ id: "node_0", type: "networkDevice", position: { x: 100, y: 100 }, data: { label: "PC 1", deviceType: "pc" } },
							{ id: "node_1", type: "networkDevice", position: { x: 300, y: 100 }, data: { label: "PC 2", deviceType: "pc" } }
						]),
						answerPattern: ["node_0-node_1"] // or whatever id format our topology builder uses. The frontend edge source-target
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
					content: "Model OSI (Open Systems Interconnection) memiliki 7 layer yang bekerja secara berurutan...",
					mediaUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
				},
				questions: [
					{
						text: "Pop-Quiz: Ada berapa jumlah layer pada model OSI?",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 20,
						options: [
							{ text: "7 Layer", isCorrect: true },
							{ text: "4 Layer", isCorrect: false },
							{ text: "5 Layer", isCorrect: false },
							{ text: "9 Layer", isCorrect: false },
						]
					}
				],
			},
			{
				title: "Ujian OSI Layer",
				lessonSequence: 2,
				type: LessonTypeEnum.QUIZ,
				xpReward: 200,
				questions: [
					{
						text: "Urutkan lapisan OSI dari layer 1 (terbawah) hingga layer 3.",
						type: QuestionType.SORTING,
						reward: 100,
						advancedOptions: [
							"Physical Layer",
							"Network Layer",
							"Data Link Layer"
						],
						answerPattern: [0, 2, 1] // The exact order indices of the items above
					},
					{
						text: "Proses penambahan header oleh setiap layer OSI sebelum data dikirim disebut...",
						type: QuestionType.MULTIPLE_CHOICE,
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
					content: "Alamat IPv4 terdiri dari 32 bit yang dibagi menjadi 4 oktet...",
					mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
				},
				questions: [
					{
						text: "Pop-Quiz: Berapa jumlah bit pada satu alamat IPv4?",
						type: QuestionType.MULTIPLE_CHOICE,
						reward: 20,
						options: [
							{ text: "32 bit", isCorrect: true },
							{ text: "16 bit", isCorrect: false },
							{ text: "64 bit", isCorrect: false },
							{ text: "128 bit", isCorrect: false },
						]
					}
				],
			},
			{
				title: "Kuis IP & Subnetting",
				lessonSequence: 2,
				type: LessonTypeEnum.QUIZ,
				xpReward: 150,
				questions: [
					{
						text: "Cocokkan rentang IP Address berikut dengan Kelasnya.",
						type: QuestionType.MATCHING,
						reward: 150,
						advancedOptions: [
							"192.168.1.1", // index 0 (Left 1)
							"10.0.0.1",    // index 1 (Left 2)
							"Kelas A",     // index 2 (Right 1)
							"Kelas C",     // index 3 (Right 2)
						],
						answerPattern: [[0, 3], [1, 2]] // Left item 0 matches right item 3, Left 1 matches right 2
					},
					{
						text: "Berapa jumlah maksimal host yang dapat ditampung dalam jaringan dengan subnet mask /24?",
						type: QuestionType.CALCULATION_INPUT,
						reward: 50,
						options: [
							{ text: "254", isCorrect: true }
						]
					},
				],
			},
		],
	},
];

interface StudentInfo {
	nim: string;
	name: string;
	xp: number;
	hearts: number;
	completedCount: number;
	bestScores: number[]; 
}

const STUDENTS: StudentInfo[] = [
	{ nim: "A710220001", name: "Andi Pratama", xp: 3400, hearts: 3, completedCount: 5, bestScores: [100, 90, 85, 100, 70] }, // L6
	{ nim: "A710220002", name: "Budi Santoso", xp: 1200, hearts: 3, completedCount: 4, bestScores: [90, 85, 80, 100] }, // L4
	{ nim: "A710220003", name: "Citra Lestari", xp: 5600, hearts: 3, completedCount: 6, bestScores: [100, 100, 95, 90, 85, 100] }, // L8
	{ nim: "A710220004", name: "Dian Novita", xp: 150, hearts: 3, completedCount: 2, bestScores: [80, 75] }, // L2
	{ nim: "A710220005", name: "Eko Prasetyo", xp: 8500, hearts: 3, completedCount: 5, bestScores: [100, 95, 85, 90, 100] }, // L10
	{ nim: "A710220006", name: "Fajar Ramadhan", xp: 600, hearts: 3, completedCount: 3, bestScores: [85, 80, 90] }, // L3
	{ nim: "A710220007", name: "Gita Savitri", xp: 4500, hearts: 3, completedCount: 7, bestScores: [100, 100, 100, 95, 90, 85, 100] }, // L7
	{ nim: "A710220008", name: "Hadi Kusuma", xp: 2100, hearts: 3, completedCount: 2, bestScores: [70, 75] }, // L5
	{ nim: "A710220009", name: "Indah Permata", xp: 7200, hearts: 3, completedCount: 6, bestScores: [95, 100, 85, 90, 100, 90] }, // L9
	{ nim: "A710220010", name: "Joko Widodo", xp: 3800, hearts: 3, completedCount: 4, bestScores: [80, 85, 90, 100] }, // L7
	{ nim: "A710220011", name: "Kiki Amalia", xp: 1900, hearts: 3, completedCount: 5, bestScores: [100, 80, 85, 90, 95] }, // L5
	{ nim: "A710220012", name: "Lina Marlina", xp: 500, hearts: 3, completedCount: 3, bestScores: [75, 80, 85] }, // L3
	{ nim: "A710220013", name: "Muhammad Rizki", xp: 2900, hearts: 3, completedCount: 6, bestScores: [100, 90, 95, 100, 85, 90] }, // L6
	{ nim: "A710220014", name: "Nina Wati", xp: 1400, hearts: 3, completedCount: 4, bestScores: [85, 90, 100, 80] }, // L4
	{ nim: "A710220015", name: "Oka Antara", xp: 4200, hearts: 3, completedCount: 5, bestScores: [90, 85, 100, 95, 80] }, // L7
	{ nim: "A710220016", name: "Putri Ayu", xp: 6800, hearts: 3, completedCount: 7, bestScores: [100, 100, 95, 100, 90, 100, 100] }, // L9
	{ nim: "A710220017", name: "Qori Sandi", xp: 300, hearts: 3, completedCount: 2, bestScores: [80, 85] }, // L2
	{ nim: "A710220018", name: "Rendi Pangalila", xp: 2600, hearts: 3, completedCount: 3, bestScores: [90, 75, 80] }, // L6
	{ nim: "A710220019", name: "Siska Saraswati", xp: 1000, hearts: 3, completedCount: 5, bestScores: [100, 80, 90, 85, 95] }, // L4
	{ nim: "A710220020", name: "Toni Sucipto", xp: 1700, hearts: 3, completedCount: 4, bestScores: [85, 90, 80, 100] }, // L5
	{ nim: "A710220021", name: "Umar Syarief", xp: 5100, hearts: 3, completedCount: 6, bestScores: [95, 100, 90, 85, 100, 90] }, // L8
	{ nim: "A710220022", name: "Vina Panduwinata", xp: 800, hearts: 3, completedCount: 3, bestScores: [80, 85, 90] }, // L3
	{ nim: "A710220023", name: "Wawan Kurniawan", xp: 3100, hearts: 3, completedCount: 5, bestScores: [90, 95, 80, 100, 85] }, // L6
	{ nim: "A710220024", name: "Xena Larasati", xp: 2300, hearts: 3, completedCount: 7, bestScores: [100, 95, 100, 90, 100, 85, 100] }, // L5
	{ nim: "A710220025", name: "Yudi Ardiansyah", xp: 50, hearts: 3, completedCount: 2, bestScores: [75, 70] }, // L1
];

async function main() {
	console.log("Memulai proses seeding... 🌱");

	await prisma.userProgress.deleteMany();
	await prisma.option.deleteMany();
	await prisma.question.deleteMany();
	await prisma.material.deleteMany();
	await prisma.lesson.deleteMany();
	await prisma.module.deleteMany();
	await prisma.user.deleteMany();

	const hashedPassword = await bcrypt.hash("12345678", 10);

	console.log("Membuat entitas pengguna... 👥");
	await prisma.user.create({
		data: {
			nim: "A710220052",
			name: "Super Admin",
			password: hashedPassword,
			role: RoleEnum.ADMIN,
			xp: 9999,
			hearts: 3,
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

	console.log("Membangun silabus pembelajaran... 📚");
	const lessonIds: string[] = []; 

	for (const mod of SYLLABUS) {
		const createdModule = await prisma.module.create({
			data: { title: mod.title, sequence: mod.sequence, isPublished: true },
		});

		for (const lesson of mod.lessons) {
			const createdLesson = await prisma.lesson.create({
				data: {
					moduleId: createdModule.id,
					title: lesson.title,
					lessonSequence: lesson.lessonSequence,
					type: lesson.type,
					xpReward: lesson.xpReward,
					isPublished: true,
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

			if (lesson.questions && lesson.questions.length > 0) {
				for (const q of lesson.questions) {
					const createdQuestion = await prisma.question.create({
						data: {
							lessonId: createdLesson.id,
							questionText: q.text,
							xpReward: q.reward,
							type: q.type,
						},
					});

					if (q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.COMMAND_TYPING || q.type === QuestionType.CALCULATION_INPUT) {
						if (q.options) {
							await prisma.option.createMany({
								data: q.options.map((opt) => ({
									questionId: createdQuestion.id,
									optionText: opt.text,
									isCorrect: opt.isCorrect,
								})),
							});
						}
					} else if (q.type === QuestionType.SORTING || q.type === QuestionType.MATCHING || q.type === QuestionType.IMAGE_LABELING || q.type === QuestionType.TOPOLOGY) {
						if (q.advancedOptions && q.answerPattern) {
							if (q.type === QuestionType.TOPOLOGY) {
								// Simpan nodes di satu opsi dummy agar tidak membebani baris option
								await prisma.option.create({
									data: {
										questionId: createdQuestion.id,
										optionText: typeof q.advancedOptions === 'string' ? q.advancedOptions : JSON.stringify(q.advancedOptions),
										isCorrect: false, // Disimpan sebagai nodes
									}
								});

								await prisma.option.create({
									data: {
										questionId: createdQuestion.id,
										optionText: JSON.stringify(q.answerPattern),
										isCorrect: true, // Kunci Jawaban (Edges)
									}
								});
							} else {
								const createdOptions = [];
								for (const text of q.advancedOptions) {
									const opt = await prisma.option.create({
										data: {
											questionId: createdQuestion.id,
											optionText: text,
											isCorrect: false,
										}
									});
									createdOptions.push(opt);
								}

								let expectedArray: unknown[] = [];
								if (q.type === QuestionType.SORTING || q.type === QuestionType.IMAGE_LABELING) {
									const pattern = q.answerPattern as number[];
									expectedArray = pattern.map(idx => createdOptions[idx].id);
								} else if (q.type === QuestionType.MATCHING) {
									const pattern = q.answerPattern as number[][];
									expectedArray = pattern.map(pair => [
										createdOptions[pair[0]].id,
										createdOptions[pair[1]].id
									]);
								}

								// 3. Simpan jawaban benar sebagai opsi dengan JSON string
								await prisma.option.create({
									data: {
										questionId: createdQuestion.id,
										optionText: JSON.stringify(expectedArray),
										isCorrect: true, // Kunci Jawaban
									}
								});
							}
						}
					}
				}
			}
		}
	}

	console.log(`  ✓ Berhasil menyemai kuis tingkat lanjut`);

	for (let i = 0; i < studentRecords.length; i++) {
		const student = studentRecords[i];
		const info = STUDENTS[i];
		const { completedCount, bestScores } = info;
		const TOTAL_LESSONS = lessonIds.length;

		for (let j = 0; j < Math.min(completedCount, TOTAL_LESSONS); j++) {
			await prisma.userProgress.create({
				data: {
					userId: student.id,
					lessonId: lessonIds[j],
					status: ProgressStatusEnum.COMPLETED,
					bestScore: bestScores[j] ?? 100,
				},
			});
		}

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