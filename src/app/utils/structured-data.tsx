import { type vehiclesType } from "~/server/db/schema";

export const generateVehicleListingSchema = (vehicle: vehiclesType) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: vehicle.name,
  description: (vehicle.features ?? [])
    .map((feature) => `${feature.key} - ${feature.value}`)
    .join(", "),
  image:
    (vehicle.images ?? []).length > 0 ? vehicle.images![0]!.url : undefined,
  offers: {
    "@type": "Offer",
    price: vehicle.basePrice,
    priceCurrency: "NPR",
    availability: vehicle.inventory
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
  },
});
