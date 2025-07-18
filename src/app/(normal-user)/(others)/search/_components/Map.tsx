"use client";

import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { Loader2, Star } from "lucide-react";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import { bricolage } from "~/app/utils/font";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { OptimizedImage } from "~/components/ui/optimized-image";
import { cn } from "~/lib/utils";
import { type GetSearchedShops } from "~/server/api/routers/business";
import "~/styles/globals.css";

interface MapProps {
  mapLoading: boolean;
  setData: (bounds: MapBounds) => void;
  location: [number, number];
  places: GetSearchedShops;
  isLoading: boolean;
}

interface MapBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

const BoundsHandler: React.FC<{
  setData: (bounds: MapBounds) => void;
  initialBounds: MapBounds;
}> = ({ setData, initialBounds }) => {
  const map = useMap();
  const [lastBounds, setLastBounds] = useState(initialBounds);
  const boundsUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  const isUserInteractionRef = useRef(false);

  useEffect(() => {
    if (isInitialLoadRef.current) {
      const bounds = map.getBounds();
      const newBounds = {
        northEast: {
          lat: bounds.getNorthEast().lat,
          lng: bounds.getNorthEast().lng,
        },
        southWest: {
          lat: bounds.getSouthWest().lat,
          lng: bounds.getSouthWest().lng,
        },
      };
      setData(newBounds);
      setLastBounds(newBounds);
      isInitialLoadRef.current = false;
    }
  }, [map, setData]);

  const updateBounds = useCallback(() => {
    if (!isUserInteractionRef.current) return;

    const bounds = map.getBounds();
    const newBounds = {
      northEast: {
        lat: bounds.getNorthEast().lat,
        lng: bounds.getNorthEast().lng,
      },
      southWest: {
        lat: bounds.getSouthWest().lat,
        lng: bounds.getSouthWest().lng,
      },
    };

    const boundsChanged =
      Math.abs(newBounds.northEast.lat - lastBounds.northEast.lat) > 0.01 ||
      Math.abs(newBounds.northEast.lng - lastBounds.northEast.lng) > 0.01 ||
      Math.abs(newBounds.southWest.lat - lastBounds.southWest.lat) > 0.01 ||
      Math.abs(newBounds.southWest.lng - lastBounds.southWest.lng) > 0.01;

    if (boundsChanged) {
      if (boundsUpdateTimeout.current) {
        clearTimeout(boundsUpdateTimeout.current);
      }

      boundsUpdateTimeout.current = setTimeout(() => {
        setData(newBounds);
        setLastBounds(newBounds);
        isUserInteractionRef.current = false;
      }, 500) as unknown as NodeJS.Timeout;
    }
  }, [map, lastBounds, setData]);

  useEffect(() => {
    if (!map) return;

    const handleMoveStart = () => {
      isUserInteractionRef.current = true;
    };

    const handleMoveEnd = () => {
      updateBounds();
    };

    map.on("movestart", handleMoveStart);
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("movestart", handleMoveStart);
      map.off("moveend", handleMoveEnd);
      if (boundsUpdateTimeout.current) {
        clearTimeout(boundsUpdateTimeout.current);
      }
    };
  }, [map, updateBounds]);

  return null;
};

const ComponentResize = () => {
  const map = useMap();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Improved resize handling
    const container = map.getContainer();

    const resizeMap = () => {
      // Add a small delay to ensure layout is stable
      const timeoutId = setTimeout(() => {
        map.invalidateSize();
      }, 100);

      return timeoutId;
    };

    // Initial resize
    const initialTimeoutId = resizeMap();

    // Create a resize observer to handle dynamic size changes
    resizeObserverRef.current = new ResizeObserver(resizeMap);
    resizeObserverRef.current.observe(container);

    // Cleanup
    return () => {
      clearTimeout(initialTimeoutId);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [map]);

  return null;
};

const Map: React.FC<MapProps> = ({ setData, location, places, isLoading }) => {
  const memoizedMarkers = useMemo(() => {
    return places.map((place) => (
      <Marker
        key={place.id ?? uuidv4()}
        position={[place.location.lat!, place.location.lng!]}
        icon={L.divIcon({
          html: `
            <div class="rotate-45 rounded-t-full w-10 h-10 rounded-l-full p-0.5 bg-white shadow-lg transition-transform hover:scale-110">
              <img
                src="${place.logo}"
                alt="Place Logo"
                width="100%"
                height="100%"
                priority="true"
                style="width: 100%;"
                class="w-full h-full border border-border bg-white rounded-full object-contain -rotate-45"
              />
            </div>
          `,
          className: "custom-div-icon",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })}
      >
        <Popup
          maxWidth={300}
          minWidth={300}
          autoClose
          closeButton={false}
          closeOnEscapeKey
          className="p-0"
        >
          <div
            className={cn(bricolage.className, "rounded-lg bg-white shadow-lg")}
          >
            <div className="relative aspect-[11/7] w-full overflow-hidden rounded-t-md border-b border-border">
              <Carousel className="h-full w-full">
                <CarouselPrevious />
                <CarouselNext />
                <CarouselContent>
                  {place.images
                    .sort((a, b) => a.order - b.order)
                    .map((image, index) => (
                      <CarouselItem key={index} className="relative p-0">
                        <Link href={`/v/${place.slug}`}>
                          <OptimizedImage
                            alt={`${place.name}'s Images`}
                            className="m-auto aspect-[11/7] w-full rounded-none object-fill"
                            src={image.url}
                          />
                        </Link>
                      </CarouselItem>
                    ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="px-3 py-2">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-700">
                    {place.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star
                    size={18}
                    className="fill-yellow-500 stroke-yellow-500"
                  />
                  <span className="text-sm">
                    {+place.rating <= 0 ? "N/A" : (+place.rating).toFixed(1)}
                  </span>
                  {!!place.ratingCount && (
                    <span className="text-sm">{`(${place.ratingCount})`}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-2">
                  <p className="text-sm text-slate-700">Available Vehicles</p>
                </div>
                <div className="flex items-center gap-1">
                  {place.availableVehiclesTypes.map((vehicle) => (
                    <div
                      key={vehicle}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-1 text-xs capitalize text-slate-100 shadow-sm",
                        {
                          "bg-car-color/80": vehicle === "car",
                          "bg-e-car-color/80": vehicle === "e-car",
                          "bg-bike-color/80": vehicle === "bike",
                          "bg-bicycle-color/80": vehicle === "bicycle",
                          "bg-e-bicycle-color/80": vehicle === "e-bicycle",
                          "bg-scooter-color/80": vehicle === "scooter",
                        },
                      )}
                    >
                      {vehicle}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  }, [places]);

  const initialBounds = useMemo(
    () => ({
      northEast: { lat: location[0] + 0.1, lng: location[1] + 0.1 },
      southWest: { lat: location[0] - 0.1, lng: location[1] - 0.1 },
    }),
    [location],
  );

  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="h-16"></div>
      {loading && (
        <div className="absolute inset-0 z-[999] flex h-full w-full items-center justify-center bg-white">
          <Loader2 className="size-6 animate-spin text-secondary" />
        </div>
      )}
      <MapContainer
        key={JSON.stringify(location)}
        style={{ width: "100%", height: "calc(100vh - 4rem)" }}
        center={location}
        zoom={15}
        zoomAnimation={true}
        zoomControl={false}
        whenReady={() => {
          setLoading(false);
        }}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={100}
        scrollWheelZoom={true}
      >
        <ComponentResize />

        {isLoading && (
          <div className="absolute left-1/2 top-20 z-[999] flex h-12 w-32 -translate-x-1/2 items-center justify-center gap-1 rounded-sm bg-white text-sm font-medium text-slate-700 shadow-lg">
            <Loader2 className="size-5 animate-spin text-secondary" />
            Searching...
          </div>
        )}
        <BoundsHandler setData={setData} initialBounds={initialBounds} />
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {memoizedMarkers}
      </MapContainer>
    </>
  );
};

export default Map;
