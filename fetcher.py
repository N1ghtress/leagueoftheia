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
        '-d', '--dir',
        help='Data destination directory.'
    )

    args = parser.parse_args()
    API = args.api_key
    DIR = args.dir
    VERSION = args.version

    if not VERSION:
        versions = lib.time_func(
            lib.versions,
            text="Fetching versions"
        )
        VERSION = versions[0]
    if not DIR: DIR = './'
    if not API: API = ''
   
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
        DIR,
        text="Fetching champions square assets"
    )
    print(f"Square assets updated: {square_assets_updated}")

    account = lib.time_func(
        lib.account,
        API,
        'N1Ghtress',
        '420',
        text='Fetching account'
    )
    print(account)

    champion_mastery = lib.time_func(
        lib.champion_mastery,
        API,
        account['puuid'],
        text='Fetching champion mastery'
    )
    print(champion_mastery)
