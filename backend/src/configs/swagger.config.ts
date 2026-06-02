// src/configs/swagger.config.ts
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi.registry.js";

export const setupSwagger = (app: Express) => {
   // 1. Gabungkan metadata dasar dengan registry
   const generator = new OpenApiGeneratorV3(registry.definitions);
   
   const swaggerDocument = generator.generateDocument({
      openapi: "3.0.0",
      info: {
         title: "Gamification API",
         version: "1.0.0",
         description: "Dokumentasi API untuk media pembelajaran jaringan komputer.",
      },
      servers: [
         {
            url: "http://localhost:3000",
            description: "Development Server",
         },
      ],
   });

   // 2. Tampilkan di rute /api-docs
   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};