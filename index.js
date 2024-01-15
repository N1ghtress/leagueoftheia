const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DIR = 'data/'
const SVG = d3.select('div').append('svg')
const NAV_TABS = document.querySelector(".nav-tabs").children
const PUUID = ''

const puuidInput = document.querySelector('#puuid-input')
puuidInput.onchange = (e) => {
    const PUUID = e.target.value
    if (PUUID === '') {
        window.displayIcicle(PUUID)
    }
}
let SELECTED_TAB = NAV_TABS[0]

NAV_TABS[0].onclick = () => {
    let tab = NAV_TABS[0]
    if (SELECTED_TAB === tab) return

    SELECTED_TAB.children[0].classList.remove("active")
    tab.children[0].classList.add("active")
    SELECTED_TAB = tab
    window.clearSVG()
    if (PUUID === '') {
        window.displayIcicle(PUUID)
    }
}

NAV_TABS[1].onclick = () => {
    let tab = NAV_TABS[1]
    if (SELECTED_TAB === tab) return

    SELECTED_TAB.children[0].classList.remove("active")
    tab.children[0].classList.add("active")
    SELECTED_TAB = tab
    window.clearSVG()
    if (PUUID ==='') {
        // Viz
    }
}
