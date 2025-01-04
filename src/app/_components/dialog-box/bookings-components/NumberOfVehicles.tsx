import { Minus, Plus } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const NumberOfVehicles = ({
  handleQuantityChange,
  quantity,
  date,
  getMaxAllowedQuantity,
}: {
  handleQuantityChange: (type: "increment" | "decrement") => void;
  quantity: number;
  date: DateRange | undefined;
  getMaxAllowedQuantity: () => number;
}) => {
  return (
    <div className="space-y-2 px-1">
      <Label>Number of Vehicles</Label>
      <div className="flex w-min items-center gap-2">
        <Button
          variant={"outline"}
          size={"icon"}
          className="flex size-6 items-center justify-center rounded-full border-slate-400 bg-slate-400 hover:bg-slate-300"
          onClick={() => handleQuantityChange("decrement")}
          disabled={quantity <= 1}
        >
          <Minus size={18} className="text-white" />
        </Button>
        <div className="w-20">
          <Input
            type="text"
            pattern="[0-9]+"
            inputMode="numeric"
            min="1"
            max={getMaxAllowedQuantity()}
            readOnly
            disabled={!!date}
            value={quantity}
            className="h-10 text-center"
          />
        </div>

        <Button
          variant={"outline"}
          size={"icon"}
          className="flex size-6 items-center justify-center rounded-full border-slate-700 bg-slate-700 hover:bg-slate-600"
          onClick={() => handleQuantityChange("increment")}
          disabled={quantity >= getMaxAllowedQuantity()}
        >
          <Plus size={18} className="text-white" />
        </Button>
      </div>
      {date?.from && date?.to && (
        <p className="text-sm text-muted-foreground">
          Maximum available: {getMaxAllowedQuantity()} vehicles
        </p>
      )}
    </div>
  );
};

export default NumberOfVehicles;
