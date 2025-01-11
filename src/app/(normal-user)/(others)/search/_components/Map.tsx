"use client";

import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
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
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import { type GetSearchedShops } from "~/server/api/routers/business";

interface MapProps {
  mapLoading: boolean;
  setData: (bounds: MapBounds) => void;
  location?: [number, number];
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
  const isInitialLoadRef = useRef(true);

  const updateBounds = useCallback(() => {
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

    // Only fetch data if bounds have significantly changed
    const boundsChanged =
      Math.abs(newBounds.northEast.lat - lastBounds.northEast.lat) > 0.01 ||
      Math.abs(newBounds.northEast.lng - lastBounds.northEast.lng) > 0.01 ||
      Math.abs(newBounds.southWest.lat - lastBounds.southWest.lat) > 0.01 ||
      Math.abs(newBounds.southWest.lng - lastBounds.southWest.lng) > 0.01;

    if (boundsChanged || isInitialLoadRef.current) {
      setData(newBounds);
      setLastBounds(newBounds);
      isInitialLoadRef.current = false;
    }
  }, [map, setData, lastBounds]);

  useEffect(() => {
    // Ensure map is fully loaded before setting initial bounds
    if (map) {
      // Use setTimeout to ensure DOM is ready and map is fully initialized
      const timerId = setTimeout(() => {
        updateBounds();
      }, 0);

      const handleMoveEnd = () => {
        updateBounds();
      };

      map.on("moveend", handleMoveEnd);

      return () => {
        clearTimeout(timerId);
        map.off("moveend", handleMoveEnd);
      };
    }
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

const Map: React.FC<MapProps> = ({
  mapLoading,
  setData,
  location = [27.7172, 85.324],
  places,
  isLoading,
}) => {
  const memoizedMarkers = useMemo(() => {
    return places.map((place) => (
      <Marker
        key={place.id ?? uuidv4()}
        position={[place.location.lat!, place.location.lng!]}
        icon={L.divIcon({
          html: `
          <div class="rotate-45 rounded-t-full w-9 h-9 rounded-l-full p-0.5 bg-white shadow-lg">
            <img
              src="${place.logo}"
              alt="Place Logo"
              width="100%"
              height="100%"
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
      />
    ));
  }, [places]);

  const initialBounds = useMemo(
    () => ({
      northEast: { lat: location[0] + 0.1, lng: location[1] + 0.1 },
      southWest: { lat: location[0] - 0.1, lng: location[1] - 0.1 },
    }),
    [location],
  );

  if (mapLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <MapContainer
      key={JSON.stringify(location)}
      style={{ width: "100%", height: "100%" }}
      center={location}
      zoom={15}
      zoomAnimation={true}
      zoomControl={false}
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
  );
};

export default Map;
