import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import logger from "../utils/logger.util.js";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({
	adapter,
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "warn",
		},
		{
			emit: "event",
			level: "info",
		},
	],
});

prisma.$on("error", (e) => {
	logger.error(e);
});
prisma.$on("warn", (e) => {
	logger.warn(e);
});
prisma.$on("info", (e) => {
	logger.info(e);
});
prisma.$on("query", (e) => {
	logger.info(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
});

export { prisma };
