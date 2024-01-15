function clearSVG() {
    SVG._groups[0][0].innerHTML = ''
}
window.clearSVG = clearSVG

function getMasteriesData(puuid) {
    return [
        d3.json(DIR + 'champion_mastery_' + puuid + '.json'), 
        d3.json(DIR + 'champion_14.1.1.json')
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

