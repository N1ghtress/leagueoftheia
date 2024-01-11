#!/usr/bin/python3

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

def get_champion_json(version, dir=''):
    url = URL([
        'https://ddragon.leagueoflegends.com/cdn',
        version,
        'data/fr_FR/champion.json'
    ]).build()
    response = requests.get(url)
    champion_json = json.dumps(response.json(), indent=4)
    with open(DIR + 'champion.json', 'w') as f:
        f.write(champion_json)
    return response.json()

def get_champion_square_assets(version, champions, dir=''):
    base_url = URL([
        'https://ddragon.leagueoflegends.com/cdn',
        version,
        'img/champion'
    ])
    for champion in champions:
        url = deepcopy(base_url).add(champion + '.png').build()
        urlretrieve(url, dir + champion + '.png')

if __name__ == '__main__':
    versions = get_versions()
    DIR = 'data/'
    VERSION = versions[0]
    champion_json = get_champion_json(VERSION, DIR)
    champions = champion_json['data'].keys()
    get_champion_square_assets(VERSION, champions, DIR)
