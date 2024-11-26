import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const request = (await req.json()) as { role?: string | null };

  const cookieData = request.role ?? "USER";

  cookies().set("role", cookieData);

  return Response.json({ message: "Role set" });
};
