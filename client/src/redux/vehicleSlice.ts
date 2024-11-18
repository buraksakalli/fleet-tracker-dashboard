import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VehicleData {
  plateNumber: string;
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: "moving" | "idle" | "stopped";
  timestamp: string;
}

interface VehiclesState {
  vehicles: Record<string, VehicleData>;
  selectedVehicleId: string | null;
  isConnected: boolean;
  error: string | null;
}

const initialState: VehiclesState = {
  vehicles: {},
  selectedVehicleId: null,
  isConnected: false,
  error: null,
};

export const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    updateVehicleLocation: (state, action: PayloadAction<VehicleData>) => {
      const { plateNumber, ...vehicleData } = action.payload;
      state.vehicles[plateNumber] = {
        ...vehicleData,
        plateNumber,
      };

      console.log("🔄 Updated vehicle:", plateNumber, {
        totalVehicles: Object.keys(state.vehicles).length,
        vehicleData: state.vehicles[plateNumber],
      });
    },
    setSelectedVehicle: (state, action: PayloadAction<string | null>) => {
      state.selectedVehicleId = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateVehicleLocation,
  setSelectedVehicle,
  setConnectionStatus,
  setError,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
