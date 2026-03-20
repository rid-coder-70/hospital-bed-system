# HealthBed AI: Next-Generation Live Hospital Bed & Emergency Dispatch System 🏥⚡

This project is a highly advanced, full-stack Hospital Management & Emergency Routing web application designed to eliminate operational friction during medical crises. 

Built with a **Node.js/Express backend**, **PostgreSQL database**, and a stunning **Next.js & Tailwind CSS frontend**, the platform leverages **WebSockets (Socket.io)** for millisecond-accurate live medical data broadcasting and **Pessimistic Database Locking** to securely prevent double-booking of life-critical beds.

---

## 🚀 Core Features & Capabilities

### 1. Real-Time Bed & Ward Tracking (WebSockets)
- **Dynamic Ward Management:** Hospital Admins can dynamically register and track specialized units (e.g., *Maternity, Burn Unit, CCU, NICU, Trauma*) completely on the fly using advanced JSONB data storage in PostgreSQL.
- **Millisecond Sync:** When an admin adjusts bed availability, `Socket.io` instantly blasts the new capacity to every open browser—meaning the public patient directory updates in real-time without refreshing.

### 2. Autonomous Emergency Dispatch System
- **Public Dispatch Initiation:** From the public directory, users can instantly fire an emergency dispatch signal (including Patient Name, Condition, and ETA) directly to a specific hospital.
- **Pulsing Neon Alerts:** The exact second a dispatch is requested, a red flashing incoming alert strikes the target Hospital Admin's dashboard.
- **Concurrency-Safe Reservations:** Admins can lock and reserve a bed for the incoming ambulance. Under the hood, the system uses Postgres `FOR UPDATE` pessimistic locking so two dispatchers can never accidentally overbook the last remaining bed.

### 3. AI-Assisted Routing Protocol
- Integrates with external AI services to instantly compute the best hospital routing based on live distance/location coordinates and real-time live bed capacity.

### 4. Interactive & Premium User Interface
- Built with **Framer Motion** for liquid-smooth micro-animations.
- **Beautiful Dark Mode** and glassmorphism styling ensuring an ultra-modern administrative experience.
- Automated History Tracking that logs every single capacity change complete with timestamps.

---

## 🛠 Tech Stack

**Frontend Architecture:**
- Next.js 14+ (React)
- TypeScript
- Tailwind CSS & Framer Motion
- Socket.io-client
- React Hot Toast & Lucide Icons

**Backend & Database:**
- Node.js & Express.js
- PostgreSQL (pg)
- Socket.io (Real-time events)
- JSON Web Tokens (JWT) & bcrypt (Authentication)
- Zod (Runtime type checking)

---

## 📂 Project Structure

- `/backend`: The RESTful API layer and WebSocket server.
- `/frontend`: The Next.js reactive UI application.
- `/database`: Raw `schema.sql` and `seed-data.sql` for rapid local scaling (Contains over 40+ mapped hospitals!).

---

## ⚙️ How to Run Locally

### 1. Start the PostgreSQL Database
Ensure you have a database named `hospital_bed_db` running on port `5432`.
Run the scripts inside the `/database` folder to seed the initial tables and hospital data.

### 2. Boot the API Server
```bash
cd backend
npm install
npm run dev
```
*(Runs on port 5000)*

### 3. Boot the Frontend UI
```bash
cd frontend
npm install
npm run dev
```
*(Runs on port 3000)*

---

### Test Credentials
To experience the platform, log into `http://localhost:3000/auth/login` using:

| Role | Email | Password |
|------|-------|----------|
| **System Admin** | `admin@healthbed.com` | `admin123` |
| **Hospital Admin** | `hospital@healthbed.com` | `admin123` |
| **Patient** | `patient@healthbed.com` | `admin123` |
