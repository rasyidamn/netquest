import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { authApi } from "@/api/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const { logout: clearAuthStore, setLoggingOut } = useAuthStore();

   return useMutation({
      mutationFn: async () => {
         setLoggingOut(true);
         // Delay 800ms agar skeleton curtain sempat terlihat
         await new Promise((r) => setTimeout(r, 800));
         await authApi.logout();
      },
      onMutate: () => {
         const toastId = toast.loading("Menutup sesi...");
         return { toastId };
      },
      onSuccess: async (_data, _variables, context) => {
         await router.navigate({ to: "/auth/login", replace: true });
         queryClient.clear();
         clearAuthStore();
         toast.success("Berhasil logout", { id: context?.toastId });
      },
      onError: async (_error, _variables, context) => {
         await router.navigate({ to: "/auth/login", replace: true });
         queryClient.clear();
         clearAuthStore();
         toast.error("Sesi berakhir", { id: context?.toastId });
      },
   });
}
