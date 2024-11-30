"use client";

import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const isInitialLoadRef = useRef(true);
  const [lastBounds, setLastBounds] = useState(initialBounds);

  useEffect(() => {
    // Set initial bounds without triggering a data fetch
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
      return;
    }

    const handleMoveEnd = () => {
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

      if (boundsChanged) {
        setData(newBounds);
        setLastBounds(newBounds);
      }
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, setData]);

  return null;
};

const ComponentResize = () => {
  const map = useMap();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Delay initial resize
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Create a resize observer to handle dynamic size changes
    const container = map.getContainer();
    resizeObserverRef.current = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserverRef.current.observe(container);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
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
          html: `<span class="block w-max px-4 py-2 bg-white text-slate-950 rounded-full text-xs sm:text-md font-medium shadow">${place.name ?? "Places"}</span>`,
          className: "custom-div-icon",
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
      zoom={12}
      zoomAnimation={true}
      zoomControl={false}
      zoomSnap={0}
      zoomDelta={0.2}
      wheelPxPerZoomLevel={400}
      scrollWheelZoom={true}
    >
      <ComponentResize />
      {isLoading && (
        <div className="absolute left-1/2 top-20 z-[999] flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-sm bg-white shadow-lg">
          <Loader2 className="size-6 animate-spin text-secondary" />
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
