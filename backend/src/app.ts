import express from "express";
import { requestLogger } from "./middlewares/request-logger.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.routes.js";
import { setupSwagger } from "./configs/swagger.config.js";

const app = express();
app.use(requestLogger);
app.use(express.json());

setupSwagger(app);
app.use("/api", apiRouter);

app.use(errorMiddleware);

export default app;
