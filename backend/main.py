from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.seek_restaurant_service import SeekService
from services.random_service import RandomService

from typing import List, Dict

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

### ENDPOINTS
@app.get("/")
def home():
    return {"message": "Hello world"}

@app.get("/recommend")
async def recommendation_restaurant(lat, lng):
    #  await SeekService.find_restaurants(lat, lng, 100)
    restaurants = [   {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
      {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
      {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
  ]
    return restaurants

@app.post("/random")
def random_restaurant(data: RestaurantList):
    restaurants = data.restaurants

    if not restaurants:
        return {"error": "restaurants list are empty. Can't randomise"}
    
    return RandomService.random_restaurant(restaurants)