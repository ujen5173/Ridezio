import { type GetSingleVehicleType } from "~/server/api/routers/vehicle";
import { api } from "~/trpc/server";
import Wrapper from "./wrapper";

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
