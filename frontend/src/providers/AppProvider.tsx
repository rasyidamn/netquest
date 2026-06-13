import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./QueryProvider";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import ThemeProvider from "./ThemeProvider";
import { routeTree } from "@/routeTree.gen";

const router = createRouter({
	routeTree: routeTree,
});

function AppProvider() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<RouterProvider router={router} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default AppProvider;
