import "dotenv/config";
import { prisma } from "./configs/database.config.js";
import logger from "./utils/logger.util.js";
import { configureCloudinary } from "./configs/cloudinary.config.js";
import app from "./app.js";

const PORT = process.env["PORT"] || 3000;
configureCloudinary();

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

if (process.env.NODE_ENV !== "production") {
	start_server();
}

export default app;
