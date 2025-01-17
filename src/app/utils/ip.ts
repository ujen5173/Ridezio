import axios from "axios";
import { headers } from "next/headers";
import { cache } from "react";
import { env } from "~/env";
import { type IpInfoResponse } from "~/server/api/routers/business";

export const getUserGeoFromIP = cache(async () => {
  const headersList = headers();

  // Get client IP from request headers
  const forwarded = headersList.get("x-forwarded-for");
  let ip = forwarded ? forwarded.split(",")[0] : headersList.get("x-real-ip");

  if (ip === "::1" || !ip) {
    ip = "27.34.20.194"; // Default IP for localhost to Kathmandu, Nepal
  }
  // ip = "27.34.20.194"; // Default IP for localhost to Kathmandu, Nepal

  // Use a geolocation service that accepts IP address
  const { data: location } = await axios.get<IpInfoResponse>(
    `https://ipinfo.io/${ip}/json?token=${env.IPINFO_API_KEY}`,
  );

  const country = `${location.timezone} - ${location.city} - ${location.country}`;
  const city = location.city;
  const geo = {
    lat: +(location.loc.split(",")[0] ?? 0),
    lng: +(location.loc.split(",")[1] ?? 0),
  };

  const country_code = location.country;

  return {
    country,
    city,
    geo,
    country_code,
  };
});
