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
    categories: str = "none"
    address: Optional[str] = None
    icon: Optional[Icon] = None
    hour: Optional[Hours] = None

class Hours(BaseModel):
    display: Optional[list[str]] = None
    open_now: Optional[bool] = None

class Icon(BaseModel):
    prefix: str
    suffix: str

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
    #  await SeekService.find_restaurants(lat, lng, 100)
    #     restaurants = [   {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #       {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    #   ]
   
    # Calculate the widest radius 
    radius_calculate = CalculateService.travel_time_to_radius("walking", max_travel)
    
    restaurants = await SeekService.search_restaurants(lat,lng, radius_calculate, cuisine)

    filter_star = []
    if avg_stars == 1:
        filter_star = [r for r in restaurants if r["rating"] > 1 ]
    
    if avg_stars == 2:
        filter_star = [r for r in restaurants if r["rating"] > 2 and  r["rating"] <= 3 ]
        
    if avg_stars == 3:
        filter_star = [r for r in restaurants if r["rating"] > 3 and  r["rating"] <= 4]
        
    if avg_stars == 4:
        filter_star = [r for r in restaurants if r["rating"] > 4 ]
        
    return filter_star

@app.post("/random")
def random_restaurant(data: RestaurantList):
    restaurants = data.restaurants

    if not restaurants:
        raise HTTPException(status_code=404, message="There are no retaurants")
    
    return RandomService.random_restaurant(restaurants)

@app.get("/route", response_model=RoutesResponse)
async def route(from_lat: float, from_lng: float, to_lat: float, to_lng: float):
    return await RoutingService.get_all_routes((from_lat, from_lng), (to_lat, to_lng))
