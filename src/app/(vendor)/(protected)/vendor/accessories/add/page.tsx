import { type GetSingleAccessoriesType } from "~/server/api/routers/accessories";
import { api } from "~/trpc/server";
import Wrapper from "./wrapper";

const AddAccessories = async ({
  searchParams,
}: {
  searchParams: Promise<{ edit: string | undefined }>;
}) => {
  const { edit } = await searchParams;

  let data: GetSingleAccessoriesType = undefined;

  if (edit) {
    data = await api.accessories.getSingle({ id: edit });
  }

  return <Wrapper editData={data} type={edit ? "edit" : "new"} />;
};

export default AddAccessories;
