"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";
import { toast } from "~/hooks/use-toast";
import { type GetSearchedShops } from "~/server/api/routers/business";
import { type MapBounds } from "../page";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

interface GeocodeResponse {
  lat: string;
  lon: string;
}

interface IpInfoResponse {
  lat: number;
  lng: number;
}

const MapArea = ({
  places,
  isLoading,
  setIsLoading,
  setBounds,
  isDataFetching,
  position,
  setPosition,
}: {
  places: GetSearchedShops;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setBounds: React.Dispatch<React.SetStateAction<MapBounds | null>>;
  isDataFetching: boolean;
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}) => {
  const locationName = useSearchParams().get("location") ?? "";
  const hasSetInitialPosition = useRef(false);

  useEffect(() => {
    if (hasSetInitialPosition.current) return;

    const fetchLocation = async () => {
      try {
        if (locationName) {
          const response = await axios.get<GeocodeResponse[]>(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`,
          );

          if (response.data?.[0]) {
            const { lat, lon } = response.data[0];
            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lon);
            setPosition([latNum, lngNum]);
            hasSetInitialPosition.current = true;
            return;
          }
        }

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latNum = position.coords.latitude;
              const lngNum = position.coords.longitude;
              setPosition([latNum, lngNum]);
              hasSetInitialPosition.current = true;
            },
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            async (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                try {
                  const ipResponse = await axios.get<IpInfoResponse>("/api/ip");
                  const { lat, lng } = ipResponse.data;
                  setPosition([lat, lng]);
                  hasSetInitialPosition.current = true;
                } catch (err) {
                  console.error(err);
                  toast({
                    title: "Location Error",
                    description: "Could not determine your location",
                    variant: "destructive",
                  });
                  setIsLoading(false);
                }
              }
            },
          );
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Location Error",
          description: "Could not determine your location",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    void fetchLocation();
  }, [locationName]);

  const handleBoundsChange = useCallback(
    (newBounds: MapBounds) => {
      setBounds(newBounds);
    },
    [setBounds],
  );

  if (!position)
    return (
      <div className="absolute inset-0 z-[999] flex h-full w-full items-center justify-center bg-white">
        <Loader2 className="size-6 animate-spin text-secondary" />
      </div>
    );

  return (
    <Map
      mapLoading={isLoading}
      setData={handleBoundsChange}
      location={position}
      places={places}
      isLoading={isDataFetching}
    />
  );
};

export default React.memo(MapArea);
