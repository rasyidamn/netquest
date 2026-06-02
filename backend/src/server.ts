import "dotenv/config";
import { prisma } from "./configs/database.config.js";
import logger from "./utils/logger.util.js";
import app from "./app.js";

const PORT = process.env["PORT"] || 3000;

const start_server = async () => {
	try {
		await prisma.$connect;

		logger.info("Database berhasil terhubung");

		app.listen(PORT, () => {
			logger.info("server berjalan");
		});
	} catch (error) {
		logger.error("❌ Gagal menyalakan server:", error);
		process.exit(1); // Matikan proses Node.js jika gagal total
	}
};

start_server();
