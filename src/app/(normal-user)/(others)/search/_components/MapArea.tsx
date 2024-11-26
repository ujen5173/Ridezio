"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "~/hooks/use-toast";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
});
interface Place {
  lat: number;
  lng: number;
  price?: string | number;
  hovered?: boolean;
}

interface GeocodeResponse {
  lat: string;
  lon: string;
}

const MapArea = () => {
  const locationName = useSearchParams().get("location");
  const from = useSearchParams().get("from");
  const to = useSearchParams().get("to");
  const vehicleType = useSearchParams().get("vehicleType");

  const [data, setData] = useState<{
    loading: boolean;
    results: Record<
      string,
      { id: string; name: string; location: { lat: number; lng: number } }
    >[];
  }>({
    loading: true,
    results: [],
  });
  const [places, setPlaces] = useState<Place[]>([
    { lat: 27.7172, lng: 85.324 }, // Kathmandu
    { lat: 27.6946, lng: 85.2976 }, // Lalitpur
    { lat: 27.6677, lng: 85.3496 }, // Bhaktapur
    { lat: 28.2096, lng: 83.9856 }, // Pokhara
    { lat: 27.7058, lng: 85.3157 },
    { lat: 27.6885, lng: 85.3187 },
    { lat: 27.6731, lng: 85.4299 },
    { lat: 28.2135, lng: 83.9777 },
    { lat: 27.7136, lng: 85.328 },
    { lat: 27.6742, lng: 85.3214 },
    { lat: 27.6698, lng: 85.3681 },
    { lat: 28.2122, lng: 83.9822 },
    { lat: 27.7157, lng: 85.3238 },
    { lat: 27.6912, lng: 85.3145 },
    { lat: 27.6756, lng: 85.3812 },
    { lat: 28.2164, lng: 83.9796 },
    { lat: 27.7106, lng: 85.3193 },
    { lat: 27.6934, lng: 85.3162 },
    { lat: 27.6792, lng: 85.3423 },
    { lat: 28.2109, lng: 83.9873 },
    { lat: 27.7176, lng: 85.3236 },
    { lat: 27.6888, lng: 85.3125 },
    { lat: 27.6712, lng: 85.3614 },
    { lat: 28.2145, lng: 83.9814 },
    { lat: 27.7117, lng: 85.3298 },
    { lat: 27.6853, lng: 85.3085 },
    { lat: 27.6688, lng: 85.3553 },
    { lat: 28.2187, lng: 83.986 },
    { lat: 27.7152, lng: 85.3272 },
    { lat: 27.6902, lng: 85.3118 },
    { lat: 27.6723, lng: 85.3531 },
    { lat: 28.2152, lng: 83.9817 },
    { lat: 27.7173, lng: 85.3199 },
    { lat: 27.6836, lng: 85.3056 },
    { lat: 27.6705, lng: 85.3465 },
    { lat: 28.2171, lng: 83.9842 },
    { lat: 27.7148, lng: 85.3263 },
    { lat: 27.6874, lng: 85.3103 },
    { lat: 27.6669, lng: 85.3527 },
    { lat: 28.2138, lng: 83.9791 },
    { lat: 27.7134, lng: 85.3216 },
    { lat: 27.6921, lng: 85.3151 },
    { lat: 27.6783, lng: 85.3417 },
    { lat: 28.2091, lng: 83.9854 },
    { lat: 27.7168, lng: 85.3283 },
    { lat: 27.6861, lng: 85.3108 },
    { lat: 27.6747, lng: 85.3564 },
    { lat: 28.2126, lng: 83.9825 },
    { lat: 27.7139, lng: 85.3197 },
    { lat: 27.6909, lng: 85.3096 },
    { lat: 27.6735, lng: 85.3387 },
    { lat: 28.2176, lng: 83.9836 },
  ]);

  const [position, setPosition] = useState<[number, number]>([27.7172, 85.324]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!locationName) {
        toast({
          title: "Location not found",
          description: "Please provide a valid location",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await axios.get<GeocodeResponse[]>(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`,
        );

        if (response.data && response.data.length > 0 && response.data[0]) {
          const { lat, lon } = response.data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    void fetchLocation();
  }, [locationName]);

  return (
    <Map
      setData={setData}
      location={position}
      places={places}
      setPlaces={setPlaces}
    />
  );
};

export default React.memo(MapArea);
