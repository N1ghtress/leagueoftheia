const width = window.innerWidth
const height = window.innerHeight
const dir = 'data/'

let svg = d3.select('body').append('svg')

champion_mastery = d3.json(dir + 'champion_mastery_Bmn5dAH2VEy0fvqIHRrHtIV1-4iJd5hlW-R9DOSR7Ds5hR07ZgAtdGyeE5MQmVuY0A_9y2g_ygHscA.json')
champion = d3.json(dir + 'champion_14.1.1.json')

Promise.all([champion_mastery, champion]).then((results) => {
    let masteries = results[0]
    let champion = results[1]
    console.log(champion, masteries)

    masteries = prepareData(champion, masteries)
    bars = drawBars(masteries)
})

function prepareData(champion, masteries) {
    idNameMap = {}
    for (const champ in champion.data) {
        idNameMap[champion.data[champ].key] = champ
    }
    masteries.forEach((m) => {
        m.championName = idNameMap[m.championId]
        m.championImage = idNameMap[m.championId] + '.png'
    })
    return masteries
}

function drawBars(masteries) {
    const color = d3.scaleLinear()
        .range(["red", "blue"])
        .domain([
            d3.min(masteries, d => d.championPoints),
            d3.max(masteries, d => d.championPoints)
        ])
    
    // Size of a single data
    const xSize = d3.scaleLinear()
        .range([0, width])
        .domain([
            d3.min(masteries, d => d.championPoints),
            d3.max(masteries, d => d.championPoints)
        ])
    const ySize = 30

    // Size of svg
    svg.attr("width", width * 0.8)
        .attr("height", masteries.length * ySize)
        .style("margin", "auto")

    bars = svg.selectAll("rect").data(masteries)
    bars.join("rect")
        .attr("y", (d, i) => ySize * i)
        .attr("width", (d) => xSize(d.championPoints))
        .attr("height", ySize)
        .style("fill", (d) => color(d.championPoints))
    return bars
}
