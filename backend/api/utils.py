import random
import re

from accounts.models import User


def generate_6_digit_code():
    return f"{random.randint(100000, 999999)}"


def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if re.match(pattern, email):
        return True
    return False


def generate_random_username():
    adjectives = [
        "Wobbly",
        "Soggy",
        "Spicy",
        "Bouncy",
        "Crispy",
        "Jolly",
        "Goofy",
        "Dizzy",
        "Clumsy",
        "Zesty",
        "Witty",
        "Sassy",
        "Nifty",
        "Quirky",
        "Snappy",
        "Gloomy",
        "Peppy",
        "Bizarre",
        "NoodleLike",
        "Jazzy",
        "Lumpy",
        "Mischievous",
        "Wonky",
        "Sleepy",
        "Speedy",
        "Tacky",
        "Loopy",
        "Gleaming",
        "Mysterious",
        "Lukewarm",
    ]

    nouns = [
        "Cactus",
        "Waffle",
        "Penguin",
        "Octopus",
        "Pickle",
        "Giraffe",
        "Pancake",
        "Squid",
        "Flamingo",
        "Squirrel",
        "Tornado",
        "Meatball",
        "Koala",
        "Goblin",
        "Turnip",
        "Tofu",
        "Llama",
        "Cabbage",
        "Gnome",
        "Ravioli",
        "Jellyfish",
        "Walrus",
        "Noodle",
        "TaterTot",
        "Chimichanga",
        "Lobster",
        "Marshmallow",
        "Ferret",
        "Pudding",
        "Kangaroo",
        "Muffin",
        "Banana",
        "Hedgehog",
        "Narwhal",
    ]

    while True:
        random_username = f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(10000, 99999)}"

        if not User.objects.filter(username=random_username).exists():
            return random_username