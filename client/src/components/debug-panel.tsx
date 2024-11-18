import { useState, useEffect } from "react";

import { useAppSelector } from "../hooks/useRedux";

const DebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const { vehicles, isConnected, error } = useAppSelector(
    (state) => state.vehicles
  );
  const [lastEvent, setLastEvent] = useState<string>("");

  useEffect(() => {
    const handleSocketEvent = (event: MessageEvent) => {
      setLastEvent(JSON.stringify(event.data));
    };

    window.addEventListener("message", handleSocketEvent);
    return () => window.removeEventListener("message", handleSocketEvent);
  }, []);

  if (!isVisible) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded"
        onClick={() => setIsVisible(true)}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border p-4 rounded shadow-lg max-w-md">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <button className="text-gray-500" onClick={() => setIsVisible(false)}>
          Hide
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <p>
          Connection Status:{" "}
          <span className={isConnected ? "text-green-500" : "text-red-500"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </p>
        <p>Vehicle Count: {Object.keys(vehicles).length}</p>
        <p>Last Error: {error || "None"}</p>
        <div className="mt-2">
          <p className="font-bold">Vehicles:</p>
          <div className="max-h-32 overflow-auto">
            {Object.entries(vehicles).map(([plateNumber, data]) => (
              <div key={plateNumber} className="text-xs mt-1">
                {plateNumber}: {data.status} - {data.speed}km/h
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <p className="font-bold">Last Event:</p>
          <div className="text-xs break-all">{lastEvent}</div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
