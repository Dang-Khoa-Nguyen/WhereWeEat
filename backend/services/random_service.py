import random

class RandomService:
    def random_restaurant(data):

        # Choose the data fairly.
        result = random.choice(data)

        return result