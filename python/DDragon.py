#!/usr/bin/python3

import os
import subprocess
from pathlib import Path
from time import time

from requests import Request, Session


class DDragon:
    host: str = 'https://ddragon.leagueoflegends.com'
    lol_version: str
    session: Session
    def __init__(self):
        self.session = Session()
        self.setLastVersion()

    def send(self, r: Request):
        pr = self.session.prepare_request(r)
        print(f'{r.method} {r.url}: ', end='', flush=True)
        start = time()
        response = self.session.send(pr)
        end = time() - start
        print(f'{end}', flush=True)
        response.raise_for_status()
        return response

    def setLastVersion(self):
        versions = self.fetchVersions()
        self.lol_version = versions[0]
        print(f'Set LoL version to {self.lol_version}.')

    def fetchVersions(self):
        r = Request('GET', f'{self.host}/api/versions.json')
        return self.send(r).json()

    def fetchDataset(self):
        r = Request('GET', f'{self.host}/cdn/dragontail-{self.lol_version}.tgz')
        return f'dragontail-{self.lol_version}.tgz', self.send(r).content
        
    def fetchChampions(self):
        r = Request('GET', f'{self.host}/cdn/{self.lol_version}/data/fr_FR/champion.json')
        return self.send(r).json()

    def fetchChampionImage(self, champion):
        r = Request('GET', f'{self.host}/cdn/{self.lol_version}/img/champion/{champion}.png')
        return self.send(r)

'''
Fetches latest version dataset.
'''
def main():
    ddragon = DDragon()
    filename, dataset = ddragon.fetchDataset()
    dir = f'{filename[:-4]}'
    os.makedirs(dir, exist_ok=True)
    filepath = Path(f'{dir}/{filename}')
    with open(filepath, 'wb') as f:
        f.write(dataset)
        
    subprocess.run(['tar', 'xf', filepath, '-C', dir], check=False)

if __name__ == '__main__':
    main()
