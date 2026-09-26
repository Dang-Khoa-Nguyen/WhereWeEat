import random

class RandomService:
    def random_restaurant(data):
        result = random.randint(1,len(data))
        return result