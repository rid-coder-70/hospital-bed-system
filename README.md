# AI Hospital Bed Availability System

An intelligent healthcare platform that provides **real-time hospital bed availability**, emergency routing, and ambulance dispatch using **AI-powered decision systems**.

The system helps patients quickly find hospitals with available beds and assists emergency services in routing patients efficiently.

---

## System Architecture

Frontend (Next.js)
↓
Backend API (Node.js / Express)
↓
AI Routing Service (Python / FastAPI)
↓
PostgreSQL Database

---

## Tech Stack

Frontend
- Next.js
- Tailwind CSS
- Leaflet / Mapbox

Backend
- Node.js
- Express.js
- Socket.io

AI Service
- Python
- FastAPI
- Geospatial algorithms

Database
- PostgreSQL

DevOps
- Docker
- Vercel
- Railway

---

## Project Structure

ai-hospital-bed-availability-system

frontend/
backend/
ai-service/
database/
docs/
docker/

---

## AI Routing Logic

The AI service determines the best hospital using:

Distance from patient
+
Available bed count
+
Hospital capacity

This ensures patients are directed to the **nearest hospital with available resources**.

---

## Screenshots

(Add screenshots here)

- Hospital map
- Admin dashboard
- Emergency routing interface
- Bed availability system

---

## Future Improvements

• Traffic-aware ambulance routing  
• ICU demand prediction using machine learning  
• Mobile application integration  
• Government health system integration  
• National hospital network support  

---

## Installation

Clone the repository

```bash
git clone https://github.com/rid-coder-70/hospital-bed-system
```

Install frontend

```bash
cd frontend
npm install
npm run dev
```

Install backend

```bash
cd backend
npm install
node server.js
```

Run AI service

```bash
cd ai-service
pip install -r requirements.txt
python main.py
```

---

## Author

Ridoy Baidya  
CSE Student, SUST

---

## License

MIT License
