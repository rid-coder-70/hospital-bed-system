<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/PostgreSQL-Data-4169E1?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss" />
  
  <br />
  <br />
  
  <h1>🏥 HealthBed AI</h1>
  <p><b>Intelligent Real-Time Hospital Bed Management & Emergency Routing System</b></p>
</div>

---

**HealthBed AI** is a comprehensive, microservices-based full-stack architecture that solves critical healthcare logistics by providing **live bed availability tracking**, robust **role-based management**, and a **Python AI routing engine** for prioritizing and assigning emergency ambulance requests.

## ✨ Core Features

### 👥 3-Tier Multi-Role Architecture
1. **👑 System Admin (`/admin`)**
   - Global bird's-eye view of all system statistics.
   - Manage all users (create, delete, edit roles).
   - Assign dedicated `Hospital Admins` to specific hospitals in the network.
   - Instantly activate/deactivate facilities.
2. **🏥 Hospital Admin (`/hospital-admin`)**
   - Locked entirely to their own specific hospital.
   - Real-time `+/-` bed inventory control (General & ICU Wards).
   - Occupancy bars updating dynamically via WebSockets.
   - Comprehensive audit log of past updates with CSV export.
3. **👤 Patient / User (`/hospital`)**
   - Browse the public directory of all active hospitals.
   - View real-time bed & ICU capacities system-wide.
   - Use dynamic GPS location to locate and sort nearby hospitals.

### ⚡ Real-Time WebSocket Infrastructure
Changes pushed by a Hospital Admin instantly broadcast across the `Socket.io` network. The Patient directories and Admin dashboards immediately re-calculate occupancy percentages and available beds without a page refresh.

### 🧠 Python AI Microservice (FastAPI)
Using the `Haversine` formula and scoring algorithms via `NumPy`/`SciPy`, the AI Engine factors in:
- Geographic proximity (Distance of Patient → Hospital)
- Required ICU beds vs. Standard Beds
- Request Priority (Low, Medium, High, Critical)
To instantly route ambulances to the most optimal healthcare facility.

---

## 🛠 Prerequisites

Ensure you have the following installed on your Ubuntu system:
- **Node.js** (v18 or v20+)
- **Python** (v3.10+)
- **PostgreSQL** (v12+)

---

## 🚀 Step-by-Step Installation (Ubuntu)

Follow this process exactly: open **4 separate terminal windows** inside the project folder.

### Terminal 1: Database Setup (PostgreSQL)
Ensure Postgres is installed and running (`sudo apt install postgresql`).

```bash
# 1. Create the database wrapper
psql -U postgres -h localhost -c "CREATE DATABASE hospital_bed_db;"

# 2. Inject schema (Tables, Enums, Indexes)
psql -U postgres -h localhost -d hospital_bed_db -f database/schema.sql

# 3. Seed demo accounts & hospitals
psql -U postgres -h localhost -d hospital_bed_db -f database/seed-data.sql
```
*(Default Postgres password is `postgres`, update `.env` files if yours differs).*

### Terminal 2: AI Routing Service (FastAPI)
```bash
cd ai-service

# Create isolated Python environment (Recommended)
python3 -m venv venv
source venv/bin/activate

# Install AI Dependencies
pip install -r requirements.txt

# Boot the engine
uvicorn main:app --port 8000 --reload
```
You will see: `Uvicorn running on http://0.0.0.0:8000` *(You may see 'detail: Not Found' if visiting it on a browser, this is perfectly normal as it's an API!)*

### Terminal 3: Backend REST API (Node.js)
```bash
cd backend

# Install node modules
npm install

# Start Express & WebSocket Server
npm run dev
```
You will see: `✅ PostgreSQL connected` and `🚀 Server running on http://localhost:5000`

### Terminal 4: Frontend Web App (Next.js)
```bash
cd frontend

# Install UI modules
npm install

# Build and start Next.js
npm run dev
```
You will see: `Local: http://localhost:3000`

---

## 🔑 Demo Access Credentials

Once all terminals are running, simply navigate to [http://localhost:3000](http://localhost:3000) and use any of these pre-seeded accounts.

| Security Clearance | Login Email | Universal Password |
|---|---|---|
| **System Administrator** | `admin@healthbed.com` | `admin123` |
| **Hospital Administrator** | `hospital@healthbed.com` | `admin123` |
| **Public Patient** | `patient@healthbed.com` | `admin123` |

> *Note: Admins cannot self-register. You must login as the System Admin to create more Admins.*

---
*Built with ❤️ for resilient and optimized healthcare infrastructure.*
