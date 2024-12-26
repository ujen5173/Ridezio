import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata } from "~/app/utils/site";

export const metadata: Metadata = constructMetadata({
  title: "Log In / Sign Up",
  description:
    "Log in to Velocit and access the best vehicle rentals near you. Manage your bookings, explore rental options, and connect with trusted local shops.",
});

const SignInLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default SignInLayout;
