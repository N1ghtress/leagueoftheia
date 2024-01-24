function clearViz() {
		const vizContainer = document.querySelector("#viz-container")
		vizContainer.innerHTML = ''
}
window.clearViz = clearViz

function getMasteriesData(puuid) {
    mastery_path = DIR + 'champion_mastery_' + puuid + '.json'
    champion_path = DIR + 'champion_14.1.1.json'
    return [
        d3.json(mastery_path),
        d3.json(champion_path)
    ]
}
window.getMasteriesData = getMasteriesData

function getAccountData(riot_id) {
    account_path = DIR + riot_id + '.json'
    return d3.json(account_path)
}
window.getAccountData = getAccountData

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


function hideSelector() {
	let sel = document.getElementById('mode_select')
	sel.style.display = "none";
}

window.hideSelector = hideSelector

function showSelector() {
	let sel = document.getElementById('mode_select')
	sel.style.display = "block";
}
window.showSelector = showSelector

/* 
	function that will show the table you selected whith the select and hide the other ones
	show is the id of the table you want to show
 */
function changeTableShown(show) {
	name = show + "_Games"
	tables = document.getElementsByTagName('table')
	for(let i = 0; i < tables.length; i++) {
		if(tables[i].id === name) {
			tables[i].style.display = "block";
		}
		else{
			tables[i].style.display = "none";
		}
	}
}
window.changeTableShown = changeTableShown
