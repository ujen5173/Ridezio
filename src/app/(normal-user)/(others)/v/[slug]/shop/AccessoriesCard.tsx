import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AccessoriesCard = ({
  accessory,
  slug,
}: {
  slug: string | undefined;
  accessory: {
    id: string;
    name: string;
    slug: string;
    images: {
      id: string;
      order: number;
      url: string;
    }[];
    basePrice: number;
    inventory: number;
    brand: string | null;
    discount: number | null;
    category: string;
  };
}) => {
  return (
    <Link href={`/v/${slug}/shop/${accessory.slug}`}>
      <div className="bg-white">
        <div className="mb-4 flex aspect-square items-center justify-center rounded-lg border border-slate-100 bg-slate-50">
          <Image
            src={accessory.images[0]!.url}
            width={800}
            height={800}
            className="h-9/12 aspect-square w-9/12 rounded-lg object-contain mix-blend-multiply"
            alt=""
          />
        </div>
        <div>
          <h5 className="mb-1 text-base uppercase text-secondary">
            {accessory.category}
          </h5>
          <h1 className="mb-2 line-clamp-1 text-xl font-semibold">
            {accessory.name}
          </h1>
          <div className="mb-2 flex items-center gap-1">
            <Star size={20} className="fill-yellow-500 stroke-yellow-500" />
            <span>
              <span className="text-lg font-medium">4.5 </span>
              <span className="text-base text-slate-600">(500+ sold)</span>
            </span>
          </div>
          <p className="text-base font-medium uppercase">Starting at</p>
          <h2 className="mb-4 text-2xl font-bold text-secondary">
            {Intl.NumberFormat("en-NP", {
              style: "currency",
              currency: "NPR",
            }).format(
              accessory.discount
                ? accessory.basePrice - accessory.discount
                : accessory.basePrice,
            )}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default AccessoriesCard;
