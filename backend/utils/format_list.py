from utils.random_star import get_rating
import uuid

def format_list(data):
    restaurants = []

    for element in data.get("results", []):
        # Safely get the cuisine: handle missing AND empty list
        categories = element.get("categories") or []         
        cuisine = categories[0].get("short_name", "none")

        # Skip the restaurant doesn't have lat and lng
        lat = element.get("latitude")
        lng = element.get("longitude")
        if lat is None or lng is None:
            continue  

        restaurants.append({
            "id": str(uuid.uuid4()),
            "name": element.get("name", "Unknown"),
            "lat": element.get("latitude"),
            "lng": element.get("longitude"),
            "cuisine": cuisine,
            "rating": get_rating(element["fsq_place_id"]),
            "address": element.get("location", {}).get("formatted_address", "Unknown")
        })

    return restaurants