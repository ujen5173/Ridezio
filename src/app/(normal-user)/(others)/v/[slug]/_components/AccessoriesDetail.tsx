"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

const AccessoriesDetail = () => {
  const query = useSearchParams().get("accessories");
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (query) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [query]);

  const router = useRouter();

  return (
    <Sheet
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (e === false) {
          router.back();
        }
      }}
    >
      <SheetContent className="m-4 h-auto overflow-hidden rounded-md p-0">
        <SheetHeader>
          <SheetTitle className="border-b border-border bg-slate-100 px-4 py-[0.80rem] text-base font-medium">
            Accessories
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full w-full items-center justify-center overflow-scroll">
          <h3 className="text-center text-lg font-normal text-slate-600">
            This component is under construction
          </h3>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccessoriesDetail;
