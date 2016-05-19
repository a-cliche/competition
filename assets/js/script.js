$(function(){

	// FRONTEND 

	$('.submit').on('click', function(e){
		e.preventDefault();

		var numberOfTeams = Number($('#teams').val().trim()),
			numberOfRounds = Number($('#rounds').val().trim());

		var teams = [];

		if(numberOfTeams>0 && numberOfTeams>0){
			teams = generateTeams(numberOfTeams);

			generateTables(teams,numberOfRounds);
		}	

	})

	function generateTeams(num){
		var teams = [];

		for(var i = 1; i < num + 1; i++){
			teams.push({
				id: i,
				name: "Team " + i,
				score: 0
			})
		}

		return teams;
	}

	function generateTables(teams,rounds){

		var	groupA = [],
			groupB = [];

		var allTeams = [];
		var groups = []; //Array of objects(pairs of groups)

		groups = makeGroupPairs([teams]);

		for(var i=0;i<rounds;i++){

			if( i !== 0) {
				groups = makeGroupPairs([allTeams]);
			}

			allTeams = playRound(groups);

		}

		render(allTeams);
	}



	function playRound(groups){
		var teams = [],
			resolved = [];

		playMatches(groups);

		teams = uniteGroups(groups);

		while(checkIfRepeatingScores(teams)){

			resolved = resolveConflicts(teams);

			teams = updateTable(teams,resolved);

		}

		teams = sortTableByScore(teams);

		return teams;
	}



	function resolveConflicts(teams) {
		var temp = [],
			resolved = [];
		
		temp = getGroupsWithEqualScore(teams);

		resolved = makeGroupPairs(temp);

		playMatches(resolved);

		return resolved;
	}




	// Splits groups in two
	function makeGroupPairs(groupsArray) {
		var groupCount = groupsArray.length,
			result = [];

		for (i = 0; i < groupCount; i++) {
			var groupA=[],
				groupB=[];


			if (groupsArray[i].length % 2 !== 0 && i < groupCount - 1) {
				var lastTeam = groupsArray[i].pop();
				groupsArray[i+1].unshift(lastTeam);
			}

			groupsArray[i].forEach(function(item,index){
				if(index<groupsArray[i].length/2.0) {
					groupA.push(item);
				}
				else {
					groupB.push(item);
				}
			})

			if(groupA.length && groupB.length){
				result.push([groupA,groupB]);
			}
			else if(groupA.length){
				result.push([groupA,[]]);	
			}
			else if(groupB.length){
				result.push([groupB,[]]);
			}
		}


		return result;
	}



	function getGroupsWithEqualScore(teamsArray) {
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

		return newGroups;
	}




	function uniteGroups(groups) {
		var teams = [];

		groups.forEach(function(pair, i) {
			pair.forEach(function(group, i) {
				teams.push(group);
			});
		});

		teams = flattenArray(teams);

		teams = sortTableByScore(teams);

		return teams;
	}



	function playMatches(groups){

		var A,B,
			matchesCount = 0;

		groups.forEach(function(pair){

			A = pair[0];
			B = pair[1];
			matchesCount = A.length;

			for(var i=0;i<matchesCount;i++){
				fight(A[i], B[i]);
			}

		});
	}



	function fight(home,away){
		var result = Math.round(Math.random()*10)/10;

		if (!away) {
			home.score += 1;
		} else {
			if(result<0.5){
				home.score ++;
			}
			else if(result>0.5){
				away.score ++;
			}
			else{
				home.score += 0.5;
				away.score += 0.5;
			}
		}

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





	function render(teams){
		var allTeamList = $('.allTeams'),
			html = '';

		allTeamList.html('');

		teams.forEach(function (item,i){

			html = '<li><p> ID:' + item.id + ', Name: ' + item.name + ', Score: ' + item.score + '</p></li>';

			allTeamList.append($(html));
		});
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
