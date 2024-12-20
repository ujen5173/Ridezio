import { type Metadata } from "next";
import { constructMetadata } from "~/app/utils/site";
import { env } from "~/env";
import { type GetSingleAccessoriesType } from "~/server/api/routers/accessories";
import { api } from "~/trpc/server";
import Wrapper from "./wrapper";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title: `Add Accessories | Velocit`,
    url: `${env.NEXT_PUBLIC_APP_URL}/vendor/accessories/add`,
  });
}

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
