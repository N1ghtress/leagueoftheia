const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DIR = 'data/'
const IMG_DIR = 'data/assets/'
const NAV_TABS = document.querySelector(".nav-tabs").children
const SELECT_GAME_MODE = document.getElementById('mode_select')

let PUUID = ''
let SELECTED_TAB = NAV_TABS[0]
let RIOT_ID = ''
let GAME_NAME = ''
let TAG_LINE = ''
let SELECTED_GAME_MODE = document.getElementById('mode_select').value

let masteries = undefined

NAV_TABS[0].onclick = () => {
    window.changeTab(NAV_TABS[0])
    window.clearViz()
    if (!masteries) return
    window.drawIcicle(masteries)
}

NAV_TABS[1].onclick = () => {
    window.changeTab(NAV_TABS[1])
    window.clearViz()
    if (!masteries) return
    window.drawBubbles(masteries)
}

NAV_TABS[2].onclick = () => {
    window.changeTab(NAV_TABS[2])
    window.clearViz()
    window.showSelector()
    window.drawMatchHistory(PUUID,'any','60')
}

SELECT_GAME_MODE.onchange = () => {
	SELECTED_GAME_MODE = document.getElementById('mode_select').value
	window.changeTableShown(SELECTED_GAME_MODE)
}


const riotIDInput = document.querySelector('#riot-id-input')
riotIDInput.onchange = (e) => {
    if (e.target.value === '') return

    RIOT_ID = e.target.value
    GAME_NAME = e.target.value.split('#')[0]
    TAG_LINE = e.target.value.split('#')[1]
    
    window.getAccountData(GAME_NAME + '_' + TAG_LINE).then(account => {
        PUUID = account.puuid
        promises = window.getMasteriesData(PUUID)
        Promise.all(promises).then(results => {
            masteries = window.prepareMasteriesData(results[1], results[0])
            SELECTED_TAB.click()
        })
    })
}
