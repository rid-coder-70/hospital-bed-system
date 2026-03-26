"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// NEXT_PUBLIC_SOCKET_URL must be set in your Vercel environment variables
// e.g. https://your-backend.railway.app
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

interface BedUpdateEvent {
  hospitalId: string;
  hospitalName: string;
  availableBeds: number;
  availableIcuBeds: number;
  totalBeds: number;
  icuBeds: number;
  wardDetails?: any[];
  lastUpdated: string;
}

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  bedUpdates: BedUpdateEvent[];
  dispatchEvents: any[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  bedUpdates: [],
  dispatchEvents: [],
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [bedUpdates, setBedUpdates] = useState<BedUpdateEvent[]>([]);
  const [dispatchEvents, setDispatchEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!SOCKET_URL) return; // skip if URL not configured
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // polling first — required for Railway proxy
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      path: "/socket.io",
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    socket.on("bedUpdate", (data: BedUpdateEvent) => {
      setBedUpdates((prev) => [data, ...prev].slice(0, 50));
    });

    socket.on("incomingAmbulance", (data: any) => {
      setDispatchEvents((prev) => [data, ...prev].slice(0, 50));
      // Trigger Native Browser Notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("🚨 Emergency Dispatch", {
          body: `Patient: ${data.patient_name} (ETA: ${data.eta_minutes}m) en route!`,
          icon: "/favicon.ico" 
        });
      }
    });

    socket.on("dispatchUpdated", (data: any) => {
      setDispatchEvents((prev) => {
        const idx = prev.findIndex(d => d.id === data.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = data;
          return next;
        }
        return [data, ...prev].slice(0, 50);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connected, bedUpdates, dispatchEvents }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
