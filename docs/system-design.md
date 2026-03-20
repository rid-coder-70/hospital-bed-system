# System Design & Core Mechanisms

![System Design Visualization](design.png)

To ensure absolute reliability in life-critical medical scenarios, HealthBed AI is engineered using modern, fail-safe system design principles. This document outlines the core technical mechanisms powering the framework.

---

## 🔒 1. Pessimistic Concurrency Control (Double-Booking Prevention)

In a live-dispatch environment, two ambulance dispatchers might attempt to claim the exact same "last available bed" at the exact same millisecond. Traditional `SELECT` -> `UPDATE` flows suffer from race conditions resulting in catastrophic over-booking.

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
*Because of `FOR UPDATE`, Postgres mathematically guarantees that any concurrent requests targeting that hospital queue up at the database level and process sequentially.*

---

## ⚡ 2. Real-Time WebSockets Engine (Socket.io)

For true live situational awareness, standard HTTP polling (e.g., refreshing every 5 seconds) is far too slow and resource-heavy for emergency vehicles and command centers. 

HealthBed AI integrates `Socket.io` directly into the Node.js layer to establish persistent TCP bi-directional tunnels with all connected UI clients.

**Event Topology:**
- **`bedUpdate` (Global Broadcast):** Emitted to all clients. When any admin updates a bed count, the exact new inventory array is blasted out. The Next.js frontend catches this and updates the React state gracefully across the `HospitalMap` and the public `Card Grid`.
- **`incomingAmbulance` (Targeted Emit):** Emitted **only** to the specific hospital receiving the dispatch. This triggers the native OS push notifications and UI alerts securely.

*(To scale this across multiple backend instances horizontally, a `Redis adapter` can smoothly slip into the Socket.io construct later).*

---

## 🎨 3. Client-Side Rendering vs SSR (Dynamic Map Loading)

The Public Directory features a live, interactive map powered by `Leaflet` and `react-leaflet`. Since Leaflet directly manipulates the browser's `window` and `document` objects, it inherently clashes with Next.js's Server-Side Rendering (SSR).

**Implementation:**
The system uses Next.js `dynamic` imports with `ssr: false` to guarantee the Map engine only boots up once the React lifecycle reaches the client browser.

```tsx
import dynamic from 'next/dynamic'

// Defers loading the heavy mapping library and prevents SSR hydration crashes
const HospitalMapClient = dynamic(() => import('./HospitalMapClient'), {
  ssr: false,
  loading: () => <MapSkeletonLoader />
})
```

---

## 📊 4. Schema-Less Dynamic Wards (JSONB)

Hospitals frequently open temporary wards (e.g., Disaster Relief Tents, Overflow Units). Writing hard-coded columns exclusively for "Maternity" or "Burn Unit" is extremely rigid.

**Implementation:**
The `hospitals` table features a `ward_details` column strictly typed as `JSONB`.

```sql
ALTER TABLE hospitals ADD COLUMN ward_details JSONB DEFAULT '[]'::jsonb;
```

This effectively allows Hospital Admins to type in *any* ward name and *any* capacity count on the fly. The Node.js backend writes the Array-of-Objects directly into the Postgres binary column, giving us NoSQL-like flexibility inside a strict relational foundation.