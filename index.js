const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DIR = 'data/'
const IMG_DIR = 'data/assets/'
const NAV_TABS = document.querySelector(".nav-tabs").children

let PUUID = ''
let SELECTED_TAB = NAV_TABS[0]
let RIOT_ID = ''
let GAME_NAME = ''
let TAG_LINE = ''

let masteries = undefined

NAV_TABS[0].onclick = () => {
    window.changeTab(NAV_TABS[0])
    window.clearSVG()
    if (!masteries) return
    window.drawIcicle(masteries)
}

NAV_TABS[1].onclick = () => {
    window.changeTab(NAV_TABS[1])
    window.clearSVG()
    if (!masteries) return
    window.drawBubbles(masteries)
}

const riotIDInput = document.querySelector('#riot-id-input')
riotIDInput.onchange = (e) => {
    if (e.target.value === '') return

    RIOT_ID = e.target.value
    GAME_NAME = e.target.value.split('#')[0]
    TAG_LINE = e.target.value.split('#')[1]
    
    window.getAccountData(GAME_NAME + ':' + TAG_LINE).then(account => {
        PUUID = account.puuid
        promises = window.getMasteriesData(PUUID)
        Promise.all(promises).then(results => {
            masteries = window.prepareMasteriesData(results[1], results[0])
            SELECTED_TAB.click()
        })
    })
}

window.addEventListener("resize", (e) => {
    
})
