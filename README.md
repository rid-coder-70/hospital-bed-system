# 🏥 AI Hospital Bed Availability System

A modern, full-stack microservices architecture designed to provide **real-time hospital bed availability**, intelligent **emergency routing**, and seamless **ambulance dispatch** for healthcare providers and first responders.

![Architecture Flow](https://upload.wikimedia.org/wikipedia/commons/4/4b/Microservices_Architecture_Diagram.png) <!-- Update with proper screenshot -->

It is heavily optimized with modern UX/UI trends utilizing `TailwindCSS` and `Framer Motion`, and powered by a high-availability backend `PostgreSQL` and WebSockets environment.

---

## 🛠 Tech Stack

- **Frontend**: Next.js (React 19), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend API**: Node.js, Express, Socket.io (Realtime Websockets), JWT Authentication.
- **AI Microservice**: Python, FastAPI, NumPy/SciPy (Haversine & Routing Scoring).
- **Database**: PostgreSQL (Dockerized).

---

## 🚀 Getting Started

Follow these instructions to start the entire system natively on your local machine. Ensure you have `Node.js`, `Python 3`, `Docker`, and `npm` installed.

### 1️⃣ Start the PostgreSQL Database (Docker)
The easiest way to start the database and seed it automatically is via Docker Compose.
```bash
# 1. Navigate into the docker directory
cd database
cd ../docker

# 2. Spin up the Database container silently
docker compose up -d

# 3. Apply the SQL tables and seed data
sleep 5
docker exec -i hospital_db psql -U postgres -d hospital_bed_db < ../database/schema.sql
docker exec -i hospital_db psql -U postgres -d hospital_bed_db < ../database/seed-data.sql
```

### 2️⃣ Start the AI Routing Service (FastAPI)
This service manages the intelligent routing algorithms for incoming ambulances/patients.
```bash
# 1. Open a new terminal and navigate to ai-service
cd ai-service

# 2. Create and activate a Virtual Environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the Uvicorn server (Defaults to Port 8000)
uvicorn main:app --port 8000 --reload
```
_The AI Service will now be available on `http://localhost:8000`_

### 3️⃣ Start the Backend REST API & WebSockets (Node.js)
This handles user endpoints, live bed updates, and proxies requests to the AI Service.
```bash
# 1. Open a new terminal and navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Start the node server in dev mode
npm run dev
```
_The Backend Service will map SQL and start on `http://localhost:5000`_

### 4️⃣ Start the Frontend Web App (Next.js)
The beautifully designed, responsive Next.js application.
```bash
# 1. Open a final terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start the UI server
npm run dev
```
_The Frontend Web Application will start on `http://localhost:3000` (or `3002` if port is used)._

---

## 📋 Features to Explore

### 🔐 Multi-Role Authentication
Navigate to `/auth/login` or `/auth/signup`. You will see interactive tabs allowing you to select between a **Patient** or **Hospital Admin** experience.

### 🏥 Hospital Directory
Navigate to `/hospital`. You will see a beautiful Grid of live hospitals pulled directly from the SQL database. Search through them and watch the animated UI/UX filter them live.

### 📈 Live Dashboard Command Center
Navigate to `/dashboard`. This provides a high-level `Hospital Admin / Dispatcher` view of the entire operational capacity across the network. Live WebSocket connections reflect updates here automatically.

### 🚑 AI Intelligent Routing (API Level)
You can directly trigger the Python `ai-service` routing by running a cURL against the backend. It will rank the nearest available hospitals that have ICU functionality via Haversine distance computations:
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"patientLocation": {"lat": 23.75, "lng": 90.38}, "requiredIcu": true, "priority": "high"}' \
  http://localhost:5000/api/beds/route
```

---
*Created by the HealthBed AI team.*
