import { eventSlides } from "~/lib/data";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventsRouter = createTRPCRouter({
  getUpcomingEvents: publicProcedure.query(() => {
    return eventSlides;
  }),
});
