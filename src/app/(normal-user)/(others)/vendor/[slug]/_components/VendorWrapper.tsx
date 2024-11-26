"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { createContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "~/components/ui/button";
import { type GetVendorType } from "~/server/api/routers/business";
import Faqs from "./Faqs";
import Locations from "./Locations";
import Vehicles from "./Vehicles";
import VendorDetails from "./VendorDetails";

export const VendorContext = createContext<{
  vendor?: GetVendorType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {
    // do nothing
  },
});

const VendorWrapper = ({ data }: { data: GetVendorType }) => {
  console.log({ data });

  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 550) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <VendorContext.Provider
      value={{
        open: open,
        setOpen: setOpen,
        vendor: data,
      }}
    >
      <main className="relative w-full">
        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button className="share-button w-full" variant={"outline"}>
            <ExternalLink size={16} className="mr-2" />
            Share
          </Button>
        </motion.div>

        <VendorDetails />

        <div className="[&>section:nth-child(odd)]:bg-slate-50 [&>section]:px-4 [&>section]:py-16">
          <Vehicles />

          <Faqs />

          <Locations />
        </div>
      </main>
    </VendorContext.Provider>
  );
};

export default VendorWrapper;
