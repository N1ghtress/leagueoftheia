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
        response.raise_for_status()

        data = response.json()
        file_data = json.dumps(data, indent=4)
        create_missing_dir(dir)
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
            create_missing_dir(dir)
            url = deepcopy(base_url).add(champion + '.png').build()
            urlretrieve(url, dir + champion + '.png')
            count += 1

    return count

'''
Gets puuid with game name and tag line.
Returns json
'''
def account(API, game_name, tag_line, dir):
    file_path = dir + game_name + ':' + tag_line + '.json'

    if os.path.isfile(file_path):
        with open(file_path) as f:
            data = json.load(f)
    else:
        url = URL([
            'https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id',
            game_name,
            tag_line
        ]).build()
        response = requests.get(url, headers={ "X-Riot-Token": API })
        response.raise_for_status()

        data = response.json()
        file_data = json.dumps(data)
        create_missing_dir(dir)
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
        response.raise_for_status()

        data = response.json()
        file_data = json.dumps(data)
        create_missing_dir(dir)
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

'''
Creates directory if it doesn't exists
'''
def create_missing_dir(dir):
    if not os.path.isdir(dir):
        os.mkdir(dir)
        print(f'Created directory {dir}')

'''
Gets match info with puuid.
type : the type of match : should be one of the following values {'ranked','normal','tourney','tutorial','any'} where 'any' means anytype of game
games : int, number of match id you want to get, default 20
Returns json with info of multiple games played by the play define by puuid
'''
def get_match_info_by_puuid(API , puuid, dir, type='any',games='20') :
    file_path = dir + 'match_id_'+ type + '_' +games + '_' + puuid + '.json'
    if os.path.isfile(file_path):
        with open(file_path) as f:
            data = json.load(f)        
    else:
        if type == 'any' :
            url = URL([
                'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid',
                 puuid,
                'ids?start=0&count=' + games
                
            ]).build()
        else :
            url = URL([
                'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid',
                 puuid,
                'ids?type=' + type +'&start=0&count='+ games
                
            ]).build()
        
        response = requests.get(url, headers={ "X-Riot-Token": API })
        response.raise_for_status()

        data = response.json()
        data = time_func(
                get_match_info_by_matchId,
                API,
                data,
                text='Fetching match info'
            )
        file_data = json.dumps(data)
        create_missing_dir(dir)
        with open(file_path, 'w') as f:
            f.write(file_data)

    return data
    
    
'''
Gets match information with matchId.
tab_matchId : table of matchId
Returns json
'''
def get_match_info_by_matchId(API, tab_matchId) :
    nb_games = len(tab_matchId)

    data = {}
    for i, match_id in enumerate(tab_matchId) :
        url = URL([
            'https://europe.api.riotgames.com/lol/match/v5/matches',
            match_id
            
        ]).build()
        response = requests.get(url, headers={ "X-Riot-Token": API })
        response.raise_for_status()

        data[i] = response.json()
    return data    
