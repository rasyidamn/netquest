// prisma/seed.ts
import { prisma } from "../src/configs/database.config.js";
import bcrypt from "bcrypt";
import { RoleEnum } from "../src/generated/prisma/enums.js"; // Sesuaikan path jika berbeda

async function main() {
	console.log("Memulai proses seeding... 🌱");

	// 1. Buat Akun Admin Default
	const hashedPassword = await bcrypt.hash("12345678", 10);

	// Gunakan upsert agar jika skrip dijalankan 2x, admin tidak terduplikasi
	const adminUser = await prisma.user.upsert({
		where: { nim: "ADMIN001" },
		update: {}, // Jika sudah ada, jangan lakukan apa-apa
		create: {
			nim: "ADMIN001",
			name: "Super Admin",
			password: hashedPassword,
			role: RoleEnum.ADMIN, // Memakai RoleEnum
			xp: 9999,
			level: 99,
			hearts: 99,
		},
	});
	console.log(`✅ Admin berhasil dibuat: ${adminUser.name}`);

	// 2. Buat Beberapa Modul Awal
	const module1 = await prisma.module.create({
		data: {
			title: "Pengenalan Jaringan Komputer Dasar",
			sequence: 1,
		},
	});

	const module2 = await prisma.module.create({
		data: {
			title: "Topologi Jaringan",
			sequence: 2,
		},
	});
	console.log(`✅ Modul awal berhasil dibuat!`);

	console.log("Seeding selesai! 🌳");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// Wajib: Putuskan koneksi Prisma setelah selesai
		await prisma.$disconnect();
	});
