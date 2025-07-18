import { desc, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { affiliateStats, referrals, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const affiliateRouter = createTRPCRouter({
  isUserEnrolled: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await db.query.affiliateStats.findFirst({
        where: eq(affiliateStats.userId, ctx.session.user.id),
      });
      return !!res;
    } catch (err) {
      console.log({ err });
      return false;
    }
  }),

  enroll: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Check if already enrolled
      const exists = await db.query.affiliateStats.findFirst({
        where: eq(affiliateStats.userId, ctx.session.user.id),
      });
      if (exists) return { success: true, already: true };

      await db.insert(affiliateStats).values({
        userId: ctx.session.user.id,
        totalReferrals: 0,
        totalPoints: 0,
        totalFreeRentals: 0,
      });
      return { success: true, already: false };
    } catch (err) {
      console.log({ err });
      return { success: false, error: "Failed to enroll" };
    }
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    // Get stats for the current user
    const stats = await db.query.affiliateStats.findFirst({
      where: eq(affiliateStats.userId, ctx.session.user.id),
    });
    // Count users and vendors referred
    const referralsList = await db.query.referrals.findMany({
      where: eq(referrals.referrerUserId, ctx.session.user.id),
    });
    let usersCount = 0;
    let vendorsCount = 0;
    for (const ref of referralsList) {
      // Check if referred user is a vendor
      const referred = await db.query.users.findFirst({
        where: eq(users.id, ref.referredUserId),
      });
      if (referred?.role === "VENDOR") vendorsCount++;
      else usersCount++;
    }
    return {
      users: usersCount,
      vendors: vendorsCount,
      points: stats?.totalPoints ?? 0,
      freeRentals: stats?.totalFreeRentals ?? 0,
      totalReferrals: stats?.totalReferrals ?? 0,
    };
  }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    // Get referral history for the current user
    const history = await db.query.referrals.findMany({
      where: eq(referrals.referrerUserId, ctx.session.user.id),
      orderBy: [desc(referrals.createdAt)],
    });
    // Map to frontend format
    const result = await Promise.all(
      history.map(async (ref) => {
        const referred = await db.query.users.findFirst({
          where: eq(users.id, ref.referredUserId),
        });
        return {
          name: referred?.name || "-",
          type: referred?.role === "VENDOR" ? "vendor" : "user",
          date: ref.createdAt.toISOString().slice(0, 10),
          status: ref.rewardValue ? "completed" : "pending",
          reward:
            ref.rewardType === "points"
              ? ref.rewardValue
                ? `+${ref.rewardValue} pts`
                : "-"
              : ref.rewardType === "free_rental"
                ? ref.rewardValue
                  ? `${ref.rewardValue} day free`
                  : "-"
                : "-",
        };
      }),
    );
    return result;
  }),
});
