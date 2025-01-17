"use client";

import { PopoverClose } from "@radix-ui/react-popover";
import { ChevronsUpDown, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { inter } from "~/app/utils/font";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface BookingsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
}

const PurchaseAccessory: React.FC<BookingsProps> = ({
  open,
  setOpen,
  refresh,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useSession();
  const { data: accessories } = api.accessories.getVendorAccessories.useQuery();
  const { mutateAsync: placeOrder, status } =
    api.accessories.placeOrder.useMutation();

  const [quantity, setQuantity] = useState<number>(1);
  const [userName, setUserName] = useState(user?.user.name ?? "");
  const [selectedAccessory, setSelectedAccessory] = useState<{
    id: string;
    label: string;
    price: number;
  } | null>(null);

  const getPrice = () => {
    return new Intl.NumberFormat("en-IN").format(
      (selectedAccessory?.price ?? 0) * quantity,
    );
  };

  const handleCheckout = async () => {
    if (!selectedAccessory) {
      return;
    }

    try {
      await placeOrder({
        data: {
          accessoryId: selectedAccessory.id,
          quantity,
          customerName: userName,
        },
      });

      refresh();
      setOpen(false);
      toast({ title: "Order placed successfully" });
    } catch (error) {
      toast({ title: "Failed to place order" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          router.replace(pathname, {
            scroll: false,
          });
        }
        setOpen(e);
      }}
    >
      <DialogContent
        className={cn(
          inter.className,
          "flex h-[90vh] max-h-[500px] w-[480px] flex-col gap-4 px-2 py-4 sm:px-4",
        )}
      >
        <DialogHeader className="flex-none border-b border-border pb-2">
          <DialogTitle className="text-center text-lg font-medium text-foreground">
            Purchase Accessory
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Which Accessory?</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between px-4"
                  >
                    <div className="line-clamp-1">
                      {selectedAccessory?.label ?? "Select acccesory..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className="w-full">
                    <CommandInput placeholder="Search accessory..." />
                    <ScrollArea className="min-h-36 w-full">
                      <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {accessories?.map((accessory) => (
                            <PopoverClose
                              className="flex w-full"
                              key={accessory.id}
                            >
                              <CommandItem
                                onSelect={() => {
                                  setSelectedAccessory({
                                    id: accessory.id,
                                    label: accessory.name,
                                    price: accessory.basePrice,
                                  });
                                }}
                              >
                                <div className="flex w-full items-center justify-between">
                                  <span className="line-clamp-1">
                                    {accessory.name}
                                  </span>
                                </div>
                              </CommandItem>
                            </PopoverClose>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 px-1">
              <Label>Quantity</Label>
              <div className="flex w-min items-center gap-2">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="flex size-6 items-center justify-center rounded-full border-slate-400 bg-slate-400 hover:bg-slate-300"
                  onClick={() => setQuantity((prev) => prev - 1)}
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
                    readOnly
                    value={quantity}
                    className="h-10 text-center"
                  />
                </div>

                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="flex size-6 items-center justify-center rounded-full border-slate-700 bg-slate-700 hover:bg-slate-600"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus size={18} className="text-white" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="space-y-2 px-1">
                <Label>Customer Username</Label>
                <Input
                  value={userName}
                  placeholder="John Doe"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex w-full flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex flex-wrap gap-1 text-lg font-semibold">
            <span className="text-nowrap">Total: NPR.{getPrice()}/-</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              disabled={status === "pending" || !selectedAccessory}
            >
              Add Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseAccessory;
