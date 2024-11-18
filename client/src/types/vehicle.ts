export interface Location {
  lat: number;
  lng: number;
}

export interface VehicleData {
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: "moving" | "idle" | "stopped";
  timestamp: string;
  plateNumber?: string;
}

export interface VehiclesState {
  vehicles: Record<string, VehicleData>;
  selectedVehicleId: string | null;
  isConnected: boolean;
  error: string | null;
}
