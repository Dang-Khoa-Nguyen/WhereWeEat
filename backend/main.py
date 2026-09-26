from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "Hello world"}

@app.get("/recommend")
async def recommendation_restaurant():
    return [
        {"id": 1, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
        {"id": 2, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
        {"id": 3, "name": "Kintaro Sushi", "stars" : 4, "location": "Marion", "travelTime": 60},
    ]