const width = 700, height = 500
const dir = 'data/'

let svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

let g = svg.append('g')

champion_mastery = d3.json(dir + 'champion_mastery_Bmn5dAH2VEy0fvqIHRrHtIV1-4iJd5hlW-R9DOSR7Ds5hR07ZgAtdGyeE5MQmVuY0A_9y2g_ygHscA.json')
champion = d3.json(dir + 'champion_14.1.1.json')

Promise.all([champion_mastery, champion]).then((results) => {
    champion_mastery = results[0]
    champion = results[1]
    console.log(champion, champion_mastery)
})
