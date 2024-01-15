import os
import time
import requests
import json
from urllib.request import urlretrieve
from copy import deepcopy

'''
URL builder class
'''
class URL:
    chunks: list
    def __init__(self, chunks = []):
        self.chunks = chunks
        
    def add(self, chunk):
        self.chunks.append(chunk)
        return self
        
    def build(self) -> str:
        return '/'.join(self.chunks)

def versions():
    url = 'https://ddragon.leagueoflegends.com/api/versions.json'
    response = requests.get(url)
    return response.json()

'''
Gets champion.json file
Returns json
'''
def champion_json(version=None, dir=''):
    file_path = dir + 'champion_' + version + '.json'

    if os.path.isfile(file_path):
        with open(file_path) as f:
            data = json.load(f)
    else:
        url = URL([
            'https://ddragon.leagueoflegends.com/cdn',
            version,
            'data/fr_FR/champion.json'
        ]).build()
        response = requests.get(url)
        data = response.json()
        file_data = json.dumps(data, indent=4)
        with open(file_path, 'w') as f:
            f.write(file_data)

    return data

'''
Gets square images of champions' heads
Returns count of changed
'''
def champion_square_assets(version, champions, dir):
    base_url = URL([
        'https://ddragon.leagueoflegends.com/cdn',
        version,
        'img/champion'
    ])
    count = 0
    for champion in champions:
        file_path = dir + champion + '.png'
        if not os.path.isfile(file_path):
            if not os.path.isdir(dir):
                os.mkdir(dir)
            url = deepcopy(base_url).add(champion + '.png').build()
            urlretrieve(url, dir + champion + '.png')
            count += 1

    return count

'''
Gets puuid with game name and tag line.
Returns json
'''
def account(API, game_name, tag_line, dir):
    file_path = dir + game_name + '#' + tag_line + '.json'

    if os.path.isfile(file_path):
        with open(file_path) as f:
            data = json.load(f)
    else:
        url = URL([
            'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id',
            game_name,
            tag_line
        ]).build()
        response = requests.get(url, headers={ "X-Riot-Token": API  })
        data = response.json()
        file_data = json.dumps(data)
        with open(file_path, 'w') as f:
            f.write(file_data)

    return data

'''
Gets champion mastery with puuid.
Returns json
'''
def champion_mastery(API, puuid, dir):
    file_path = dir + 'champion_mastery_' + puuid + '.json'

    if os.path.isfile(file_path):
        with open(file_path) as f:
            data = json.load(f)        
    else:
        url = URL([
            'https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid',
            puuid
        ]).build()
        response = requests.get(url, headers={ "X-Riot-Token": API })
        data = response.json()
        file_data = json.dumps(data)
        with open(file_path, 'w') as f:
            f.write(file_data)

    return data

'''
Measures executing time of function and prints it.
'''
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


