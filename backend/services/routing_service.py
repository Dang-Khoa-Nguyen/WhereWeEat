import httpx
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()
ORS_API_KEY = os.getenv("ORS_API_KEY")
ORS_BASE_URL = os.getenv("ORS_BASE_URL")

if not ORS_API_KEY:
    raise RuntimeError("ORS_API_KEY missing from .env")

# Map frontend names to ORS profile names
PROFILES = {
    "walking": "foot-walking",
    "biking": "cycling-regular",
    "driving": "driving-car",
}

class RoutingService:

    # Travel time from user to MANY restaurants in ONE call
    @staticmethod
    async def get_travel_times(origin, destinations, mode="walking"):
        # origin: (lat, lng) and destinations: list of (lat, lng)
        profile = PROFILES.get(mode, "foot-walking")

        locations = [[origin[1], origin[0]]] + [[d[1], d[0]] for d in destinations]

        body = {
            "locations": locations,
            "sources": [0],                               
            "destinations": list(range(1, len(locations))), 
            "metrics": ["duration"],
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{ORS_BASE_URL}/matrix/{profile}",
                json=body,
                headers={"Authorization": ORS_API_KEY},
            )
            res.raise_for_status()
            data = res.json()

        # durations[0] is the row from the user to each restaurant, in SECONDS.
        seconds = data["durations"][0]
        # Convert to minutes or None if a place is unreachable.
        return [round(s / 60) if s is not None else None for s in seconds]

    # The actual route LINE to ONE chosen restaurant
    @staticmethod
    async def get_route(origin, destination, mode="walking"):
        profile = PROFILES.get(mode, "foot-walking")

        body = {
            "coordinates": [
                [origin[1], origin[0]],        # [lng, lat] again!
                [destination[1], destination[0]],
            ]
        }

        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{ORS_BASE_URL}/directions/{profile}/geojson",
                json=body,
                headers={"Authorization": ORS_API_KEY},
            )
            res.raise_for_status()
            data = res.json()

        feature = data["features"][0]

        # distance (m), duration (s)
        summary = feature["properties"]["summary"] 

        # list of [lng, lat] points
        geometry = feature["geometry"]["coordinates"]  

        return {
            "distance_km": round(summary["distance"] / 1000, 1),
            "duration_min": round(summary["duration"] / 60),
            "geometry": geometry, 
        }

    @staticmethod
    async def get_all_routes(origin, destination):
        """All three modes for ONE restaurant → powers the walk/bike/drive buttons."""
        routes = {}
        for mode in PROFILES:
            routes[mode] = await RoutingService.get_route(origin, destination, mode)
        return routes

if __name__ == "__main__":
    print(asyncio.run(RoutingService.get_route((-34.9287,138.5986), (-34.92,138.60), "walking")))