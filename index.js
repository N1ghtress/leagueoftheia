const width = window.innerWidth
const height = window.innerHeight
const dir = 'data/'

let svg = d3.select('div').append('svg')

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
    pointSum = masteries.reduce((acc, cur) => acc + cur.championPoints, 0)
    console.log(pointSum)

    // Size of svg
    svgWidth = width * 0.8
    svgHeight = 600
    svg.attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("margin", "auto")

    let nextY = 0
    const computeHeight = (d) => d.championPoints / pointSum * svgHeight
    bar = svg.selectAll("g")
        .data(masteries)
        .enter()
        .append("g")
        .attr("transform", (d,i) => {
            let height = computeHeight(d)
            let y = nextY
            nextY += height
            return "translate(0," + y + ")" 
        })

    sepSize = 1
    bar.append("rect")
        .attr("width", svgWidth)
        .attr("height", d => computeHeight(d) - sepSize)
        .style("fill", "#ccc")

    bar.append("rect")
        .attr("width", svgWidth)
        .attr("height", 1)
        .attr("y", d => computeHeight(d) - sepSize)
        .style("fill", "#000")

    bar.append("text")
        .attr("y", (d) => computeHeight(d) / 2 + 6)
        .text(d => {
            return d.championName
        })
    
    return bar
}
