const rounds = [10000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000]
function drawBubbles(masteries) {
    let maxPoints = d3.max(masteries, d => d.championPoints)
    let scale = getScale(maxPoints)

    const svg = d3.select('#viz')
    SVG_WIDTH = Math.min(window.innerWidth, window.innerHeight) * 0.9
    SVG_HEIGHT = Math.min(window.innerWidth, window.innerHeight) * 0.9
    MAX_RADIUS = SVG_WIDTH / 3
    scale = scale.map(e => e * MAX_RADIUS / scale[scale.length - 1])

    let bubbles = svg.selectAll("circle")
}
window.drawBubbles = drawBubbles

function getScale(maxPoints) {
    for (let i = 0; i < rounds.length; i++) {
        if (rounds[i] > maxPoints) {
            return rounds.slice(0, i+1)
        }
    }
}
