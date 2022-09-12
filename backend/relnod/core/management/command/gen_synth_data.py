import random
import string
import csv
from datetime import timedelta, date


def number_generator(digit=10):
    return ''.join(random.choices(string.digits, k=digit))


def plate_generator():
    return \
        ''.join(random.choices(string.digits, k=2)) + ' ' + \
        ''.join(random.choices(string.ascii_uppercase, k=3)) + ' ' + \
        ''.join(random.choices(string.digits, k=4))


def bus_generator():
    return \
        ''.join(random.choices(string.digits, k=2)) + ' C ' + \
        ''.join(random.choices(string.digits, k=4))


def plane_generator():
    return \
        ''.join(random.choices(string.ascii_uppercase, k=2)) + '-' + \
        ''.join(random.choices(string.digits, k=4))


def date_generator(start_date=date(2015, 1, 1), end_date=date.today()):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days

    random_number_of_days = random.randrange(days_between_dates)
    return start_date + timedelta(days=random_number_of_days)


PERSONS = [number_generator(11) for _ in range(300)]
CARS = [plate_generator() for _ in range(20)]
HOTELS = ['Ramada', 'Rixos', 'Movenpick']
PLANES = [plane_generator() for _ in range(10)]
BUSES = [bus_generator() for _ in range(40)]
PHONES = [number_generator() for _ in range(300)]
CITIES = ['Ankara', 'İstanbul', 'Erzincan', 'Rize', 'Samsun']
JOBS = ['Aselsan', 'Havelsan', 'EGO', 'MTA', 'TEI']

TYPES = [
    (1, PERSONS),  # person
    (2, CARS),  # car
    (3, HOTELS),  # hotel
    (4, PLANES),  # plane
    (5, BUSES),  # bus
    (6, PHONES),  # phone
    (7, CITIES),  # city
    (8, JOBS),  # job
]


def generate_row(type1: int = None, type2: int = None):
    type1, key1 = TYPES[type1 - 1] if type1 else random.choice(TYPES)
    type2, key2 = TYPES[type2 - 1] if type2 else random.choice(TYPES)

    return {
        'key1': str(random.choice(key1)),
        'type1': type1,
        'key2': str(random.choice(key2)),
        'type2': type2,
        'relation_name': date_generator()
    }


if __name__ == '__main__':
    fields = ['key1', 'type1', 'key2', 'type2', 'relation_name']

    relations = [
        (1, 1, 1000),
        (1, 2, 1000),
        (1, 3, 1000),
        (1, 4, 1000),
        (1, 5, 1000),
        (1, 6, 1000),
        (1, 7, 1000),
        (1, 8, 1000),
    ]

    for type1, type2, rows in relations:
        synthetic_data = []

        for _ in range(rows):
            synthetic_data.append(generate_row(type1=type1, type2=type2))

        with open(f'{type1}-{type2}.csv', 'w') as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()
            writer.writerows(synthetic_data)
