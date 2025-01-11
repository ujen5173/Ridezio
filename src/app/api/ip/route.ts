import axios from "axios";
import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  let IP = "27.34.20.194";

  if (env.NODE_ENV === "production") {
    IP = request.headers.get("x-forwarded-for") ?? IP;
  }

  const { data: location } = await axios.get<{
    latitude: number;
    longitude: number;
  }>(`https://api.ipapi.com/api/${IP}?access_key=${env.NEXT_PUBLIC_IPAPI_KEY}`);

  return NextResponse.json({
    lat: location.latitude,
    lng: location.longitude,
  });
}
