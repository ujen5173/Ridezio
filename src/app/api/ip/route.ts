import axios from "axios";
import { env } from "~/env";

export interface IpInfoResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
}

export async function GET(request: Request): Promise<Response> {
  try {
    const ipAddress = "27.34.65.62";

    // if (env.NODE_ENV !== "development") {
    //   ipAddress =
    //     request.headers.get("x-forwarded-for") ??
    //     request.headers.get("remote-addr") ??
    //     "124.41.204.21"; // Default to Kathmandu, Nepal
    // }

    // Fetch location data from ipinfo.io API
    const response = await axios.get<IpInfoResponse>(
      `https://ipinfo.io/${ipAddress}/json?token=${env.IPINFO_API_KEY}`,
    );

    // Return the fetched location data as JSON
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle errors and return a 500 response
    return new Response(
      JSON.stringify({ error: "Failed to retrieve IP location" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
