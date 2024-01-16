#!/usr/bin/python3

import fetcher_lib as lib

class Option():
    name: str
    func: callable

    def __init__(self, name, func):
        self.name = name
        self.func = func

    def __str__(self):
        return self.name

    def __call__(self, *args, **kwargs):
        self.func(*args, **kwargs)

def print_menu(options):
    for i, option in enumerate(options):
        print(f'{i}) {option}')

def choose_menu(options):
    try:
        choice = int(input())
        options[choice]()
    except ValueError:
        print("Options are selected by their number.")
    except IndexError:
        print("The option you chose is not on the list.")
    
def main_menu():
    fetch_menu_option = Option("Fetch menu", fetch_menu)
    edit_menu_option = Option("Edit menu", edit_menu)
    display_var_option = Option("Display variables", display_variables)
    exit_option = Option("Exit", exit)
    options = [
        fetch_menu_option,
        edit_menu_option,
        display_var_option,
        exit_option
    ]
    print_menu(options)
    choose_menu(options)

def fetch_menu():
    pass
    
def edit_menu():
    api_key_option = Option("Edit API KEY", edit_api_key)
    version_option = Option("Edit version", edit_version)
    riot_id_option = Option("Edit riot ID", edit_riot_id)
    back_option = Option("Main menu", lambda *args: None)
    options = [
        api_key_option,
        version_option,
        riot_id_option,
        back_option
    ]
    print_menu(options)
    choose_menu(options)

def edit_api_key():
    print("Enter new API KEY:")
    global API_KEY
    API_KEY = input()

def edit_version():
    print("Enter new version:")
    VERSION = input()

def edit_riot_id():
    print("Enter new riot ID:")
    RIOT_ID = input()

def display_variables():
    if API_KEY is not None: print(f'API_KEY: {API_KEY}')
    if VERSION is not None: print(f'Version: {VERSION}')
    if RIOT_ID is not None: print(f'Riot ID: {RIOT_ID}')

if __name__ == '__main__':
    DIR = 'data/'

    # Editable variables
    API_KEY = None
    VERSION = None
    RIOT_ID = None

    while(True):
        main_menu()
