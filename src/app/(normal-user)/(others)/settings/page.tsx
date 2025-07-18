import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { api } from "~/trpc/server";
import SettingsWrapper from "./settingsWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Settings`,
    url: `${env.NEXT_PUBLIC_APP_URL}/settings`,
  });
}

const Settings = async () => {
  const userDetails = await api.user.current();

  if (userDetails.role === "VENDOR") {
    redirect("/vendor/settings");
  }

  return <SettingsWrapper userDetails={userDetails} />;
};

export default Settings;
