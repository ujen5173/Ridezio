import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { inter } from "~/app/utils/font";
import { cn } from "~/lib/utils";

const AccessoriesCard = ({ i }: { i: number }) => {
  return (
    <Link href="/shop/product/product1">
      <div className="bg-white">
        <div className="mb-4 rounded-lg bg-slate-200">
          <Image
            src={`/p${i}.jpg`}
            width={800}
            height={800}
            className="aspect-square rounded-lg object-cover"
            alt=""
          />
        </div>
        <div>
          <h5 className="mb-1 text-base uppercase text-secondary">
            Protection
          </h5>
          <h1 className="mb-4 line-clamp-1 text-xl font-semibold">
            LS2 Rookie Black Knee Protector
          </h1>
          <div className="mb-2 flex items-center gap-1">
            <Star size={20} className="fill-yellow-500 stroke-yellow-500" />
            <span>
              <span className="text-lg font-medium">4.5 </span>
              <span className="text-base text-slate-600">(500+ sold)</span>
            </span>
          </div>
          <p className="text-base font-medium uppercase">Starting at</p>
          <h2
            className={cn(
              inter.className,
              "text-2xl font-medium text-secondary",
            )}
          >
            $19.99
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default AccessoriesCard;
