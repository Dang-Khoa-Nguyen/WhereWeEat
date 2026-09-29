from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.seek_restaurant_service import SeekService
from services.random_service import RandomService
from services.routing_service import RoutingService

from typing import List, Dict, Optional

from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### CLASSES
class RestaurantList(BaseModel):
    restaurants: List[Dict]

class Hours(BaseModel):
    display: Optional[list[str]] = None
    open_now: Optional[bool] = None

class Icon(BaseModel):
    prefix: str
    suffix: str

class Restaurant(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    rating: float
    cuisine: str = "none"
    address: Optional[str] = None
    icon: Optional[Icon] = None

class RouteInfo(BaseModel):
    duration_min: int
    distance_km: float
    geometry: List[List[float]]  

class RoutesResponse(BaseModel):
    walking: RouteInfo
    biking: RouteInfo
    driving: RouteInfo

### ENDPOINTS
@app.get("/")
def home():
    return {"message": "Hello world"}

@app.get("/recommend", response_model=List[Restaurant])
async def recommendation_restaurant(lat: float, lng: float, max_travel: int, cuisine: str, avg_stars: int):
    #  MOCK DATA
    #     restaurants = [   {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #   ]

    # Catch all variables
    if lat == 0 or lng == 0:
        raise HTTPException(status_code=400, detail="Invalid coordinates")

    if max_travel <= 0:
        raise HTTPException(status_code=400, detail="Travel time must be greater than 0")

    if avg_stars <= 0 or avg_stars > 5:
        raise HTTPException(status_code=400, detail="Average stars must be higher 0 or lower than 5")
    
    return await SeekService.find_filtered_restaurants(lat, lng, max_travel, cuisine, avg_stars)

@app.get("/random")
async def random_restaurant(lat: float, lng: float, max_travel: int, cuisine: str, avg_stars: int):

    # Catches all the varaibles
    if lat == 0 or lng == 0:
        raise HTTPException(status_code=400, detail="Invalid coordinates")

    if max_travel <= 0:
        raise HTTPException(status_code=400, detail="Travel time must be greater than 0")

    if avg_stars <= 0 or avg_stars > 5:
        raise HTTPException(status_code=400, detail="Average stars must be higher 0 or lower than 5")
    
    filtered_restaurants = await SeekService.find_filtered_restaurants(lat, lng, max_travel, cuisine, avg_stars)

    return RandomService.random_restaurant(filtered_restaurants)

@app.get("/route", response_model=RoutesResponse)
async def route(from_lat: float, from_lng: float, to_lat: float, to_lng: float):
    return await RoutingService.get_all_routes((from_lat, from_lng), (to_lat, to_lng))
