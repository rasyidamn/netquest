import { RouterProvider } from "@tanstack/react-router";
import { QueryProvider } from "./core/providers/QueryProvider";
import { ThemeProvider } from "./core/providers/ThemeProvider";

import { Toaster } from "react-hot-toast";
import { router } from "./router";

export const AppProvider = () => {
	return (
		<QueryProvider>
			<ThemeProvider>
				<RouterProvider router={router} />
				<Toaster position="top-center" />
			</ThemeProvider>
		</QueryProvider>
	);
};
