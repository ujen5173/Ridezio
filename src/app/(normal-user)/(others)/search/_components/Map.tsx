"use client";

import L, { type Map as LeafletMap } from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import React, { useCallback, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";

interface Place {
  lat: number;
  lng: number;
  price?: string | number;
  hovered?: boolean;
}

interface MapProps {
  setData: React.Dispatch<
    React.SetStateAction<{
      loading: boolean;
      results: Record<
        string,
        { id: string; name: string; location: { lat: number; lng: number } }
      >[];
    }>
  >;
  location?: [number, number];
  places: Place[];
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>;
}

interface MapBounds {
  lat: number | undefined;
  lng: number | undefined;
}

const LeafletMapComponent: React.FC<MapProps> = ({
  setData,
  location,
  places,
  setPlaces,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);

  // Memoize getBounds to prevent unnecessary re-renders
  const getBounds = useCallback((map: LeafletMap | null) => {
    const bounds = map?.getBounds();
    if (!bounds) return;

    const markers: MapBounds[] = [
      { lat: bounds.getNorthWest().lat, lng: bounds.getNorthWest().lng },
      { lat: bounds.getNorthEast().lat, lng: bounds.getNorthEast().lng },
      { lat: bounds.getSouthWest().lat, lng: bounds.getSouthWest().lng },
      { lat: bounds.getSouthEast().lat, lng: bounds.getSouthEast().lng },
    ];
  }, []);

  // Use useMemo for marker generation
  const memoizedMarkers = useMemo(
    () =>
      places.map((place) => (
        <Marker
          key={uuidv4()}
          position={[place.lat, place.lng]}
          icon={L.divIcon({
            html: `<span class="px-4 py-2 rounded-full text-md font-bold shadow ${
              place.hovered
                ? "bg-blackColor text-white"
                : "bg-white text-blackColor"
            }">${place.price ?? "Places"}</span>`,
            className: "custom-div-icon",
          })}
        />
      )),
    [places],
  );

  return (
    <MapContainer
      key={JSON.stringify(location)}
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      center={location}
      zoom={16}
      zoomAnimation={true}
      zoomAnimationThreshold={50}
      zoomControl={false}
      zoomSnap={0.5}
      scrollWheelZoom={true}
      wheelPxPerZoomLevel={500}
      whenReady={() => {
        getBounds(mapRef.current);
      }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
      />
      {memoizedMarkers}
    </MapContainer>
  );
};

export default LeafletMapComponent;
