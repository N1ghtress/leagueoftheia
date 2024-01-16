function clearSVG() {
    SVG._groups[0][0].innerHTML = ''
}
window.clearSVG = clearSVG

function getMasteriesData(puuid) {
    mastery_path = DIR + 'champion_mastery_' + puuid + '.json'
    champion_path = DIR + 'champion_14.1.1.json'
    return [
        d3.json(mastery_path),
        d3.json(champion_path)
    ]
}
window.getMasteriesData = getMasteriesData

function prepareMasteriesData(champion, masteries) {
    let idNameMap = {}
    for (const champ in champion.data) {
        idNameMap[champion.data[champ].key] = champ
    }
    masteries.forEach((m) => {
        m.championName = idNameMap[m.championId]
        m.championImage = idNameMap[m.championId] + '.png'
        m.championTag = champion.data[idNameMap[m.championId]].tags[0]
    })
    return masteries
}
window.prepareMasteriesData = prepareMasteriesData

function changeTab(newTab) {
    SELECTED_TAB.children[0].classList.remove("active")
    newTab.children[0].classList.add("active")
    SELECTED_TAB = newTab
}
window.changeTab = changeTab
