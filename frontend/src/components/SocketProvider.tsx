"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface BedUpdateEvent {
  hospitalId: string;
  hospitalName: string;
  availableBeds: number;
  availableIcuBeds: number;
  totalBeds: number;
  icuBeds: number;
  lastUpdated: string;
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  bedUpdates: BedUpdateEvent[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  bedUpdates: [],
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [bedUpdates, setBedUpdates] = useState<BedUpdateEvent[]>([]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("bedUpdate", (data: BedUpdateEvent) => {
      setBedUpdates((prev) => [data, ...prev].slice(0, 50)); // keep last 50
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, bedUpdates }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
