import axios from "axios";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { type IpInfoResponse } from "~/server/api/routers/business";

export async function GET(req: NextRequest) {
  let ip: string | undefined = "27.34.20.194";

  // user is not from Nepal and wants to browse Nepal listings
  if (req.cookies.get("change-location")?.value !== "true") {
    if (env.NODE_ENV === "production") {
      const headersList = await headers();
      const forwarded = headersList.get("x-forwarded-for");
      ip = forwarded
        ? (forwarded.split(",")[0] ?? undefined)
        : (headersList.get("x-real-ip") ?? undefined);
    }
  }

  if (ip === "::1" || !ip) {
    ip = "27.34.20.194"; // Default IP for localhost to Kathmandu, Nepal
  }

  const { data: location } = await axios.get<IpInfoResponse>(
    `https://ipinfo.io/${ip}/json?token=${env.IPINFO_API_KEY}`,
  );

  return NextResponse.json({
    lat: +(location.loc.split(",")[0] ?? 0),
    lng: +(location.loc.split(",")[1] ?? 0),
  });
}
