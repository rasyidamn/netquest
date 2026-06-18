import { useAuthStore } from "@/stores/auth.store";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const queryClient = new QueryClient({
	// 1. Tangani error secara global untuk semua useQuery (Operasi GET)
   queryCache: new QueryCache({
      onError: (error: any) => {
         // Intersepsi khusus untuk token kedaluwarsa (401)
         if (error.message.includes("401") || error.message.includes("Token tidak valid")) {
            useAuthStore.getState().logout(); // Memaksa logout dari luar komponen React
            toast.error("Sesi Anda telah habis. Silakan login kembali.");
            return;
         }
      },
   }),

   

   // 3. Konfigurasi bawaan Anda tetap dipertahankan
   defaultOptions: {
      queries: {
         staleTime: 1000 * 60 * 5,
         retry: 1,
      },
   },
});
