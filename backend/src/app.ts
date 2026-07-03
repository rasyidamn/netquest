import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.routes.js";
import { setupSwagger } from "./configs/swagger.config.js";

const app = express();

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

setupSwagger(app);
app.use("/api", apiRouter);

app.use(errorMiddleware);

export default app;
