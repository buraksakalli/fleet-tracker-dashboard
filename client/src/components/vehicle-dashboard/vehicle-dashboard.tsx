import React, { useState } from "react";

import { CarIcon, WifiIcon, Menu, X, ChevronLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { setSelectedVehicle } from "../../redux/vehicleSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";

import { VehicleData } from "@/types/vehicle";
import { VehicleMap } from "../vehicle-map/vehicle-map";

export const VehicleDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const { vehicles, selectedVehicleId, isConnected } = useAppSelector(
    (state) => state.vehicles
  );

  const selectedVehicle = selectedVehicleId
    ? vehicles[selectedVehicleId]
    : null;
  const vehicleList = Object.entries(vehicles);

  const handleVehicleSelect = (plateNumber: string) => {
    dispatch(setSelectedVehicle(plateNumber));
    setDetailsOpen(true);
    setSidebarOpen(false);
  };

  const calculateAverageSpeed = (vehicle: VehicleData): string => {
    if (!vehicle?.speed) return "-- km/h";
    return `${Math.round(vehicle.speed)} km/h`;
  };

  return (
    <div className="flex flex-col h-screen relative">
      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="m-4" variant="destructive">
          <WifiIcon className="h-4 w-4" />
          <AlertDescription>
            Disconnected from server. Attempting to reconnect...
          </AlertDescription>
        </Alert>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
        <h1 className="text-lg font-bold">Vehicle Fleet</h1>
        {selectedVehicle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDetailsOpen(!isDetailsOpen)}
          >
            <CarIcon />
          </Button>
        )}
      </div>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <div
          className={`
            absolute lg:relative
            w-80 h-full bg-white shadow-lg lg:shadow-none
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            z-20
          `}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h2 className="text-xl font-bold hidden lg:block">
                Vehicle Fleet
              </h2>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                {vehicleList.length} vehicles active
              </p>
              <div className="space-y-2">
                {vehicleList.map(([plateNumber, vehicle]) => (
                  <Card
                    key={plateNumber}
                    className={`cursor-pointer transition-colors ${
                      selectedVehicleId === plateNumber
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleVehicleSelect(plateNumber)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <CarIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="font-medium">{plateNumber}</div>
                          <div className="text-sm text-gray-500">
                            {vehicle.status} - {calculateAverageSpeed(vehicle)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <VehicleMap />
        </div>

        {selectedVehicle && (
          <div
            className={`
              absolute lg:relative
              w-80 h-full bg-white shadow-lg lg:shadow-none
              transition-transform duration-300 ease-in-out
              ${isDetailsOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              right-0
              z-20
            `}
          >
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDetailsOpen(false)}
                  >
                    <ChevronLeft />
                  </Button>
                  <h3 className="font-bold">Vehicle Details</h3>
                  <div className="w-8" /> {/* Spacer for alignment */}
                </div>

                <h2 className="text-xl font-bold hidden lg:block mb-4">
                  Vehicle Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Plate Number
                    </label>
                    <div className="font-medium">{selectedVehicleId}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="font-medium">{selectedVehicle.status}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Speed</label>
                    <div className="font-medium">
                      {calculateAverageSpeed(selectedVehicle)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <div className="font-medium">
                      Lat: {selectedVehicle.lat.toFixed(4)}
                      <br />
                      Lng: {selectedVehicle.lng.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Last Updated
                    </label>
                    <div className="font-medium">
                      {new Date(selectedVehicle.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {(isSidebarOpen || isDetailsOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => {
            setSidebarOpen(false);
            setDetailsOpen(false);
          }}
        />
      )}
    </div>
  );
};
