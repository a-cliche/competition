$(function(){

	// FRONTEND

	$('.submit').on('click', function(e){
		e.preventDefault();

		$('.allTeams').empty();

		var numberOfTeams = Number($('#teams').val().trim()),
			numberOfRounds = Number($('#rounds').val().trim());

		var teams = [];

		if(numberOfTeams>0 && numberOfRounds>0){
			teams = generateTeams(numberOfTeams);

			playRounds(teams,numberOfRounds);
		}

	})

	function generateTeams(num){
		var teams = [];

		for(var i = 1; i < num + 1; i++){
			teams.push({
				id: i,
				name: "Team " + i,
				score: 0,
				oponents: []
			})
		}

		return teams;
	}

	function playRounds(teams, rounds){
		var sameScoresArray = [];

		var groups = splitInTwo(teams);

		teams = playMatches(groups);
		render(teams, 1);

		for(var i = 1; i < rounds; i++) {
			if(checkIfRepeatingScores(teams)){
				sameScoresArray = getSameScoresArrays(teams);

				teams = splitAfterFirstRound(sameScoresArray);
				// resolveConflicts();
				render(teams, i);
			}
			else{
				
				groups =  splitInTwo(teams);

				teams = playMatches(groups);
			}
		}

		var sortedTeams = sortTableByScore(teams);
		render(sortedTeams);
		console.log(teams);
	}


	function splitInTwo(teams){

		var pair = {
			A: [],
			B: []
		};

		teams.forEach(function(t, index){

			if(index<teams.length / 2.0) {
				pair.A.push(t);
			}
			else{
				pair.B.push(t);
			}

		});

		return pair;

	}




	function splitAfterFirstRound(groupsOfSameScores){

		
		var pair,
			arrayOfBarrage = [],
			arrayOfGroups = [];
		
		var groupCount;

		groupsOfSameScores.forEach(function(group,index){

			groupCount = group.length;
			if (groupCount % 2 !== 0 && index < groupCount - 2) {
				var lastTeam = group.pop();
				groupsOfSameScores[index+1].unshift(lastTeam);
			}

			pair = splitInTwo(group);

			// Group of teams with same scores have played extra game. 
			arrayOfBarrage = playMatches(pair);

			arrayOfGroups.push(arrayOfBarrage);


		});

		return flattenArray(arrayOfGroups);

	}


	// Само за една група
	function playMatches(pair){

		var teams = [];



		var wrapper = $('.allTeams');
		var container = $('<table class="table table-bordered" />');
		var thead = $('<thead />');


		thead.append($('<th> Home </th>' + 
					   '<th> Away </th>'));
		wrapper.append(container);
		container.append(thead);


		matchesCount = pair.A.length;

		for(var i=0;i<matchesCount;i++){

			fight(pair.A[i], pair.B[i], container);
		}

		teams = [];
		teams = teams.concat(pair.A,pair.B);

		teams = sortTableByScore(teams);

		return teams;

	}

	function resolveConflicts(sameScoresArray){

		var groups;

		sameScoresArray.forEach(function(sameScoreGroup, index){





		});

	}


	function getSameScoresArrays(teamsArray) {
		var uniqueScores = [];
		var newGroups = [];

		for (i = 0; i < teamsArray.length; i++){
		    if(uniqueScores.indexOf(teamsArray[i].score) === -1){
		        uniqueScores.push(teamsArray[i].score);
		    }
		}

		if(uniqueScores.length == teamsArray.length) {
			return teamsArray;
		}

		for (i = 0; i < uniqueScores.length; i++) {
			newGroups[i] = [];

			newGroups[i] = teamsArray.filter(function(item) {
				return item.score === uniqueScores[i];
			});
		}

		for (i = 0; i < newGroups.length; i++) {
			newGroups[i] = newGroups[i].sort(function(a, b) {
				return a.id - b.id;
			});
		}

		// console.log('newGroups', newGroups);
		return newGroups;
	}


	function fight(home, away, container){
		var result = Math.round(Math.random()*10)/10;

		
		if (!away) {
			home.score += 1;
		} else {

			if(!checkIfMetBefore(home,away)){

				if(result<0.3){
					home.score ++;
				}
				else if(result>0.6){
					away.score ++;
				}
				else{
					home.score += 0.5;
					away.score += 0.5;
				}

				home.oponents.push(away.id);
				away.oponents.push(home.id);

			}
		}
	
		

		var tbody = $('<tbody><tr></tr></tbody>');
		container.append(tbody);
		tbody.find('tr').append($('<td>Name: ' + home.name + '; Score: ' + home.score + '</td>'));

		if (away) {
			tbody.find('tr').append($('<td>Name: ' + away.name + '; Score: ' + away.score + '</td>'));
		}

		// wrapper.append(container);
	}


	function checkIfMetBefore(home,away) {
		return home.oponents.indexOf(away.id) !== -1;
	}

	function checkIfRepeatingScores(teamsArray) {
		var uniqueScores = [];

		for (i = 0; i < teamsArray.length; i++){
		    if(uniqueScores.indexOf(teamsArray[i].score) === -1){
		        uniqueScores.push(teamsArray[i].score);
		    }
		}

		if(uniqueScores.length == teamsArray.length) {
			return false;
		}

		return true;

	}



	function updateTable(old,newResults){
		for(i=0; i<old.length; i++){
			for(j=0; j<newResults.length; j++){
				if(old[i].id===newResults[j].id){
					old[i] = newResults[j];
				}
			}
		}

		return old;
	}





	function render(teams, currentRound){
		var allTeamsContainer = $('.allTeams');
		var allTeamList = $('<ul />'),
			html = '';
		var round = currentRound + 1;

		allTeamsContainer.append($('<p>Round ' + round + '</p>'));

		// allTeamList.html('');

		teams.forEach(function (item,i){

			html = '<li><p> ID:' + item.id + ', Name: ' + item.name + ', Score: ' + item.score + '</p></li>';

			allTeamList.append($(html));
		});

		allTeamsContainer.append(allTeamList);

	}

	function flattenArray(arr){
		return [].concat.apply([], arr);
	}

	function sortTableByScore(teams){
		return teams.sort(function (a, b) {
		  return b.score - a.score;
		});
	}

});
