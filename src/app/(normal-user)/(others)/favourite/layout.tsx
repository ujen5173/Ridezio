import { type Metadata } from "next";
import { type ReactNode } from "react";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Favourites`,
    description: `Your favourite vehicles on Ridezio`,
    url: `${env.NEXT_PUBLIC_APP_URL}/favorite`,
  });
}

const FavouriteLayout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default FavouriteLayout;
