## AI Hospital Bed Availability System

This document provides a technical design for the **AI Hospital Bed Availability System**, focusing on providing real-time bed availability, emergency routing, and ambulance dispatch with a scalable and secure architecture.

---

## 1. Problem Statement

During emergencies, patients and first responders struggle to locate hospitals with available beds and coordinate rapid transport. Manual communication and fragmented systems lead to delays and inefficient resource utilization.

This system aims to centralize bed availability data, provide real-time visibility, and recommend optimized routing for ambulances.

---

## 2. System Requirements

### Functional Requirements
- Track hospital bed and ICU availability in real time.
- Allow hospitals to update bed inventory.
- Provide patients and dispatchers with the nearest available hospital.
- Support ambulance request creation and routing suggestions.
- Offer dashboard views for admins and hospital staff.

### Non-Functional Requirements
- Low latency for real-time updates.
- High availability and fault tolerance.
- Secure access controls for sensitive health data.
- Scalability to support increasing hospital and ambulance volume.

---

## 3. Functional Requirements

- **Hospital Management:** CRUD operations for hospital records.
- **Bed Inventory:** Update and query bed availability.
- **Routing:** Compute optimal hospital choices based on distance, bed availability, and capacity.
- **Ambulance Dispatch:** Request ambulances and track status.
- **Realtime Updates:** Broadcast bed and ambulance status changes via WebSockets.

---

## 4. Non-Functional Requirements

- **Performance:** API responses within 200ms for most operations.
- **Reliability:** 99.9% uptime across services.
- **Security:** Enforce HTTPS, authentication, and RBAC.
- **Maintainability:** Modular codebase with clear service boundaries.
- **Observability:** Logging, metrics, and alerting for operational health.

---

## 5. High Level System Design

The system is composed of the following main services:

- **Frontend** (Next.js): UI for patients, dispatchers, and admins.
- **Backend API** (Node.js + Express): Core business logic, data access, and WebSocket gateway.
- **AI Routing Service** (Python + FastAPI): Computes routing decisions and hospital recommendations.
- **Database** (PostgreSQL): Persistent storage for hospitals, beds, ambulances, and events.

\`\`\`mermaid
flowchart LR
  UI[Next.js Frontend] -->|REST / WebSocket| API[Node.js + Express API]
  API -->|SQL| DB[(PostgreSQL)]
  API -->|HTTP| AI[Python FastAPI Routing]
  API -->|WebSocket| WS[Socket.io Clients]
\`\`\`

---

## 6. Database Design

### Key Entities

- **Hospital**
  - id (UUID)
  - name
  - address
  - location (latitude, longitude)
  - totalBeds
  - availableBeds
  - icuBeds
  - availableIcuBeds
  - contact info
  - lastUpdated

- **AmbulanceRequest**
  - id (UUID)
  - patientLocation
  - requiredIcu
  - priority
  - status (pending, dispatched, completed)
  - createdAt
  - updatedAt

- **Ambulance**
  - id (UUID)
  - status (available, busy)
  - currentLocation
  - lastUpdated

- **BedUpdateEvent**
  - id (UUID)
  - hospitalId
  - availableBeds
  - availableIcuBeds
  - timestamp

### Sample Schema

\`\`\`sql
CREATE TABLE hospitals (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  total_beds INT NOT NULL,
  available_beds INT NOT NULL,
  icu_beds INT NOT NULL,
  available_icu_beds INT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

---

## 7. API Design

The API follows RESTful patterns. Key endpoints include:

- `GET /hospitals` — list hospitals
- `GET /hospitals/:id` — hospital details
- `POST /hospital` — add hospital
- `PUT /beds/update` — update bed availability
- `GET /beds/availability` — summary of beds
- `POST /ambulance/request` — create ambulance request
- `GET /ambulance/nearest` — nearest ambulance

---

## 8. AI Routing Logic

The AI service ranks candidate hospitals using a weighted score based on:

- **Distance** from patient location (lower is better)
- **Available bed count** (higher is better)
- **ICU availability** (higher is better for critical cases)
- **Hospital capacity utilization** (lower utilization is preferred)

### Routing Pipeline
1. Backend requests routing decision by posting patient location and requirements to the AI service.
2. AI service fetches current hospital availability from PostgreSQL.
3. The routing algorithm scores candidates and returns a ranked list.
4. Backend responds to the client with recommended hospitals.

---

## 9. Real-time Data Handling using WebSockets

WebSocket (Socket.io) enables:

- Real-time bed availability push updates.
- Ambulance status and location streaming.
- Live dashboard updates for dispatchers.

### Flow
1. Client connects to backend via Socket.io.
2. Backend maintains socket sessions and broadcasts updates when bed or ambulance data changes.
3. Emitted events include `bedUpdate`, `ambulanceUpdate`, and `routingUpdate`.

---

## 10. Scalability and Load Handling

- **Horizontal scaling**: Deploy multiple instances of backend and AI service behind a load balancer.
- **Database scaling**: Use read replicas for analytics and heavy-read endpoints.
- **Caching**: Cache frequent queries (e.g., hospital list) using Redis.
- **WebSocket scaling**: Use Redis adapter for Socket.io to coordinate events across instances.
- **Batch updates**: Buffer high-frequency bed updates and apply in batches to reduce DB load.

---

## 11. Security and Authentication

- Use **HTTPS** for all communication.
- Authenticate and authorize API calls using **JWT** or **OAuth2**.
- Validate inputs and enforce rate limits.
- Store secrets (DB creds, API keys) in environment variables or secret storage.
- Apply least privilege for database user accounts.

---

## 12. Future Improvements

- Add **role-based dashboards** (hospital admin vs dispatcher vs public).
- Integrate real traffic and routing data (e.g., Google Maps / OpenStreetMap routing).
- Implement **machine learning** models to predict bed turnover.
- Add **mobile apps** for ambulance crews.
- Support **multi-region deployment** with data replication.