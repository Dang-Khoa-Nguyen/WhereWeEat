import httpx
from dotenv import load_dotenv
import os
import asyncio

from utils.format_list import format_list

load_dotenv()
FSQ_BASE_URL = os.getenv("FSQ_BASE_URL")
FSQ_API_KEY = os.getenv("FSQ_API_KEY")

if not FSQ_BASE_URL or not FSQ_API_KEY:
    raise RuntimeError("FSQ_BASE_URL or FSQ_API_KEY missing from .env")


class SeekService:
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