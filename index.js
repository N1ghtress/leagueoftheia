const account_by_riot_id = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id"

const key_input = document.querySelector("#key")
let key = ""
key_input.onchange = (e) => {
    key = e.target.value
}

const riot_id_input = document.querySelector("#riot-id")
let riot_id = ""
riot_id_input.onchange = (e) => {
    riot_id = e.target.value
}

const search_button = document.querySelector("#search")
search_button.onclick = (e) => {
    if (riot_id === "" || key === "") {
        console.error("Missing api key or riot id!")
        return
    }

    let chunks = []
    chunks.push(account_by_riot_id)
    chunks = chunks.concat(riot_id.split("#"))
    const url = chunks.join("/")
    console.log(url)
    const request = new Request(url, {
        method: "GET",
        headers: {
            "X-Riot-Token": key, // API KEY HERE
            "Origin": "https://developer.riotgames.com"
        },
        mode: "cors",
        cache: "default",
    })

    fetch(request).then((response) => {
        console.log(response)
    })
}
