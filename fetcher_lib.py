import os
import time
import requests
import json
from urllib.request import urlretrieve
from copy import deepcopy

class URL:
    chunks: list
    
    def __init__(self, chunks = []):
        self.chunks = chunks
        
    def add(self, chunk):
        self.chunks.append(chunk)
        return self
        
    def build(self) -> str:
        return '/'.join(self.chunks)

def get_versions():
    url = 'https://ddragon.leagueoflegends.com/api/versions.json'
    response = requests.get(url)
    return response.json()

def get_champion_json(*args, version=None, dir=''):
    if not version: version = args[0]
    if not dir: dir = args[1]

    # if not os.path.isfile(dir + 'champion' + version + '.json'):
    url = URL([
        'https://ddragon.leagueoflegends.com/cdn',
        version,
        'data/fr_FR/champion.json'
    ]).build()
    response = requests.get(url)
    champion_json = json.dumps(response.json(), indent=4)
    with open(dir + 'champion' + version + '.json', 'w') as f:
        f.write(champion_json)
    return response.json()

def get_champion_square_assets(version, champions, dir=''):
    base_url = URL([
        'https://ddragon.leagueoflegends.com/cdn',
        version,
        'img/champion'
    ])

    count = 0
    for champion in champions:
        if not os.path.isfile(dir + champion + '.png'):
            url = deepcopy(base_url).add(champion + '.png').build()
            urlretrieve(url, dir + champion + '.png')
            count += 1
    return count

def time_func(func, *args, **kwargs):
    UP = '\033[1A'
    CLEAR = '\x1b[2K'
    text = kwargs["text"]
    print(text + "...")
    t0 = time.time()
    retval = func(*args)
    print(UP, end=CLEAR)
    print(text + " " + str(time.time() - t0))
    return retval
