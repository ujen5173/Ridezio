import Image from "next/image";
import { cn } from "~/lib/utils";
import { type vehicleTypeEnum } from "~/server/db/schema";

const VehicleIndicatorIcon = ({
  vehicle,
  props,
}: {
  vehicle: (typeof vehicleTypeEnum.enumValues)[number];
  props?: {
    className?: string;
    event: () => void;
  };
}) => {
  return (
    <div
      onClick={props?.event}
      className={cn(
        "flex size-20 flex-col items-center justify-between rounded-md border border-slate-200 bg-slate-100 p-2",
        props?.className,
      )}
    >
      <Image
        alt="Vechile"
        width={100}
        height={100}
        className="size-12 object-cover"
        src={`/images/vehicle/${vehicle}.png`}
      />
      <span className="text-xs capitalize">{vehicle}</span>
    </div>
  );
};

export default VehicleIndicatorIcon;
