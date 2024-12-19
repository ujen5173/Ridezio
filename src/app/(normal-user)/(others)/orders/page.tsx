import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import OrdersPage from "./_components/OrdersPage";

const Orders = async () => {
  const user = await getServerAuthSession();

  if (user?.user.role === "VENDOR") {
    redirect("/dashboard/");
  }
  return <OrdersPage />;
};

export default Orders;
