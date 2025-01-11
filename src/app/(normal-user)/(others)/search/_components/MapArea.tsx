"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
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
}: {
  places: GetSearchedShops;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setBounds: React.Dispatch<React.SetStateAction<MapBounds | null>>;
  isDataFetching: boolean;
}) => {
  const locationName = useSearchParams().get("location") ?? "";

  const [position, setPosition] = useState<[number, number] | null>([
    13.7563, 100.5018,
  ]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (locationName) {
          const response = await axios.get<GeocodeResponse[]>(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`,
          );

          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0] as {
              lat: string;
              lon: string;
            };
            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lon);
            const newPosition: [number, number] = [latNum, lngNum];
            setPosition(newPosition);
            setBounds({
              northEast: { lat: latNum + 0.1, lng: lngNum + 0.1 },
              southWest: { lat: latNum - 0.1, lng: lngNum - 0.1 },
            });
            return;
          }
        }

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latNum = position.coords.latitude;
              const lngNum = position.coords.longitude;
              const newPosition: [number, number] = [latNum, lngNum];
              setPosition(newPosition);
              setBounds({
                northEast: { lat: latNum + 0.1, lng: lngNum + 0.1 },
                southWest: { lat: latNum - 0.1, lng: lngNum - 0.1 },
              });
            },
            (error) => {
              void (async () => {
                if (error.code === error.PERMISSION_DENIED) {
                  try {
                    const ipResponse =
                      await axios.get<IpInfoResponse>("/api/ip");

                    const { lat, lng } = ipResponse.data;

                    const newPosition: [number, number] = [lat, lng];

                    setPosition(newPosition);

                    setBounds({
                      northEast: { lat: lat + 0.1, lng: lng + 0.1 },
                      southWest: { lat: lat - 0.1, lng: lng - 0.1 },
                    });
                  } catch (err) {
                    console.log({ err });

                    toast({
                      title: "Location Error",
                      description: "Could not determine your location",
                      variant: "destructive",
                    });

                    setIsLoading(false);
                  }
                }
              })();
            },
          );
        } else {
          const ipResponse = await axios.get<IpInfoResponse>("/api/ip");
          const { lat, lng } = ipResponse.data;
          const newPosition: [number, number] = [lat, lng];
          setPosition(newPosition);
          setBounds({
            northEast: { lat: lat + 0.1, lng: lng + 0.1 },
            southWest: { lat: lat - 0.1, lng: lng - 0.1 },
          });
        }
      } catch (error) {
        console.log({ error });
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

  const handleBoundsChange = useCallback((newBounds: MapBounds) => {
    setBounds(newBounds);
  }, []);

  if (!position) return null;

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
