import type { MyRouterContext } from "@/routes/__root";
import { redirect } from "@tanstack/react-router";

// 1. Guard untuk halaman Publik/Guest (seperti Login/Register)
export const requireGuest = ({ context }: { context: MyRouterContext }) => {
   const store = context.auth.getState();
   
   // Jika sudah login, lempar ke area masing-masing sesuai role
   if (store.isAuthenticated) {
      if (store.role === "ADMIN") {
         throw redirect({ to: "/admin" });
      }
      // Default untuk MAHASISWA
      throw redirect({ to: "/dashboard" });
   }
};

// 2. Guard Dasar untuk memastikan pengguna sudah login
export const requireAuth = ({ context }: { context: MyRouterContext }) => {
   const store = context.auth.getState();
   
   if (!store.isAuthenticated) {
      throw redirect({ to: "/auth/login" }); // Sesuaikan dengan path halaman login Anda
   }
};

// 3. Guard Khusus Mahasiswa
export const requireStudent = ({ context }: { context: MyRouterContext }) => {
   const store = context.auth.getState();
   
   // Pastikan login dulu
   if (!store.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
   }
   
   // Jika ternyata dia Admin, usir ke dashboard Admin
   if (store.role === "ADMIN") {
      throw redirect({ to: "/admin" });
   }
};

// 4. Guard Khusus Admin
export const requireAdmin = ({ context }: { context: MyRouterContext }) => {
   const store = context.auth.getState();
   
   // Pastikan login dulu
   if (!store.isAuthenticated) {
      throw redirect({ to: "/auth/login" });
   }
   
   // Jika role-nya bukan Admin (misal: MAHASISWA), usir ke dashboard Mahasiswa
   if (store.role !== "ADMIN") {
      throw redirect({ to: "/dashboard" });
   }
};