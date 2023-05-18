import { createTRPCRouter } from "@app/server/api/trpc";
import { userRouter } from "@app/server/api/routers/user";
import { contractRouter } from "./routers/contract";
import { complaint_router } from "@app/server/api/routers/complaint";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  contract: contractRouter,
  complaint: complaint_router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
