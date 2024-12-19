import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import AccessoryReviews from "./AccessoryReviews";
import ProductPage from "./ProductPage";
import SimilarProducts from "./SimilarProducts";

const ProductPageWrapper = async ({
  params,
}: {
  params: Promise<{ product: string }>;
}) => {
  const { product } = await params;

  const data = await api.accessories.getSingleAccessory({
    product: product,
  });

  if (!data) notFound();

  return (
    <>
      <ProductPage data={data} />
      <AccessoryReviews
        rating={data.rating}
        accessoryId={data.id}
        ratingCount={data.ratingCount ?? 0}
      />
      <SimilarProducts product={data.slug} />
    </>
  );
};

export default ProductPageWrapper;
