# System Design & Core Mechanisms

![System Design](design.png)


> [!TIP]
> To ensure absolute reliability in life-critical medical scenarios, HealthBed AI is engineered using modern, fail-safe system design principles. This document outlines the core technical mechanisms powering the framework.

---

## 1. Pessimistic Concurrency Control
*Preventing Resource Overbooking*

In a live-dispatch environment, multiple dispatchers might attempt to claim the exact same "last available bed" concurrently. Traditional SQL `SELECT` followed by `UPDATE` workflows suffer from race conditions resulting in critical over-booking.

### The Locking Flow Lifecycle

```mermaid
sequenceDiagram
    participant D1 as Dispatcher 1
    participant D2 as Dispatcher 2
    participant DB as PostgreSQL Engine
    participant App as Node.js API

    rect rgb(240, 249, 255)
      Note over D1, App: Dispatch Request 1 Initiated
      D1->>App: POST /api/dispatches
      App->>DB: BEGIN TRANSACTION (FOR UPDATE)
      Note right of DB: Locked Bed (ID: 101)
    end

    rect rgb(254, 242, 242)
      Note over D2, App: Dispatch Request 2 Initiated
      D2->>App: POST /api/dispatches
      App->>DB: SELECT ... FOR UPDATE (Blocked)
      Note right of DB: D2 Waits for Lock...
    end

    rect rgb(240, 253, 244)
      DB-->>App: Bed Count: 1 (Confirmed)
      App->>DB: UPDATE: available_beds = 0
      App->>DB: COMMIT
      Note right of DB: Lock Released
      App-->>D1: 200 OK (Success)
    end

    rect rgb(254, 242, 242)
      DB-->>App: Bed Count: 0 (Lock acquired by D2)
      App-->>D2: 409 Conflict (Capacity Exhausted)
    end
```

> [!NOTE]
> Because of the strict `FOR UPDATE` clause, PostgreSQL mathematically guarantees that any concurrent requests targeting a shared hospital record queue at the database level and process sequentially.

---

## 2. Real-Time WebSockets Engine
*Eliminating HTTP Polling Latency*

For true live situational awareness, standard HTTP polling (e.g., refreshing every 5 seconds) introduces unacceptable latency and resource overhead for emergency operations. HealthBed AI integrates `Socket.io` directly into the Node.js layer to establish persistent TCP bi-directional tunnels with all connected UI clients.

### WebSocket Topology

```mermaid
graph LR
    %% Styles
    classDef main fill:#6366F1,stroke:#4338CA,stroke-width:2px,color:#fff;

    Server[Node.js Hub]:::main
    WSS["WebSocket Event Bus"]:::main

    Server --> |"Broadcast: 'bedUpdate'"| WSS
    WSS --> Client1["Public Patient Client"]
    WSS --> Client2["Medical Command Center"]

    Server --> |"Targeted Alert: 'incomingAmbulance'"| WSS
    WSS --> TargetHosp["Target Hospital Administrator"]
```

---

## 3. Client-Side Rendering vs SSR
*Dynamic Map Loading & Injection*

The Public Directory features a live, interactive map powered by `Leaflet` and `react-leaflet`. Since Leaflet directly manipulates the browser's `window` and `document` objects, it conflicts with Next.js Server-Side Rendering (SSR).

**Implementation:**
The system uses Next.js `dynamic` imports with `ssr: false` to guarantee the Map engine only initializes after the React lifecycle reaches the client environment.

```tsx
import dynamic from 'next/dynamic'

// Defers loading the heavier mapping library and prevents SSR hydration crashes
const HospitalMapClient = dynamic(() => import('./HospitalMapClient'), {
  ssr: false,
  loading: () => <MapSkeletonLoader />
});
```