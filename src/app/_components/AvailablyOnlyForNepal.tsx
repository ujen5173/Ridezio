"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

export function AvailablyOnlyForNepal({ country }: { country: string }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, status } =
    api.feedback.requestForOtherCountries.useMutation();

  const savePref = () => {
    localStorage.setItem("disableForNepalPopup", "true");
  };

  useEffect(() => {
    const disableForNepalPopup = localStorage.getItem("disableForNepalPopup");
    if (!disableForNepalPopup) {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        savePref();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4 text-3xl text-slate-700">
            Welcome to Velocit!
          </DialogTitle>
          <DialogDescription className="text-lg">
            We&apos;re currently available in
            <u className="text-semibold mx-1 text-secondary">
              Nepal!
            </u> Want to list your rental shop? Let us know, we&apos;d love to
            have you on board! 🚗🚲
          </DialogDescription>
        </DialogHeader>
        <Button
          disabled={status === "pending"}
          onClick={async () => {
            savePref();
            await mutateAsync({ country: country ?? "N/A" });
            setOpen(false);
          }}
          variant="secondary"
        >
          {status === "pending" ? "Sending..." : "Notify us!"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
