from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import math
from datetime import datetime

app = FastAPI(title="AI Hospital Routing Service", version="1.0.0")

class Location(BaseModel):
    lat: float
    lng: float

class HospitalData(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    available_beds: int
    available_icu_beds: int
    total_beds: int
    icu_beds: int

class RoutingRequest(BaseModel):
    patient_location: Location
    required_icu: bool = False
    priority: str = "medium" 
    hospitals: List[HospitalData]

class HospitalRanking(BaseModel):
    id: str
    name: str
    score: float
    distance_km: float
    eta_minutes: int
    available_beds: int
    available_icu_beds: int

class RoutingResponse(BaseModel):
    request_timestamp: str
    top_recommendations: List[HospitalRanking]

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance in kilometers between two points on the earth."""
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    

    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a)) 
    r = 6371 
    return c * r

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Routing"}

@app.post("/route", response_model=RoutingResponse)
def compute_route(request: RoutingRequest):
    if not request.hospitals:
        raise HTTPException(status_code=400, detail="No hospital data provided")
        
    rankings = []
    
    for h in request.hospitals:
        if request.required_icu and h.available_icu_beds <= 0:
            continue
            
        if not request.required_icu and h.available_beds <= 0:
            continue

        dist = haversine(request.patient_location.lat, request.patient_location.lng, h.lat, h.lng)

        eta = int(round((dist / 40.0) * 60))

        dist_weight = 0.4
        bed_weight = 0.4
        cap_weight = 0.2
        
        if request.priority in ["high", "critical"]:
            dist_weight = 0.7
            bed_weight = 0.3
            cap_weight = 0.0
            
        norm_dist = max(0, 1.0 - (dist / 50.0))
        
        target_beds = h.available_icu_beds if request.required_icu else h.available_beds
        norm_beds = min(1.0, target_beds / 50.0)
        
        total = h.icu_beds if request.required_icu else h.total_beds
        utilization = 1.0 - (target_beds / total) if total > 0 else 1.0
        norm_cap = 1.0 - utilization 
        
        score = (norm_dist * dist_weight) + (norm_beds * bed_weight) + (norm_cap * cap_weight)
        
        rankings.append(HospitalRanking(
            id=h.id,
            name=h.name,
            score=round(score, 4),
            distance_km=round(dist, 2),
            eta_minutes=eta,
            available_beds=h.available_beds,
            available_icu_beds=h.available_icu_beds
        ))
        
    rankings.sort(key=lambda x: x.score, reverse=True)
    
    return RoutingResponse(
        request_timestamp=datetime.utcnow().isoformat() + "Z",
        top_recommendations=rankings[:5]
    )

class TurnoverPrediction(BaseModel):
    hospital_id: str
    hospital_name: str
    current_occupancy: float
    predicted_turnover_rate_24h: float
    predicted_available_beds_tomorrow: int
    confidence_score: float

@app.get("/predict-turnover/{hospital_id}", response_model=TurnoverPrediction)
def predict_turnover(hospital_id: str, name: str, current_beds: int, total_beds: int):
    """
    Mock ML model endpoint to predict bed turnover.
    In a real system, this would load a trained Scikit-Learn or XGBoost model
    and predict based on historical admission/discharge rates, day of week, etc.
    """
    if total_beds == 0:
        raise HTTPException(status_code=400, detail="Total beds cannot be zero")
        
    occupancy = 1.0 - (current_beds / total_beds)
    
    # Mock some predictive logic: high occupancy = faster turnover (more discharges)
    # just an algorithmic stand-in for an ML model
    base_turnover = 0.15 # 15% turnover base
    if occupancy > 0.8:
        base_turnover = 0.25
    
    # generate a pseudo-random confidence score based on id string length
    confidence = 0.85 + (len(hospital_id) % 10) / 100.0
    
    predicted_avail = min(total_beds, current_beds + int(total_beds * base_turnover))
    
    return TurnoverPrediction(
        hospital_id=hospital_id,
        hospital_name=name,
        current_occupancy=round(occupancy, 2),
        predicted_turnover_rate_24h=round(base_turnover, 2),
        predicted_available_beds_tomorrow=predicted_avail,
        confidence_score=round(confidence, 2)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
