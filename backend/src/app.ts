import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.routes.js";
import { setupSwagger } from "./configs/swagger.config.js";
import { prisma } from "./configs/database.config.js";
import logger from "./utils/logger.util.js";
import { configureCloudinary } from "./configs/cloudinary.config.js";

export const app = express();
const port = process.env["PORT"] || 5000;
configureCloudinary();

app.use(
	cors({
		origin: process.env["CLIENT_URL"],
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(requestLogger);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
	res.json({ message: "Selamat datang di API NetQuest" });
});

setupSwagger(app);
app.use("/api", apiRouter);

app.use(errorMiddleware);

// Hanya jalankan app.listen jika TIDAK di lingkungan Vercel (Serverless)
// Vercel menggunakan export default app untuk mengalirkan traffic.
if (process.env.VERCEL !== "1") {
	const start_server = async () => {
		try {
			await prisma.$connect;
			logger.info("Database berhasil terhubung");

			app.listen(port, () => {
				logger.info(`Berhasil menjalankan server di port ${port}`);
			});
		} catch (error) {
			logger.error("❌ Gagal menyalakan server:", error);
			process.exit(1);
		}
	};

	start_server();
}

export default app;
