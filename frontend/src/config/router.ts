import type { MyRouterContext } from "@/routes/__root";
import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";

export const router = createRouter({
	routeTree: routeTree,
	context: undefined as unknown as MyRouterContext,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
