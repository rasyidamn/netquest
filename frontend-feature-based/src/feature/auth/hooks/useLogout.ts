import { useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/feature/auth/stores/useAuthStore";
import { authApi } from "@/feature/auth/api/authApi";

export function useLogout() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { logout: clearAuthStore, setLoggingOut } = useAuthStore();

   return useMutation({
      mutationFn: async () => {
         setLoggingOut(true);
         
         // Eksekusi API dan delay UI secara paralel agar lebih efisien
         await Promise.all([
            authApi.logout(),
            new Promise((resolve) => setTimeout(resolve, 800))
         ]);
      },
      onMutate: () => {
         const toastId = toast.loading("Menutup sesi...");
         return { toastId };
      },
      // onSettled dieksekusi terakhir, entah API berhasil (onSuccess) atau gagal (onError)
      onSettled: async (_data, error, _variables, context) => {
         // 1. BERSIHKAN STATE DULU (Mencegah bentrok dengan Router Guard)
         clearAuthStore();
         queryClient.clear();

         // 2. TAMPILKAN TOAST SESUAI STATUS
         if (error) {
            toast.error("Sesi berakhir", { id: context?.toastId });
         } else {
            toast.success("Berhasil logout", { id: context?.toastId });
         }

         // 3. NAVIGASI PALING AKHIR
         // Karena state Zustand sudah bersih, guard requireGuest akan mengizinkan masuk ke /auth/login
         await router.navigate({ to: "/auth/login", replace: true });
         
         // Catatan: setLoggingOut(false) mungkin perlu dipanggil jika komponen tidak di-unmount
         setLoggingOut(false); 
      }
   });
}