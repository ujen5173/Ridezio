import { TRPCError } from "@trpc/server";
import { z } from "zod";
import transporter from "~/lib/nodemailer";
import { createTRPCRouter, publicProcedure } from "../trpc";

const feedbackRouter = createTRPCRouter({
  requestForOtherCountries: publicProcedure
    .input(
      z.object({
        country: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await transporter.sendMail({
        from: "Ridezio Team",
        to: "Ridezio.company@gmail.com",
        subject: "New Feedback Received - Ridezio",
        html: `  
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #e11d48 0%, #fb7185 100%); padding: 40px 20px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Market Request 🌎</h1>
                </div>

                <!-- Content -->
                <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 24px; font-weight: 600;">Expansion Opportunity Alert</h2>
                    
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        We've received a new request to bring Ridezio to <strong style="color: ##fb7185;">${input.country}</strong>! Our platform's global appeal continues to grow.
                    </p>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 24px;">
                    <p style="color: #6b7280; font-size: 14px;">
                        © 2025 Ridezio. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
          `,
      });
      return {
        success: true,
      };
    }),
  send: publicProcedure
    .input(
      z.object({
        rating: z
          .enum(["bad", "good", "amazing", "okay", "terrible"])
          .default("okay"),
        from: z
          .enum(["github", "twitter", "none", "google", "friends"])
          .default("none"),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await transporter.sendMail({
          from: "Ridezio Team",
          to: "ridezio.company@gmail.com",
          subject: "New Feedback Received - Ridezio",
          html: `  
            <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #e11d48 0%, #fb7185 100%); padding: 40px 20px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New User Feedback 📝</h1>
                  </div>

                  <!-- Content -->
                  <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Rating Section -->
                    <div style="margin-bottom: 24px;">
                        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Rating</h2>
                        <div style="display: inline-block; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 16px; {{RATING_STYLE}}">
                            ${input.rating}
                        </div>
                    </div>

                    <!-- Source Section -->
                    <div style="margin-bottom: 24px;">
                        <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Found Us Through</h2>
                        <div style="display: inline-block; padding: 8px 16px; background-color: #f3f4f6; border-radius: 8px; color: #4b5563; font-size: 16px;">
                            ${input.from}
                        </div>
                    </div>

                    <!-- Feedback Section -->
                    <div style="margin-bottom: 32px;">
                      <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">User's Message</h2>
                      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          ${input.feedback}
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="text-align: center; padding-top: 24px;">
                    <p style="color: #6b7280; font-size: 14px;">
                      © 2025 Ridezio. All rights reserved.
                    </p>
                  </div>
              </div>
          </body>
          `,
        });

        return {
          success: true,
        };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Oh No! Feedback Didn't Go Through",
        });
      }
    }),
});

export { feedbackRouter };
