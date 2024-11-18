import React, { useEffect } from "react";

import SocketService from "./services/socketService";
import { store } from "./redux/store";
import { VehicleDashboard } from "./components/vehicle-dashboard/vehicle-dashboard";
import DebugPanel from "./components/debug-panel";

const socketService = new SocketService(store);

const App: React.FC = () => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <>
      <VehicleDashboard />
      <DebugPanel />
    </>
  );
};

export default App;
