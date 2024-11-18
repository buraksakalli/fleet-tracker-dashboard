import React, { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { setSelectedVehicle } from "../../redux/vehicleSlice";
import { VehicleData } from "@/types/vehicle";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string;

const DUBAI_CENTER = {
  lng: 55.356249,
  lat: 25.196987,
};

interface MarkerRefs {
  [key: string]: {
    marker: mapboxgl.Marker;
    element: HTMLDivElement;
    popup: mapboxgl.Popup;
  };
}

export const VehicleMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<MarkerRefs>({});
  const dispatch = useAppDispatch();

  const { vehicles, selectedVehicleId } = useAppSelector(
    (state) => state.vehicles
  );

  const createPopupContent = useCallback(
    (plateNumber: string, vehicle: VehicleData) => {
      return `
      <div class="p-3">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-gray-900">${plateNumber}</h3>
          <button 
            class="text-gray-500 hover:text-gray-700 focus:outline-none" 
            onclick="document.dispatchEvent(new CustomEvent('closePopup', {detail: '${plateNumber}'}))">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="space-y-1">
          <p class="text-sm">
            <span class="text-gray-500">Status:</span> 
            <span class="font-medium ${
              vehicle.status === "moving"
                ? "text-green-600"
                : vehicle.status === "idle"
                  ? "text-yellow-600"
                  : "text-red-600"
            }">${vehicle.status}</span>
          </p>
          <p class="text-sm">
            <span class="text-gray-500">Speed:</span> 
            <span class="font-medium text-gray-900">${vehicle.speed} km/h</span>
          </p>
        </div>
      </div>
    `;
    },
    []
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [DUBAI_CENTER.lng, DUBAI_CENTER.lat],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    document.addEventListener("closePopup", (() => {
      dispatch(setSelectedVehicle(null));
    }) as EventListener);

    return () => {
      Object.values(markers.current).forEach(({ marker }) => marker.remove());
      map.current?.remove();
      document.removeEventListener("closePopup", (() => {}) as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    Object.entries(vehicles).forEach(([plateNumber, vehicle]) => {
      if (!markers.current[plateNumber]) {
        const el = document.createElement("div");
        el.className = "vehicle-marker";

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: false,
          className: "vehicle-popup",
        }).setHTML(createPopupContent(plateNumber, vehicle));

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "center",
        }).setLngLat([vehicle.lng, vehicle.lat]);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          dispatch(setSelectedVehicle(plateNumber));
        });

        if (map.current) {
          marker.addTo(map.current);
        }

        markers.current[plateNumber] = {
          marker,
          element: el,
          popup,
        };
      }

      const markerRef = markers.current[plateNumber];
      const { marker, element, popup } = markerRef;

      marker.setLngLat([vehicle.lng, vehicle.lat]);

      element.className = `vehicle-marker ${selectedVehicleId === plateNumber ? "selected" : ""}`;
      element.style.transform = `rotate(${vehicle.angle}deg)`;

      popup.setHTML(createPopupContent(plateNumber, vehicle));

      if (selectedVehicleId === plateNumber) {
        if (map.current) {
          popup.setLngLat([vehicle.lng, vehicle.lat]).addTo(map.current);
        }
      } else {
        popup.remove();
      }
    });

    Object.keys(markers.current).forEach((plateNumber) => {
      if (!vehicles[plateNumber]) {
        markers.current[plateNumber].popup.remove();
        markers.current[plateNumber].marker.remove();
        delete markers.current[plateNumber];
      }
    });
  }, [vehicles, selectedVehicleId, createPopupContent]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};
