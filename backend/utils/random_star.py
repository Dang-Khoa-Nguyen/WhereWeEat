import random

def get_rating(id):
    star = random.Random(id)
    return round(star.uniform(2, 5.0), 1)
