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
	game is the data of a spécifique game
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
	title is the title of the table
	columns is the columns names
*/
function tabulate(data, title, columns, puuid) {
		let table = d3.select('div').append('table').attr('id', title)
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
		
		
		
		columnsName = Object.keys(columns)
		
		// append average stats
		thead.append('tr')
		.selectAll('th')
		.data(columnsName).enter()
		.append('th')
		.text(function (column) {
				return column + " : " + columns[column].toFixed(2);;
		})
		
		
		// append the header row
		thead.append('tr')
		.selectAll('th')
		.data(columnsName).enter()
		.append('th')
		.text(function (column) {
			if(column === 'winRate')
				return 'win'
			else {
				return column;
			}
		})
		
		// create a row for each object in the data
		let rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .each(function (d) {})
		  .append('tr');

		
		let cells = rows.selectAll('td')
		  .data(function (matchInfo) {
			return columnsName.map(function (column) {
				let pid = getPlayerId(matchInfo, puuid)
				if (column === 'winRate') {
					if(matchInfo['info']['participants'][pid]['win'])
						winIcon = '✔'
					else{
						winIcon = '✖'
					}
					return {column: column, value: winIcon}; 
				}
			  return {column: column, value: matchInfo['info']['participants'][pid][column]};
			});
		  })
		  .enter()
		  .append('td')
			.text(function (d) {return d.value;})

	  return table;
	}


function drawMatchHistory(puuid, type, nb_games) {
	history_path = DIR + 'match_id_'+ type + '_' + nb_games + '_' + puuid + '.json'
	d3.json(history_path).then(function(data) {
		let res = prepareHistoryData(data, puuid)
		// render the tables
		tabulate(res[0], ['ARAM'], res[2]['ARAM'], puuid);
		tabulate(res[1], ['Ranked'], res[2]['ranked'], puuid);
		document.getElementById('Ranked').style.display = "none";
	})


	


}