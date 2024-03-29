function drawIcicle(masteries) {
    totalMastery = [{
        championPoints: masteries.reduce((a, c) => a + c.championPoints, 0)
    }]

    classMasteries = masteries.reduce((a, c) => {
        if (!a[c.championTag]) {
            a[c.championTag] = {}
            a[c.championTag].championTag = c.championTag
            a[c.championTag].championPoints = 0
        }
        a[c.championTag].championPoints += c.championPoints
        return a
    }, {})

    const color = {
        'Support': '#1f77b4',
        'Assassin': '#ff7f0e',
        'Tank': '#2ca02c',
        'Fighter': '#d62728',
        'Mage': '#9467bd',
        'Marksman': '#8c984b'   
    }
    classMasteriesArray = []
    for (tag in classMasteries) {
        classMasteriesArray.push(classMasteries[tag])
    }
    classMasteriesArray.sort((a, b) => classMasteries[a.championTag].championPoints < classMasteries[b.championTag].championPoints)
    masteries.sort((a, b) => classMasteries[a.championTag].championPoints < classMasteries[b.championTag].championPoints)

    const SVG = d3.select('#viz-container').append('svg')
    SVG_WIDTH = window.innerWidth * 0.8
    SVG_HEIGHT = 750
    SVG.attr("width", SVG_WIDTH)
        .attr("height", SVG_HEIGHT)
        .style("margin", "auto")
    BAR_WIDTH = SVG_WIDTH / 3
    FONT_SIZE = 14
    TOP_TEXT_X_OFFSET = 0
    TOP_TEXT_Y_OFFSET = 0

    let nextY = 0
    const computeHeight = (d) => {
        return d.championPoints / totalMastery[0].championPoints * SVG_HEIGHT
    }
    sepSize = 1

    // Total
    totalGroup = SVG.append("g")
    let totalBar = totalGroup.data(totalMastery)
        .append("rect")
        .attr("width", BAR_WIDTH)
        .attr("height", SVG_HEIGHT)
        .style("font-size", FONT_SIZE + "px")
        .style("fill", "#CCA300")
    let totalText = totalGroup.data(totalMastery)
        .append("text")
        .attr("y", 21)
        .text(d => "Total " + d.championPoints)

    // Class
    let classGroup = SVG.append("g")
    let classBar = classGroup.selectAll("g")
        .data(classMasteriesArray)
        .enter()
        .append("g")
        .style("font-size", FONT_SIZE + "px")
        .attr("transform", d => {
            let y = nextY
            nextY += computeHeight(d)
            return "translate(0, " + y + ")"
        })
    classBar.append("rect")
        .attr("x", BAR_WIDTH)
        .attr("width", BAR_WIDTH)
        .attr("height", d => {
            return computeHeight(d) - sepSize            
        })
        .style("fill", d => color[d.championTag])
    classBar.append("rect")
        .attr("x", BAR_WIDTH)
        .attr("y", d => computeHeight(d) - sepSize)
        .attr("width", BAR_WIDTH)
        .attr("height", sepSize)
    classBar.append("text")
        .attr("x", BAR_WIDTH)
        .attr("y", (d) => 21)
        .text(d => {
            if (computeHeight(d) < 14) return ''
            return d.championTag + ' ' + d.championPoints
        })
    
    // Champions
    nextY = 0
    let championGroup = SVG.append("g")
    // Groups
    let championBar = championGroup.selectAll("g")
        .data(masteries)
        .enter()
        .append("g")
        .style("font-size", FONT_SIZE + "px")
        .attr("transform", d => {
            let y = nextY
            nextY += computeHeight(d)
            return "translate(0," + y + ")" 
        })
    // Bars
    championBar.append("rect")
        .attr("x", BAR_WIDTH * 2)
        .attr("width", BAR_WIDTH)
        .attr("height", d => { 
            return computeHeight(d) - sepSize
        })
        .style("fill", d => color[d.championTag])
        .on('click', (e, d) => {
            // tooltip
        })
    // Separators
    championBar.append("rect")
        .attr("x", BAR_WIDTH * 2)
        .attr("width", BAR_WIDTH)
        .attr("height", sepSize)
        .attr("y", d => computeHeight(d) - sepSize)
        .style("fill", "#000")
    championBar.append("text")
        .attr("x", BAR_WIDTH * 2)
        .attr("y", (d) => computeHeight(d) / 2 + 7)
        .text(d => {
            if (computeHeight(d) < 14) return ''
            return d.championName + ' ' + d.championPoints
        })
}
window.drawIcicle = drawIcicle
