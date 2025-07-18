import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { env } from "~/env";
import { db } from "~/server/db";
import {
  accounts,
  affiliateStats,
  businesses,
  referrals,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { type userRoleEnum } from "./server.types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: userRoleEnum;
      email: string;
      name?: string | null;
      image?: string | null;
      phoneNumber?: string | null;
      vendor_setup_complete: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: userRoleEnum;
    email: string;
    name: string;
    phoneNumber: string | undefined;
    vendor_setup_complete: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,

  session: {
    strategy: "jwt",
  },

  secret: env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user, trigger, session: newData }) {
      token.id = token.sub;

      if (trigger === "signUp" && user) {
        const roleCookie = (await cookies()).get("role")?.value;
        const referralId = (await cookies()).get("ref")?.value;

        console.log({ referralId });

        if (referralId) {
          // referralId is the referrer (existing user), user.id is the new user
          await db.transaction(async (ctx) => {
            // 1. Insert referral record
            await ctx.insert(referrals).values({
              referrerUserId: referralId,
              referredUserId: user.id,
              rewardType: user.role === "USER" ? "points" : "free_rental",
              rewardValue: user.role === "USER" ? 50 : 1, // 1 = one free rental
            });

            // 2. Update or create affiliateStats for referrer
            const referrerStats = await ctx.query.affiliateStats.findFirst({
              where: eq(affiliateStats.userId, referralId),
            });
            if (referrerStats) {
              await ctx
                .update(affiliateStats)
                .set({
                  totalReferrals: referrerStats.totalReferrals + 1,
                  totalPoints:
                    referrerStats.totalPoints + (user.role === "USER" ? 50 : 0),
                  totalFreeRentals:
                    referrerStats.totalFreeRentals +
                    (user.role === "USER" ? 0 : 1),
                  updatedAt: new Date(),
                })
                .where(eq(affiliateStats.userId, referralId));
            } else {
              await ctx.insert(affiliateStats).values({
                userId: referralId,
                totalReferrals: 1,
                totalPoints: user.role === "USER" ? 50 : 0,
                totalFreeRentals: user.role === "USER" ? 0 : 1,
                updatedAt: new Date(),
              });
            }

            // for the new user too.
            const referredStats = await ctx.query.affiliateStats.findFirst({
              where: eq(affiliateStats.userId, user.id),
            });

            if (referredStats) {
              await ctx
                .update(affiliateStats)
                .set({
                  totalPoints: referredStats.totalPoints + 50,
                  updatedAt: new Date(),
                })
                .where(eq(affiliateStats.userId, user.id));
            } else {
              await ctx.insert(affiliateStats).values({
                userId: user.id,
                totalReferrals: 0,
                totalPoints: 50,
                totalFreeRentals: 0,
                updatedAt: new Date(),
              });
            }
          });
        }

        if (roleCookie) {
          token.role = roleCookie;
          token.vendor_setup_complete = false;

          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, user.email),
          });

          if (existingUser) {
            await db
              .update(users)
              .set({ email: user.email, role: roleCookie as userRoleEnum })
              .where(eq(users.id, existingUser.id));
            if (roleCookie === "VENDOR") {
              await db.insert(businesses).values({ ownerId: existingUser.id });
            }
          }

          (await cookies()).set("role", "", { maxAge: -1, path: "/" });
        }
      }

      token.image = token.image ?? token.picture;
      if (trigger === "update") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        token.name = newData.user.name;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        token.image = newData.user.image;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        token.vendor_setup_complete = newData.user.vendor_setup_complete;
      }

      token.role = token.role ?? user?.role ?? "USER";
      token.vendor_setup_complete =
        token.vendor_setup_complete ?? user?.vendor_setup_complete ?? false;

      const { picture, ...rest } = token;

      return rest; // returns token without picture from the token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          image: (token.image as string | undefined) ?? session.user.image,
          email: token.email,
          vendor_setup_complete: token.vendor_setup_complete,
          role: token.role,
        },
      };
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
