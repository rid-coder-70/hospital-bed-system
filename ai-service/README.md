# HealthBed AI - Routing Engine (Python)

This microservice provides analytical intelligence, calculating geographical distances and executing optimization algorithms to determine the best-fit hospital routing for emergency dispatches. 

## Features
- **Haversine Algorithmic Engine**: Computes spherical distance calculations between a user's live coordinates and all hospital locations.
- **Priority Matrix Ranking**: Re-orders hospital recommendations dynamically based on remaining ICU density, resource availability, and geographical proximity.
- **Restful Microservice**: Decoupled from the Node.js monolith for isolated scalability and rapid compute processing.

## Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3
- **Data Structuring**: Pydantic
- **Containerization**: Docker

## Local Development Setup
1. Install Python 3.
2. Initialize and activate a virtual environment:
   `python3 -m venv venv && source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start server: `uvicorn main:app --reload`
5. Access interactive API documentation: `http://localhost:8000/docs`

## Deployment
Packaged with a custom lightweight `Dockerfile`. Build and deploy the container to any Docker-compatible hosting environment such as Railway or AWS ECS.
