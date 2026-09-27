from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.seek_restaurant_service import SeekService
from services.random_service import RandomService
from services.routing_service import RoutingService
from services.calculate_service import CalculateService

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

class Restaurant(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    rating: float
    categories: List[str] = []
    address: Optional[str] = None

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

@app.get("/recommend", response_model=Restaurant)
async def recommendation_restaurant(lat, lng, travelTime, categories, avgStar):
    #  await SeekService.find_restaurants(lat, lng, 100)
    #     restaurants = [   {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #   ]
   
    # Calculate the widest radius 
    radius_calculate = CalculateService.travel_time_to_radius("driving", travelTime)
    
    restaurants = await SeekService.search_restaurants(lat,lng, radius_calculate, categories)

    filter_star = []
    if avgStar == 1:
        filter_star = [r for r in restaurants if r["rating"] > 1 ]
    
    if avgStar == 2:
        filter_star = [r for r in restaurants if r["rating"] > 2 and  r["rating"] <= 3 ]
        
    if avgStar == 3:
        filter_star = [r for r in restaurants if r["rating"] > 3 and  r["rating"] <= 4]
        
    if avgStar == 4:
        filter_star = [r for r in restaurants if r["rating"] > 4 ]
        
    return filter_star

@app.post("/random")
def random_restaurant(data: RestaurantList):
    restaurants = data.restaurants

    if not restaurants:
        return {"error": "restaurants list are empty. Can't randomise"}
    
    return RandomService.random_restaurant(restaurants)

@app.get("/route", response_model=RoutesResponse)
async def route(from_lat: float, from_lng: float, to_lat: float, to_lng: float):
    return await RoutingService.get_all_routes((from_lat, from_lng), (to_lat, to_lng))
