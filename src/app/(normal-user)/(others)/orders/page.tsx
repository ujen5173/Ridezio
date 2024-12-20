import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { getServerAuthSession } from "~/server/auth";
import OrdersPage from "./_components/OrdersPage";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Orders | Velocit`,
    description: `View your orders`,
    url: `${env.NEXT_PUBLIC_APP_URL}/orders`,
  });
}

const Orders = async () => {
  const user = await getServerAuthSession();

  if (user?.user.role === "VENDOR") {
    redirect("/dashboard/");
  }
  return <OrdersPage />;
};

export default Orders;
