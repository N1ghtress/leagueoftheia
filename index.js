const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DIR = 'data/'
const SVG = d3.select('div').append('svg')
const NAV_TABS = document.querySelector(".nav-tabs").children

let PUUID = ''
let SELECTED_TAB = NAV_TABS[0]

NAV_TABS[0].onclick = () => {
    window.changeTab(NAV_TABS[0])
    window.clearSVG()
    if (PUUID === '') return

    promises = window.getMasteriesData(PUUID)
    Promise.all(promises).then(results => {
        let masteries = window.prepareMasteriesData(results[1], results[0])
        window.drawIcicle(masteries)
    })
}

NAV_TABS[1].onclick = () => {
    window.changeTab(NAV_TABS[1])
    window.clearSVG()
    if (PUUID === '') return 

    // Get data 
    // Viz
}

const puuidInput = document.querySelector('#puuid-input')
puuidInput.onchange = (e) => {
    if (e.target.value === '') return

    PUUID = e.target.value
    SELECTED_TAB.click()
}

