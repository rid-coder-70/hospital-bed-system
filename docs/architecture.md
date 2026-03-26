# System Architecture & Data Flow

![System Architecture](architecture.png)


> [!NOTE]
> HealthBed AI is built on a scalable, real-time event-driven architecture designed for high availability and low-latency updates across all connected clients.

---

## High-Level Architecture Diagram

```mermaid
graph TD
    %% Define Styles
    classDef client fill:#38BDF8,stroke:#0369A1,stroke-width:2px,color:#fff;
    classDef server fill:#6366F1,stroke:#4338CA,stroke-width:2px,color:#fff;
    classDef logic fill:#F472B6,stroke:#BE185D,stroke-width:2px,color:#fff;
    classDef storage fill:#1E1B4B,stroke:#312E81,stroke-width:2px,color:#fff;

    %% Core Components
    Patient[Public Directory / Map]:::client
    HospitalAdmin[Hospital Dashboard]:::client
    Dispatcher[System Dispatcher]:::client

    %% Backend Services
    LoadBalancer[Gateway / Load Balancer]:::server
    NodeServer[Node.js / Express Core]:::server
    AIService[Python FastAPI Routing Engine]:::logic

    %% Real-Time Events
    WSS["WebSocket Event Bus (Socket.io)"]:::server

    %% Data Layer
    Postgres[("PostgreSQL Database")]:::storage

    %% Relationships
    Patient & HospitalAdmin & Dispatcher --> |REST| LoadBalancer
    LoadBalancer --> NodeServer
    
    Patient & HospitalAdmin & Dispatcher <--> |Real-Time| WSS
    WSS <--> NodeServer

    NodeServer <--> |Calculation| AIService
    NodeServer <--> |pg pool| Postgres

    %% Subgraphs for visual grouping
    subgraph "UI & Delivery Layer"
        Patient
        HospitalAdmin
        Dispatcher
    end

    subgraph "Processing Layer"
        LoadBalancer
        NodeServer
        AIService
        WSS
    end

    subgraph "Persistence Layer"
        Postgres
    end
```

---

## Core Operational Workflows

### 1. Real-Time Bed Availability Sync
1. **Hospital Administrator** updates bed capacities.
2. The mutation is submitted to the Node.js backend.
3. The backend updates the respective hospital record in PostgreSQL.
4. The Node.js controller triggers the `Socket.io` instance to emit a `bedUpdate` event.
5. **Result:** All connected clients receive the WebSocket event and the React state instantly synchronizes.

### 2. Autonomous Ambulance Dispatch & Reservation
> [!IMPORTANT]
> This flow utilizes strict database-level locking to prevent race conditions during emergencies.

1. **Dispatcher** initiates a dispatch sequence from the live map.
2. Request is dispatched to the backend `POST /api/dispatches`.
3. Backend initiates a **PostgreSQL Transaction**.
4. A pessimistic `SELECT ... FOR UPDATE` query locks the specific hospital row.
5. `Socket.io` fires `incomingAmbulance` alert to the target hospital.
6. **Result:** The Administrator's dashboard reflects an incoming critical alert.
