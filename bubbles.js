const rounds = [10000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000, 10000000]
function drawBubbles(masteries) {
    let maxPoints = d3.max(masteries, d => d.championPoints)
    let upper = upperBound(maxPoints)

    const svg = d3.select('#viz')
    SVG_WIDTH = Math.min(window.innerWidth, window.innerHeight) * 0.9
    SVG_HEIGHT = Math.min(window.innerWidth, window.innerHeight) * 0.9

    let radius = d3.scaleLinear([0, upper], [10, SVG_WIDTH / 3])
    
    let bubbleGroup = svg.append("g")
    let bubbles = bubbleGroup.selectAll("g")
        .data(masteries)
        .enter()
        .append("g")
        .style("transform", "translate(200, -200)")
    bubbles.append("circle")
        .attr("r", d => {
            return radius(d.championPoints)
        })
}
window.drawBubbles = drawBubbles

function upperBound(maxPoints) {
    for (let i = 0; i < rounds.length; i++) {
        if (rounds[i] > maxPoints) {
            return rounds[i]
        }
    }
}
