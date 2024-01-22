#!/usr/bin/python3

import argparse
import fetcher_lib as lib

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        prog='League Of Theia Fetcher',
        description='Fetches data dragon and riot\'s API.'
    )
    parser.add_argument(
        '-k', '--key',
        dest='api_key',
        help='Key for Riot\'s API.',
        required=True
    )
    parser.add_argument(
        '-v', '--version',
        help='Version of league to fetch data from.'
    )
    parser.add_argument(
        '-r', '--riot-id',
        dest='riot_id',
        help='Your riot ID like so: gameName#tagLine.'
    )

    args = parser.parse_args()
    API = args.api_key
    VERSION = args.version
    DIR = 'data/'
    RIOT_ID = args.riot_id
    GAME_NAME, TAG_LINE = RIOT_ID.split('#')

    if not VERSION:
        versions = lib.time_func(
            lib.versions,
            text="Fetching versions"
        )
        VERSION = versions[0]
    
    champion_json = lib.time_func(
        lib.champion_json,
        VERSION,
        DIR,
        text="Fetching champion.json"
    )

    champions = champion_json['data'].keys()
    square_assets_updated = lib.time_func(
        lib.champion_square_assets,
        VERSION,
        champions,
        DIR + 'assets/',
        text="Fetching champions square assets"
    )
    print(f"Square assets updated: {square_assets_updated}")

    account = lib.time_func(
        lib.account,
        API,
        GAME_NAME,
        TAG_LINE,
        DIR,
        text='Fetching account'
    )

    champion_mastery = lib.time_func(
        lib.champion_mastery,
        API,
        account['puuid'],
        DIR,
        text='Fetching champion mastery'
    )
    
    match_info = lib.time_func(
        lib.get_match_info_by_puuid,
        API,
        account['puuid'],
        DIR,
        'any',
        '60',
        text='Fetching match info by puuid'
    )
