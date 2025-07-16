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

export function AvailablyOnlyForNepal() {
  const [open, setOpen] = useState(false);

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
          <DialogTitle className="mb-4 text-3xl font-bold text-slate-700">
            Welcome to{" "}
            <span className="text-secondary underline">Ridezio!</span>
          </DialogTitle>
          <DialogDescription className="text-lg">
            Hey there! We noticed you&apos;re not viewing listings from Nepal.
            Tap below to switch and see what&apos;s available in Nepal! 🚗🇳🇵
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 items-center gap-2">
          <Button
            disabled={status === "pending"}
            onClick={async () => {
              savePref();
              document.cookie = "change-location=true; path=/";
              setOpen(false);
            }}
            variant="secondary"
          >
            View Nepal Listings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
