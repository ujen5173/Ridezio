import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { env } from "~/env";

const EventsLayout = ({ children }: { children: ReactNode }) => {
  if (env.NEXT_PUBLIC_ENROLL_EVENTS === "false") redirect("/dashboard");

  return <>{children}</>;
};

export default EventsLayout;
