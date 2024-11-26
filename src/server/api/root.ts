import { businessRouter } from "~/server/api/routers/business";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { rentalRouter } from "./routers/rental";
import { userRouter } from "./routers/users";
import { vehicleRouter } from "./routers/vehicle";

export const appRouter = createTRPCRouter({
  user: userRouter,
  business: businessRouter,
  vehicle: vehicleRouter,
  rental: rentalRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
