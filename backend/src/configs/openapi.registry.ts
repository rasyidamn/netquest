// src/configs/openapi.registry.ts

import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "../schemas/user.schema.js";


export const registry = new OpenAPIRegistry();

// 1. Mendaftarkan Skema Autentikasi (JWT)
registry.registerComponent("securitySchemes", "bearerAuth", {
   type: "http",
   scheme: "bearer",
   bearerFormat: "JWT",
});

// 2. Mendaftarkan Skema Model Zod
// registry.register("RegisterRequest", UserSchema.REGISTER_REQUEST);
// registry.register("RegisterResponse", UserSchema.REGISTER_RESPONSE);

// 3. Mendaftarkan Rute / Endpoint
registry.registerPath({
   method: "post",
   path: "/api/auth/register",
   summary: "Mendaftarkan mahasiswa baru",
   tags: ["Auth"],
   request: {
      body: {
         content: {
            "application/json": {
               schema: UserSchema.REGISTER_REQUEST,
            },
         },
      },
   },
   responses: {
      201: {
         description: "Berhasil mendaftar akun",
         content: {
            "application/json": {
               schema: UserSchema.REGISTER_RESPONSE,
            },
         },
      },
      400: { description: "Validasi input gagal" },
   },
});

registry.registerPath({
   method: "post",
   path: "/api/auth/login",
   summary: "Login user",
   tags: ["Auth"],
   request: {
      body: {
         content: {
            "application/json": {
               schema: UserSchema.LOGIN_REQUEST,
            },
         },
      },
   },
   responses: {
      201: {
         description: "Berhasil login!",
         content: {
            "application/json": {
               schema: UserSchema.LOGIN_RESPONSE,
            },
         },
      },
      400: { description: "Validasi input gagal" },
   },
});


// Nanti Anda bisa menambahkan registry.registerPath untuk Login dan Profile di bawah sini