import { type Metadata } from "next";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { type GetSingleVehicleType } from "~/server/api/routers/vehicle";
import { api } from "~/trpc/server";
import Wrapper from "./wrapper";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `New Vehicle`,
    description: `Add new vehicle to your fleet`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/vehicles/add`,
  });
}

const VehicleCreatePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ edit: string | undefined }>;
}) => {
  const { edit } = await searchParams;

  let data: GetSingleVehicleType = undefined;

  const businessVehicles = await api.business.allowedVehicles();

  if (edit) {
    data = await api.vehicle.getSingle({ id: edit });
  }

  return (
    <Wrapper
      allowedVehicles={businessVehicles ?? []}
      editData={data}
      type={edit ? "edit" : "new"}
    />
  );
};

export default VehicleCreatePage;
