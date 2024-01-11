#!/usr/bin/python3
import fetcher_lib as lib

if __name__ == '__main__':
    versions = lib.time_func(
        lib.get_versions,
        text="Fetching versions"
    )

    DIR = 'data/'
    VERSION = versions[0]
    
    champion_json = lib.time_func(
        lib.get_champion_json,
        VERSION,
        DIR,
        text="Fetching champion.json"
    )

    champions = champion_json['data'].keys()
    square_assets_updated = lib.time_func(
        lib.get_champion_square_assets,
        VERSION,
        champions,
        DIR,
        text="Fetching champions square assets"
    )
    print(f"Square assets updated: {square_assets_updated}")

