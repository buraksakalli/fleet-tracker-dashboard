import { Socket, io } from "socket.io-client";
import { Store } from "@reduxjs/toolkit";
import {
  updateVehicleLocation,
  setConnectionStatus,
  setError,
} from "../redux/vehicleSlice";

interface VehicleData {
  lat: number;
  lng: number;
  angle: number;
  speed: number;
  status: "moving" | "idle" | "stopped";
  timestamp: string;
}

interface VehicleUpdate {
  plate: string;
  data: VehicleData;
}

class SocketService {
  private socket: Socket | null = null;
  private store: Store;
  private vehicles = [
    "DXB-CX-36357",
    "DXB-DX-36359",
    "DXB-IX-36356",
    "DXB-DX-36353",
    "DXB-DX-36357",
    "DXB-AX-36352",
    "DXB-IX-36360",
    "DXB-XX-36353",
    "DXB-CX-36358",
    "DXB-BX-36355",
  ];

  constructor(store: Store) {
    this.store = store;
  }

  connect(): void {
    console.log(
      "Attempting to connect to:",
      import.meta.env.VITE_SOCKET_SERVER_URL
    );

    this.socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("🟢 Socket Connected!", {
        id: this.socket?.id,
        connected: this.socket?.connected,
      });
      this.store.dispatch(setConnectionStatus(true));

      // Subscribe to all vehicles once connected
      this.subscribeToAllVehicles();
    });

    this.socket.on("disconnect", () => {
      console.log("🔴 Socket Disconnected");
      this.store.dispatch(setConnectionStatus(false));
    });

    this.socket.on("connect_error", (error) => {
      console.error("⚠️ Connection Error:", error);
      this.store.dispatch(setError(error.message));
    });

    // Listen for vehicle data updates
    this.socket.on("vehicleData", (update: VehicleUpdate) => {
      console.log("📍 Vehicle update received:", update);

      this.store.dispatch(
        updateVehicleLocation({
          plateNumber: update.plate,
          ...update.data,
        })
      );
    });
  }

  subscribeToAllVehicles(): void {
    this.vehicles.forEach((plate) => {
      this.socket?.emit("subscribeToVehicle", { plate });
      console.log(`📡 Subscribed to vehicle: ${plate}`);
    });
  }

  unsubscribeFromAllVehicles(): void {
    this.vehicles.forEach((plate) => {
      this.socket?.emit("unsubscribeFromVehicle", { plate });
      console.log(`🚫 Unsubscribed from vehicle: ${plate}`);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.unsubscribeFromAllVehicles();
      this.socket.disconnect();
      console.log("👋 Disconnected from socket server");
    }
  }
}

export default SocketService;
