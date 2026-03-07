## AI Hospital Bed Availability System

This document describes the REST API for the AI Hospital Bed Availability System. The backend is built with **Node.js + Express** and uses **PostgreSQL** for persistence.

---

## Authentication

> **Note:** Authentication is not included in this example but should be added in production (e.g., JWT, OAuth2).

---

## Endpoints

---

### GET /hospitals

- **Description:** Retrieve a list of registered hospitals and their current bed availability.
- **Request Body:** None

#### Example Request

\`\`\`http
GET /hospitals HTTP/1.1
Host: api.example.com
Accept: application/json
\`\`\`

#### Example Response

\`\`\`json
{
  "data": [
    {
      "id": "1",
      "name": "General Hospital",
      "location": { "lat": 40.7128, "lng": -74.0060 },
      "totalBeds": 200,
      "availableBeds": 15,
      "icuBeds": 40,
      "availableIcuBeds": 4,
      "lastUpdated": "2026-03-08T12:28:00Z"
    }
  ]
}
\`\`\`

#### Error Codes

- `500` – Internal server error

---

### GET /hospitals/:id

- **Description:** Retrieve details for a single hospital, including bed availability.
- **Request Parameters:** `id` (hospital identifier)
- **Request Body:** None

#### Example Request

\`\`\`http
GET /hospitals/1 HTTP/1.1
Host: api.example.com
Accept: application/json
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "id": "1",
    "name": "General Hospital",
    "address": "123 Main St, Example City",
    "location": { "lat": 40.7128, "lng": -74.0060 },
    "totalBeds": 200,
    "availableBeds": 15,
    "icuBeds": 40,
    "availableIcuBeds": 4,
    "contact": {
      "phone": "+1-555-123-4567",
      "email": "contact@generalhospital.example"
    },
    "lastUpdated": "2026-03-08T12:28:00Z"
  }
}
\`\`\`

#### Error Codes

- `404` – Hospital not found
- `500` – Internal server error

---

### POST /hospital

- **Description:** Create a new hospital record.
- **Request Body (JSON):**

\`\`\`json
{
  "name": "General Hospital",
  "address": "123 Main St, Example City",
  "location": { "lat": 40.7128, "lng": -74.0060 },
  "totalBeds": 200,
  "availableBeds": 200,
  "icuBeds": 40,
  "availableIcuBeds": 40,
  "contact": {
    "phone": "+1-555-123-4567",
    "email": "contact@generalhospital.example"
  }
}
\`\`\`

#### Example Request

\`\`\`http
POST /hospital HTTP/1.1
Host: api.example.com
Content-Type: application/json

{ ... }
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "id": "2",
    "name": "General Hospital",
    "createdAt": "2026-03-08T12:30:00Z"
  }
}
\`\`\`

#### Error Codes

- `400` – Invalid request payload
- `409` – Hospital already exists
- `500` – Internal server error

---

### PUT /beds/update

- **Description:** Update bed availability for a hospital.
- **Request Body (JSON):**

\`\`\`json
{
  "hospitalId": "1",
  "availableBeds": 12,
  "availableIcuBeds": 3,
  "updatedAt": "2026-03-08T12:35:00Z"
}
\`\`\`

#### Example Request

\`\`\`http
PUT /beds/update HTTP/1.1
Host: api.example.com
Content-Type: application/json

{ ... }
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "hospitalId": "1",
    "availableBeds": 12,
    "availableIcuBeds": 3,
    "updatedAt": "2026-03-08T12:35:00Z"
  }
}
\`\`\`

#### Error Codes

- `400` – Invalid request payload
- `404` – Hospital not found
- `500` – Internal server error

---

### GET /beds/availability

- **Description:** Get summarized bed availability across all hospitals.
- **Request Body:** None

#### Example Request

\`\`\`http
GET /beds/availability HTTP/1.1
Host: api.example.com
Accept: application/json
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "totalBeds": 2000,
    "availableBeds": 325,
    "totalIcuBeds": 400,
    "availableIcuBeds": 47,
    "lastUpdated": "2026-03-08T12:40:00Z"
  }
}
\`\`\`

#### Error Codes

- `500` – Internal server error

---

### POST /ambulance/request

- **Description:** Create an ambulance request (patient pickup request) and return suggested hospitals.
- **Request Body (JSON):**

\`\`\`json
{
  "patientLocation": { "lat": 40.7128, "lng": -74.0060 },
  "requiredIcu": true,
  "priority": "high"
}
\`\`\`

#### Example Request

\`\`\`http
POST /ambulance/request HTTP/1.1
Host: api.example.com
Content-Type: application/json

{ ... }
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "requestId": "req_12345",
    "suggestedHospitals": [
      {
        "id": "1",
        "name": "General Hospital",
        "distanceKm": 3.2,
        "estimatedTimeMin": 7,
        "availableBeds": 12,
        "availableIcuBeds": 3
      },
      {
        "id": "2",
        "name": "City Care Center",
        "distanceKm": 5.5,
        "estimatedTimeMin": 12,
        "availableBeds": 40,
        "availableIcuBeds": 10
      }
    ]
  }
}
\`\`\`

#### Error Codes

- `400` – Invalid request payload
- `500` – Internal server error

---

### GET /ambulance/nearest

- **Description:** Get the nearest available ambulance (or estimated response) for a given location.
- **Request Parameters:** `lat`, `lng` (query params)
- **Request Body:** None

#### Example Request

\`\`\`http
GET /ambulance/nearest?lat=40.7128&lng=-74.0060 HTTP/1.1
Host: api.example.com
Accept: application/json
\`\`\`

#### Example Response

\`\`\`json
{
  "data": {
    "ambulanceId": "amb_001",
    "etaMinutes": 5,
    "distanceKm": 2.1,
    "status": "available",
    "location": { "lat": 40.7130, "lng": -74.0058 }
  }
}
\`\`\`

#### Error Codes

- `400` – Missing or invalid query parameters
- `404` – No available ambulances found
- `500` – Internal server error