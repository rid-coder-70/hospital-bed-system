# 🧠 System Design & Core Mechanisms

> [!TIP]
> To ensure absolute reliability in life-critical medical scenarios, HealthBed AI is engineered using modern, fail-safe system design principles. This document outlines the core technical mechanisms powering the framework.

---

## 🔒 1. Pessimistic Concurrency Control
*Preventing Double-Booking the Last Bed*

In a live-dispatch environment, two ambulance dispatchers might attempt to claim the exact same "last available bed" at the exact same millisecond. Traditional SQL `SELECT` -> `UPDATE` flows suffer from race conditions resulting in catastrophic over-booking.

**Implementation:**
HealthBed AI tackles this at the database engine level via **PostgreSQL Pessimistic Locking** (`FOR UPDATE`).

```js
// Backend: src/routes/dispatches.js
await db.query('BEGIN');

const hRes = await db.query(
  'SELECT available_beds, available_icu_beds FROM hospitals WHERE id = $1 FOR UPDATE',
  [hospitalId]
);

// If available counts are <= 0 here, the transaction gracefully rolls back
// ensuring that no virtual "overdrafting" of beds ever occurs.

await db.query('UPDATE hospitals SET available_beds = available_beds - 1 ...');
await db.query('COMMIT');
```

> [!NOTE]
> Because of the strict `FOR UPDATE` clause, Postgres mathematically guarantees that any concurrent requests targeting that hospital queue up at the database level and process sequentially.

---

## 📡 2. Real-Time WebSockets Engine
*Eliminating HTTP Polling Latency*

For true live situational awareness, standard HTTP polling (e.g., refreshing every 5 seconds) is far too slow and resource-heavy for emergency vehicles and command centers. HealthBed AI integrates `Socket.io` directly into the Node.js layer to establish persistent TCP bi-directional tunnels with all connected UI clients.

### Event Topology:
- **`bedUpdate` (Global Broadcast):** Emitted to all clients. When any admin updates a bed count, the exact new inventory array is blasted out. 
- **`incomingAmbulance` (Targeted Emit):** Emitted **only** to the specific hospital receiving the dispatch. This triggers the native OS push notifications and UI alerts securely without leaking dispatch info to unauthorized sockets.

*(To scale this across multiple backend instances horizontally, a `Redis adapter` can smoothly slip into the Socket.io construct).*

---

## 🎨 3. Client-Side Rendering vs SSR
*Dynamic Map Loading & Injection*

The Public Directory features a live, interactive map powered by `Leaflet` and `react-leaflet`. Since Leaflet directly manipulates the browser's `window` and `document` objects, it inherently clashes with Next.js's Server-Side Rendering (SSR).

**Implementation:**
The system uses Next.js `dynamic` imports with `ssr: false` to guarantee the Map engine only boots up once the React lifecycle reaches the client browser.

```tsx
import dynamic from 'next/dynamic'

// Defers loading the heavy mapping library and prevents SSR hydration crashes
const HospitalMapClient = dynamic(() => import('./HospitalMapClient'), {
  ssr: false,
  loading: () => <MapSkeletonLoader />
});
```