import { businessRouter } from "~/server/api/routers/business";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { accessoriesRouter } from "./routers/accessories";
import { eventsRouter } from "./routers/events";
import { paymentRouter } from "./routers/payment";
import { rentalRouter } from "./routers/rental";
import { userRouter } from "./routers/users";
import { vehicleRouter } from "./routers/vehicle";

export const appRouter = createTRPCRouter({
  user: userRouter,
  business: businessRouter,
  vehicle: vehicleRouter,
  rental: rentalRouter,
  events: eventsRouter,
  payment: paymentRouter,
  accessories: accessoriesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
