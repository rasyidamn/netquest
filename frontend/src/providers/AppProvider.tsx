import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./QueryProvider";
import { RouterProvider } from "@tanstack/react-router";
import ThemeProvider from "./ThemeProvider";

import { Toaster } from "react-hot-toast";
import { router } from "@/config/router";
import { useAuthStore } from "@/stores/auth.store";

function AppProvider() {
	const auth = useAuthStore();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<RouterProvider
					router={router}
					context={{
						queryClient,
						auth: {
							isAuthenticated: auth.isAuthenticated,
							role: auth.role,
						},
					}}
				/>
				<Toaster position="top-center" />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default AppProvider;
