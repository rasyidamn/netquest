import "dotenv/config";
import { prisma } from "./configs/database.config.js";
import logger from "./utils/logger.util.js";
import { configureCloudinary } from "./configs/cloudinary.config.js";
import { app } from "./app.js";

const port = process.env["PORT"] || 5000;
configureCloudinary();

const start_server = async () => {
	try {
		await prisma.$connect;

		logger.info("Database berhasil terhubung");

		app.get("/", (req, res) => {
			res.json({ message: "Hello from Express on Vercel!" });
		});

		app.listen(port, () => {
			logger.info(`Berhasil menjalankan server di port ${port}`);
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
