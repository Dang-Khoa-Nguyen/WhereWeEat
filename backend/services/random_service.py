import random

class RandomService:
    def random_restaurant(data):
        result = random.randint(1,len(data))

        # Find the item in the list and return None if there is no id.
        item = next((x for x in data if x["id"] == result), None)

        return item