"use client";

import { useEffect, useRef } from "react";

const ADDIS_ABABA: [number, number] = [9.03, 38.74];

export default function LocationMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let active = true;

    import("leaflet").then((leaflet) => {
      if (!active || !mapElement.current) return;

      map = leaflet.map(mapElement.current, {
        center: ADDIS_ABABA,
        zoom: 12,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        })
        .addTo(map);

      leaflet
        .marker(ADDIS_ABABA, {
          title: "Addis Ababa, Ethiopia",
          icon: leaflet.divIcon({
            className: "location-map-pin",
            html: "<span></span>",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })
        .addTo(map)
        .bindTooltip("Addis Ababa, Ethiopia", {
          direction: "top",
          offset: [0, -12],
        });

      leaflet.control.zoom({ position: "bottomright" }).addTo(map);
    });

    return () => {
      active = false;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={mapElement}
      className="location-map"
      role="region"
      aria-label="Map showing Addis Ababa, Ethiopia"
    />
  );
}
