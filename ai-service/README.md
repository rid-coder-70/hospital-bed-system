# HealthBed AI - Routing Engine (Python)

This microservice provides analytical intelligence, calculating geographical distances and optimal algorithms to determine the best-fit hospital routing for emergency dispatches. 

## 🚀 Features
- **Haversine Algorithmic Engine**: Instantly computes spherical distance calculations between a user's live latitude/longitude and hospital coordinates.
- **Priority Matrix Ranking**: Re-orders hospital recommendations dynamically based on remaining ICU density and geographical proximity.
- **Restful Microservice**: Decoupled from the Node.js monolith for isolated scalability and rapid compute processing.

## 🛠 Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3
- **Data Structuring**: Pydantic
- **Containerization**: Docker

## ⚙️ How to run locally
1. Install Python 3.
2. Initialize and activate a virtual environment:
   `python3 -m venv venv && source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start server: `uvicorn main:app --reload`
5. Test APIs interactively: `http://localhost:8000/docs`

## 📦 Deployment
Packaged with a custom lightweight `Dockerfile`. Just drag and drop the `ai-service` directory into your Railway or Docker-compatible host.
