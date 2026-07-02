import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

type QueryProviderProps = {
	children: ReactNode;
};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
			retry: 1,
		},
		mutations: {
			onError: (error) => {
				console.error("Terjadi kesalahan pada mutasi:", error);
			},
		},
	},
});

export const QueryProvider = ({ children }: QueryProviderProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};
