const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DIR = 'data/'
const SVG = d3.select('div').append('svg')
const NAV_TABS = document.querySelector(".nav-tabs").children
const PUUID = 'Bmn5dAH2VEy0fvqIHRrHtIV1-4iJd5hlW-R9DOSR7Ds5hR07ZgAtdGyeE5MQmVuY0A_9y2g_ygHscA'

let SELECTED_TAB = NAV_TABS[0]
window.displayIcicle(PUUID)

NAV_TABS[0].onclick = () => {
    let tab = NAV_TABS[0]
    if (SELECTED_TAB === tab) return

    SELECTED_TAB.children[0].classList.remove("active")
    tab.children[0].classList.add("active")
    SELECTED_TAB = tab
    window.clearSVG()
    window.displayIcicle(PUUID)
}

NAV_TABS[1].onclick = () => {
    let tab = NAV_TABS[1]
    if (SELECTED_TAB === tab) return

    SELECTED_TAB.children[0].classList.remove("active")
    tab.children[0].classList.add("active")
    clearSVG()
    // Other viz missing here
    SELECTED_TAB = tab
}
