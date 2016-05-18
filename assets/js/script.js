$(function(){
	var groups = []; //Array of objects(pairs of groups)
	var allTeams = []; // All teams array

	$.getJSON('assets/data/teams.json', function(res){


		var teams = res.teams;

		generateTables(teams);


	});

	function generateTables(teams){

		var	groupA = [],
			groupB = [];

		teams.forEach(function (item,i){

			item.score = 0;

			if(i<teams.length/2.0){
				groupA.push(item);
			}
			else{
				groupB.push(item);
			}
		});

		var groupPair = [];
		groupPair.push(groupA);
		groupPair.push(groupB);

		groups.push(groupPair);

		var rounds = 1;
		// var matchesCount = teams.length/2.0;

		for(var i=0;i<rounds;i++){

			if( i !== 0) {
				groups = makeGroupPairs(allTeams);
			}

			allTeams = playRound(groups); // Todo: kak da raboti s for

			// if (i !== 0) {
			// 	allTeams = uniteGroups(groups);

			// 	var newGroups = getNewGroups(allTeams);
			// 	// console.log('~~~~~~~');
			// 	// console.log('newGroups', newGroups);
			// 	// console.log('~~~~~~~');
			// 	// console.log('newGroups', newGroups);
			// 	generateTwoTeamsForEachGroup(newGroups);
			// } else {
			// 	playRound(matchesCount,groupA,groupB);
			// }
		}

		render(allTeams);
	}



	function playRound(groups){
		var teams = [],
			newGroupsTemp = [],
			groupesWithEqScore = [];

		playMatches(groups);

		teams = uniteGroups(groups);

		if(getGroupsWithEqualScore(teams)){
			newGroupsTemp = getGroupsWithEqualScore(teams);

			teams = removeRepeatingTeams(teams,newGroupsTemp);

			groupesWithEqScore = makeGroupPairs(newGroupsTemp);

			console.log(groupesWithEqScore);

			// Recursion
			// teams.concat(playRound(groupesWithEqScore));	
		}


		return teams;
	}



	// Removes repeating items from two arrays
	function removeRepeatingTeams(removeFrom,toRemove){

		toRemove = flattenArray(toRemove); 

		for (i = 0; i < removeFrom.length; i++){
			for(j = 0; j < toRemove.length; j++){
			    if(removeFrom[i].id === toRemove[j].id){
			        removeFrom.splice(i, 1);
			    }	
			}
		}

		return removeFrom;
	}


	// Splits groups in two
	function makeGroupPairs(groupsArray) {
		var groupCount = groupsArray.length,
			result = [];

		for (i = 0; i < groupCount; i++) {
			var groupA, groupB;
			var currentGroupLength = 0;

			if (groupsArray[i].length % 2 !== 0 && i < groupCount - 1) {
				var lastTeam = groupsArray[i].pop();
				groupsArray[i+1].splice(0, 1, lastTeam);
			}

			currentGroupLength = groupsArray[i].length;
			groupB = groupsArray[i];
			groupA = groupsArray[i].splice(0, Math.ceil(currentGroupLength / 2.0));

			result.push([groupA,groupB]);
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

		teams.sort(function (a, b) {
		  return b.score - a.score;
		});

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

		// console.log('home', home);
		// console.log('away', away);
		// console.log('-------');
	}




	function render(teams){
		var allTeamList = $('.allTeams'),
			html = '';

		teams.forEach(function (item,i){

			html = '<li><p> ID:' + item.id + ', Name: ' + item.name + ', Score: ' + item.score + '</p></li>';

			allTeamList.append($(html));
		});
	}

	function flattenArray(arr){
		return [].concat.apply([], arr);
	}


});
