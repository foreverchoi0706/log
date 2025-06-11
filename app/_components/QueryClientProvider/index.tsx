"use client";

import {
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import "@ant-design/v5-patch-for-react-19";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

export default function QueryClientProvider({ children }: PropsWithChildren) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	);
}
