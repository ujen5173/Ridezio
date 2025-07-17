import { notFound } from "next/navigation";
import { constructMetadata, getBaseUrl } from "~/app/utils/site";
import { api } from "~/trpc/server";
import AccessoryReviews from "./AccessoryReviews";
import ProductPage from "./ProductPage";
import SimilarProducts from "./SimilarProducts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const { product: pSlug } = await params;
  const product = await api.accessories.getSingleAccessory({
    product: pSlug,
  });

  if (!product) return constructMetadata({});

  return constructMetadata({
    title: `${product.name}  | Ridezio`,
    description: `Buy ${product.name} from ${product.business.name} in ${product.business.location.city}. Best prices, instant booking.`,
    url: `${getBaseUrl()}/vendor/${product.business.slug}/shop/${product.slug}`,
    image: product.images[0]?.url,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images[0]?.url,
      description: product.description,
      brand: product.brand,
      offers: {
        "@type": "Offer",
        priceCurrency: "NPR",
        price: product.basePrice,
        availability: "https://schema.org/InStock",
        url: `${getBaseUrl()}/vendor/${product.business.slug}/shop/${product.slug}`,
      },
    },
  });
}

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
