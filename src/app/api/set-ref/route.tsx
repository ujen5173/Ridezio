import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const request = (await req.json()) as { ref?: string | null };

  const ref = request.ref;

  if (ref) (await cookies()).set("ref", ref);

  return Response.json({ message: "ref set" });
};
