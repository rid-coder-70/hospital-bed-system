# Architecture Documentation

## 1. System Overview

The **AI Hospital Bed Availability System** is designed to provide real-time hospital bed availability, intelligent emergency routing, and seamless ambulance dispatch for healthcare providers and first responders. The platform integrates a modern web frontend, a backend API, an AI routing microservice, and a PostgreSQL database to support reliable, scalable operations.

## 2. High Level Architecture

The system is composed of four primary layers:

1. **Frontend** (Next.js + Tailwind CSS) — provides the user interface for patients, dispatchers, and hospital administrators.
2. **Backend API** (Node.js + Express) — handles business logic, authentication, data access, and real-time messaging.
3. **AI Routing Service** (Python + FastAPI) — evaluates hospital capacity and patient location to recommend best routing.
4. **Database** (PostgreSQL) — stores hospital metadata, bed inventory, ambulance status, and historical events.

`mermaid
flowchart LR
  subgraph UI [Frontend]
    A[Next.js App] -->|REST / WebSocket| B[Backend API]
  end

  subgraph API [Backend]
    B --> C[(PostgreSQL)]
    B --> D[Socket.io Realtime]
    B --> E[AI Routing Service]
  end

  subgraph AI [AI Service]
    E[FastAPI] -->|HTTP| F[Routing Logic]
  end

  subgraph DB [Database]
    C[(PostgreSQL)]
  end
`

## 3. Microservice Architecture

This application follows a microservice-aligned architecture with clearly separated responsibilities:

- **Frontend Service**: Single-page app built with Next.js and Tailwind CSS.
- **Backend API Service**: Express-based REST API with Socket.io for real-time updates.
- **AI Routing Service**: FastAPI service that computes optimal hospital routing using geospatial and capacity data.
- **Database Service**: PostgreSQL storing all persistent state.

Each service can be deployed independently and scaled based on load. Services communicate primarily via HTTP and WebSocket.

## 4. Component Diagram

`mermaid
flowchart TD
  UI[User Interface (Next.js)] -->|REST API| API[Backend API (Express)]
  API -->|SQL Queries| DB[(PostgreSQL)]
  API -->|WebSocket| WS[Socket.io]
  API -->|HTTP| AI[AI Routing Service (FastAPI)]
  AI -->|Read Only| DB
`

## 5. Data Flow

1. A user requests hospital availability via the web UI.
2. The UI calls the Backend API (/beds/availability).
3. The Backend queries PostgreSQL for current bed inventory.
4. For routing requests, the Backend forwards the request to the AI Routing Service.
5. The AI service returns a ranked list of hospitals; the Backend responds to the UI.
6. Real-time updates (bed changes, ambulance status) are pushed via Socket.io to connected clients.

## 6. Technology Stack

- **Frontend**: Next.js, Tailwind CSS, Leaflet/Mapbox
- **Backend**: Node.js, Express.js, Socket.io
- **AI Service**: Python, FastAPI, geospatial algorithms
- **Database**: PostgreSQL
- **DevOps**: Docker, Vercel, Railway

## 7. Scalability Design

- **Frontend**: Deploy to CDN-backed platforms (Vercel) for horizontal scaling.
- **Backend**: Stateless API instances behind a load balancer, with connection pooling for PostgreSQL.
- **AI Service**: Scale separately based on routing request volume; cache frequent routing results.
- **Database**: Use read replicas for analytics; partition large tables and use connection pooling.
- **Realtime**: Socket.io can be scaled using Redis as a message broker for multiple API instances.

## 8. Security Considerations

- Use TLS (HTTPS) for all external communication.
- Authenticate users and APIs using JWTs or OAuth.
- Validate and sanitize all input data at the API boundary.
- Apply role-based access control (RBAC) for admin and dispatcher features.
- Protect database credentials using secrets management and environment variables.
- Rate-limit sensitive endpoints to mitigate abuse.
