# Vehicle Fleet Tracking System

A real-time vehicle fleet tracking system built with React, TypeScript, and Mapbox GL JS. This application allows users to monitor a fleet of vehicles in real-time, showing their positions, status, and movement on an interactive map.

## Features

- 🚗 Real-time vehicle tracking
- 🗺️ Interactive map with vehicle markers
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔄 Live updates via WebSocket
- 📊 Vehicle status monitoring
- 🎯 Vehicle selection and detailed information
- 🧭 Direction indicators for vehicles
- 💫 Smooth animations and transitions

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Socket.IO Client
- Mapbox GL JS
- TailwindCSS
- shadcn/ui Components

## Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- npm
- A Mapbox account and access token

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd vehicle-fleet-tracking
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the project root and add your environment variables:

```env
VITE_SOCKET_SERVER_URL=http://localhost:3000
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/
│   ├── vehicle-dashboard/
│   │   └── vehicle-dashboard.tsx
│   ├── vehicle-map/
│   │   └── vehicle-map.tsx
│   └── ui/
├── redux/
│   ├── store.ts
│   └── vehicleSlice.ts
├── services/
│   └── socketService.ts
├── types/
│   └── vehicle.ts
├── App.tsx
└── main.tsx
```

## Application Flow

1. The application connects to a WebSocket server on initialization
2. Real-time vehicle updates are received through the socket connection
3. Vehicle positions are displayed on the map with directional indicators
4. Users can select vehicles to view detailed information
5. The map updates in real-time as vehicle positions change

## Components

### VehicleDashboard

- Main container component
- Handles layout and responsiveness
- Manages sidebar and detail panel states

### VehicleMap

- Displays the interactive map
- Manages vehicle markers and popups
- Handles user interactions with the map

## State Management

Redux Toolkit is used for state management with the following structure:

```typescript
interface VehiclesState {
  vehicles: Record<string, VehicleData>;
  selectedVehicleId: string | null;
  isConnected: boolean;
  error: string | null;
}
```

## WebSocket Events

The application listens for the following socket events:

- `vehicleData`: Receives vehicle position updates
- `connect`: Handles successful connections
- `disconnect`: Manages disconnection states
- `error`: Handles error states
