import httpx
from dotenv import load_dotenv
import os
import asyncio
from services.calculate_service import CalculateService

from utils.format_list import format_list

load_dotenv()
FSQ_BASE_URL = os.getenv("FSQ_BASE_URL")
FSQ_API_KEY = os.getenv("FSQ_API_KEY")

if not FSQ_BASE_URL or not FSQ_API_KEY:
    raise RuntimeError("FSQ_BASE_URL or FSQ_API_KEY missing from .env")


class SeekService:
    @staticmethod
    async def find_filtered_restaurants(lat: float, lng: float, max_travel: int, cuisine: str="", avg_stars: int = 5):
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

    @staticmethod
    async def search_restaurants(lat: float, lng: float, radius: int = 2000, cuisine: str="", retries: int = 3):
        async with httpx.AsyncClient() as client:
            for attempt in range(retries):
                response = await client.get(
                    f"{FSQ_BASE_URL}/search",
                    params={
                        "ll": f"{lat},{lng}",
                        "query": f"{cuisine} restaurant",
                        "radius": radius,
                        "fields": "fsq_place_id,name,location,latitude,longitude,categories",
                    },
                    headers={
                        "Authorization": f"Bearer {FSQ_API_KEY}",
                        "X-Places-Api-Version": "2025-06-17",
                        "Accept": "application/json",
                    },
                )
                if response.status_code == 429:
                    wait = 2 ** attempt 
                    print(f"Rate limited, waiting {wait}s...")
                    await asyncio.sleep(wait)
                    continue
                response.raise_for_status()

                cleaned = format_list(response.json())

                return cleaned
            raise RuntimeError("Still rate limited after retries")


if __name__ == "__main__":
    result = asyncio.run(SeekService.search_restaurants(-34.9287, 138.5986))
    print(result[0])