import axios from "axios";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { type IpInfoResponse } from "~/server/api/routers/business";

export async function GET(request: Request) {
  let IP = "27.34.20.194";

  if (env.NODE_ENV === "production") {
    IP = request.headers.get("x-forwarded-for") ?? IP;
  }

  const { data: userLocation } = await axios.get<IpInfoResponse>(
    `https://ipinfo.io/${IP}/json?token=${env.IPINFO_API_KEY}`,
  );

  const [lat, lng] = userLocation.loc.split(",").map(Number);

  return NextResponse.json({
    lat,
    lng,
  });
}
