/*
	historic a json data set of the riot API of one or more games
	puuid the id of the player you want to get the stat of
	return an array with array[0] being the ARAM historic, array[1] the ranked historic and array[2] the average stat on ARAM and ranked
	this function currently only splits into ARAM and ranked game, other game modes are not supported yet
*/
function prepareHistoryData(historic, puuid) {
	let avgStat = {'ranked' : {}, 'ARAM': {}}
	let hist = historic
	const filter_ARAM = Object.entries(hist).filter(([key, value]) => value['info']['gameMode'] === 'ARAM');
	const filter_ranked = Object.entries(hist).filter(([key, value]) => value['info']['gameMode'] === 'CLASSIC');
	
	let hist_ranked = Object.fromEntries(filter_ranked);
	let hist_ARAM = Object.fromEntries(filter_ARAM);
	avgStat['ranked']['kills'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['kills']
		})
	avgStat['ranked']['deaths'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['deaths']
		})
	avgStat['ranked']['assists'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['assists']
		})
	avgStat['ranked']['totalMinionsKilled'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalMinionsKilled']
		})
	avgStat['ranked']['goldEarned'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['goldEarned']
		})
	avgStat['ranked']['goldSpent'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['goldSpent']
		})
	avgStat['ranked']['totalDamageDealtToChampions'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalDamageDealtToChampions']
		})
	avgStat['ranked']['totalDamageTaken'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalDamageTaken']
		})
	avgStat['ranked']['damageSelfMitigated'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['damageSelfMitigated']
		})
	avgStat['ranked']['damageDealtToObjectives'] = d3.mean(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['damageDealtToObjectives']
		})
	avgStat['ranked']['winRate'] = (d3.sum(filter_ranked, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['win']
		}))/filter_ranked.length
		
	
		
	
	avgStat['ARAM']['kills'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['kills']
		})
	avgStat['ARAM']['deaths'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['deaths']
		})
	avgStat['ARAM']['assists'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['assists']
		})
	avgStat['ARAM']['totalMinionsKilled'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalMinionsKilled']
		})
	avgStat['ARAM']['goldEarned'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['goldEarned']
		})
	avgStat['ARAM']['goldSpent'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['goldSpent']
		})
	avgStat['ARAM']['totalDamageDealtToChampions'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalDamageDealtToChampions']
		})
	avgStat['ARAM']['totalDamageTaken'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['totalDamageTaken']
		})
	avgStat['ARAM']['damageSelfMitigated'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['damageSelfMitigated']
		})
	avgStat['ARAM']['damageDealtToObjectives'] = d3.mean(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['damageDealtToObjectives']
		})
	avgStat['ARAM']['winRate'] = (d3.sum(filter_ARAM, ([key,data]) => {
		let pid = getPlayerId(data, puuid)
		return data['info']['participants'][pid]['win']
		}))/filter_ARAM.length
	hist_ARAM = convertDictToArray(hist_ARAM)
	hist_ranked = convertDictToArray(hist_ranked)
	return [hist_ARAM,hist_ranked,avgStat]
}

function convertDictToArray(data) {
	data = Object.values(data)
	return data
}

/*
	return the player id in the game
	game is the data of a specifique game
*/
function getPlayerId(game, puuid) {
	let players = game['metadata']['participants']
	let player_id = 0
	while (players[player_id] !== puuid) {
		player_id++
	}
	return player_id
}

/*
	return the match position in data
	game is the data an iterable object of one or more match information
*/
function getMatchFromMatchId(games, matchID) {
	let gameID = 0
	while (games[gameID]['metadata']['matchId'] !== matchID) {
		gameID++
	}
	return gameID
}

function templateTableMatch() {
	window.clearViz()
	window.hideSelector()
	let table = d3.select('#viz-container')
				.append('table')
				.attr('id', 'MatchInfo')
				.classed('table', true)
				.classed('table-striped', true)
				.classed('table-hover', true)
	return table
}

/*
	function to draw the table showing the statistics of a spécifique game 
	data the complete information of a game
*/
function setTableMatch(data, gameMode, statAVG ,puuid) {
	let table = d3.select('#MatchInfo')
	let thead = table.append('thead')
	let tbody = table.append('tbody')
	const columnsName = Object.keys(statAVG)
	const nameStatCol = ["Stat Name","Game stat", "Average", "Progress"]
	thead.append('tr')
		.append('th')
		.text("Game mode : "+ gameMode)
		.attr("width", "10%")
	
	// append the header row
	thead.append('tr')
	.selectAll('th')
	.data(nameStatCol).enter()
	.append('th')
	.text(function (d) {return d;})
	
	// create a row for each object in the data
	let rows = tbody.selectAll('tr')
	  .data(columnsName)
	  .enter()
	  .filter(function (d) {if(d !== 'winRate'){return d}})
	  .append('tr')
	  
	  let cells = rows.selectAll('td')
		  .data(function (statName) {
			return nameStatCol.map(function (column) {
				let pid = getPlayerId(data, puuid)
				if (column === "Stat Name") {
					return {column: column, value: statName};
				} else if (column === "Game stat"){
					return {column: column, value: data['info']['participants'][pid][statName]};
				} else if (column ==="Progress") {
					playerData = data['info']['participants'][pid][statName] //player stat in the game
					playerAVG = statAVG[statName] //player average stat
					progress = ((((playerData/(playerAVG)))-1)*100).toFixed(3)
					let progressText = ""
					if (progress > 0){
						
					}
					progressText = progress
					return {column: column, value: progressText}
					
				} else if (column ==="Average"){
					return {column: column, value: statAVG[statName].toFixed(3)}
				}
			});
		  })
		  .enter()
		  .append('td')
			.text(function (d) {return d.value;})
	  
	
	return table
	
}



/*
	title is the title of the table
	columns is the columns names
*/
function tabulateHist(data, title, columns, AVGStat , puuid) {
	let table = d3.select('#viz-container')
				.append('table')
				.attr('id', title)
				.classed('table', true)
				.classed('table-striped', true)
				.classed('table-hover', true)
		let thead = table.append('thead')
		let	tbody = table.append('tbody');
		
		// append the title row
		thead.append('tr')
		.append('th')
		.text("Game mode : "+ title)
		.attr("width", "10%")
		
		
		thead.append('tr')
		.append('th')
		.text("Average Statistics : ")

		columnsName = Object.keys(AVGStat)
		const width = 50
		const height = 50
		const margin = 2
		const radius = Math.min(width, height) / 2 - margin
		const colors = ["#0096FF","#FF0000"]
		let WLrate = { win : {rate : AVGStat['winRate'] ,color : colors[0]}, lose : {rate : 1 - AVGStat['winRate'], color : colors[1]} }
		
		let pie = d3.pie().value(function(d) {return d[1].rate; })
		WLrate = pie(Object.entries(WLrate))
		
		// append average stats
		thead.append('tr')
		.selectAll('th')
		.data(columnsName).enter()
		.append('th')
		.text(function (column) {
				if (column === "winRate"){
					return column + " : " + (AVGStat[column]*100).toFixed(2) + "%";
				}
				return column + " : " + AVGStat[column].toFixed(3);
		})
		.filter(function(d){ 
			if(d === "winRate") {
				return d
			}
		})
		.append('svg')
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.selectAll('svg')
		.data(WLrate)
		.enter()
		.append('path')
		.attr('d', d3.arc()
			.innerRadius(10)
			.outerRadius(radius)
		)
		.attr('fill', function(d){return d.data[1].color})
		.attr("stroke", "black")
		.style("stroke-width", "2px")
		.style("opacity", 0.7);
		
		
		// append the header row
		thead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
		.text(function (column) {
			if(column === 'winRate'){
				return 'win'
			} else {
				return column;
			}
		})
				
		
		// create a row for each object in the data
		let rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .each(function (d) {})
		  .append('tr')
		  .attr('id', function (d) {return d['metadata']['matchId']})
		  .on("click", function(event) {
				let row = getRowElem(event.target)
				matchID = row.id;
				changeTableShown('MatchInfo')
				let match = getMatchFromMatchId(data, matchID)
				templateTableMatch()
				setTableMatch(data[match], title, AVGStat, puuid)
			});
		
		let cells = rows.selectAll('td')
		  .data(function (matchInfo) {
			return columns.map(function (column) {
				let pid = getPlayerId(matchInfo, puuid)
				if (column === 'win') {
					if(matchInfo['info']['participants'][pid][column]) {
						winIcon = '✔'
					}else{
						winIcon = '✖'
					}
					return {column: column, value: winIcon}; 
				}
				else if (column === 'game_date'){
					 let test = formatDate(matchInfo['info']['gameStartTimestamp'])
					return {column: column, value : test}
				} else if (column === 'KDA'){
					kills = matchInfo['info']['participants'][pid]['kills']
					deaths = matchInfo['info']['participants'][pid]['deaths']
					assists = matchInfo['info']['participants'][pid]['assists']
					return {column: column, value : kills + " / " + deaths + " / " + assists}
				}
				else if (column === "championName") {
					return {column : column, 
							alt : matchInfo['info']['participants'][pid][column],
							src : IMG_DIR + matchInfo['info']['participants'][pid]['championName'] + ".png" }
				}
			  return {column: column, value: matchInfo['info']['participants'][pid][column]};
			});
		  })
		  .enter()
		  .append('td')
			.text(function (d) {if(d.value !== undefined){return d.value;}})
			// filter to add image in td we want. To do that just add src in the object with the right path to the image and an alt which will also be the tooltips
			.filter(function(d){ if(d.src !== undefined) return d; })
			.append('img')
			.attr('src', function(d) {
				return d.src;
			})
			.attr('alt', function(d) {
				return d.alt;
			})
			.attr('title', function(d) {
				return d.alt;
			})
			.attr("width", 50)
			.attr("height",50);
}

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber);

  return date.toLocaleString('en-US', { month: 'long' });
}

/*
	function only work if child of rows don't have ids
*/
function getRowElem(elem) {
    while (elem.id === undefined) {
        elem = elem.parentElement;
    }
	elem = elem.parentElement;
    return elem;
}

function formatDate(timestamp) {
	date = new Date(timestamp)
	month = getMonthName(date.getMonth())
	date_format = date.getDate() + "/" + month + "/" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes()
	return date_format 
}


function drawMatchHistory(puuid, type, nb_games) {
	history_path = DIR + 'match_id_'+ type + '_' + nb_games + '_' + puuid + '.json'
	d3.json(history_path).then(function(data) {
		let res = prepareHistoryData(data, puuid)
		let hist_col = ['game_date','championName', 'KDA','win']
		// render the tables
		tabulateHist(res[0], ['ARAM'],hist_col, res[2]['ARAM'],puuid)
		tabulateHist(res[1], ['Ranked'],hist_col, res[2]['ranked'],puuid)
		
		window.changeTableShown(SELECTED_GAME_MODE)
	})


	


}
