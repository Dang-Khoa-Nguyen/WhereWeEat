import math

SPEEDS_KMH = {"walking": 5, "biking": 15, "driving": 30}
# Giving max radisu so foursquare dont broke down.
MAX_RADIUS_M = 15000

class CalculateService:

    @staticmethod
    def travel_time_to_radius(mode: str, max_minutes: int, margin: float = 1.2) -> int:
        speed = SPEEDS_KMH.get(mode, 5)
        meters_per_minute = speed * 1000 / 60
        return int(min(meters_per_minute * max_minutes * margin, MAX_RADIUS_M))

    # Helper: radius for EVERY mode at once 
    @staticmethod
    def radii_for_all_modes(max_minutes: int) -> dict:
        return {mode: CalculateService.travel_time_to_radius(mode, max_minutes) for mode in SPEEDS_KMH}

    # Allow to know how far a restaurant without calling a routing API
    @staticmethod
    def haversine(lat1, lng1, lat2, lng2) -> float:
        """Straight-line distance between two lat/lng points, in METERS."""
        R = 6371000  # Earth radius in meters
        p1, p2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lng2 - lng1)
        a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dlambda/2)**2
        return 2 * R * math.asin(math.sqrt(a))

    # Search one and filter radius per mode
    @staticmethod
    def filter_by_mode(restaurants, user_lat, user_lng, mode, max_minutes):
        """Keep only restaurants within this mode's radius (in-memory, no API call)."""
        radius = CalculateService.travel_time_to_radius(mode, max_minutes)
        result = []
        for r in restaurants:
            dist = CalculateService.haversine(user_lat, user_lng, r["lat"], r["lng"])
            if dist <= radius:
                result.append(r)
        return result

if __name__ == "__main__":
    print(CalculateService.radii_for_all_modes(15))