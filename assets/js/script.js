$(function(){
	var groups = []; //Array of objects(pairs of groups)
	var allTeams = []; // All teams array

	$.getJSON('assets/data/teams.json', function(res){


		var teams = res.teams;

		generateTables(teams);


	});

	function generateTables(teams){

		var allTeamList = $('.allTeams'),
			groupA = [],
			groupB = [],
			temp;

		teams.forEach(function (item,i){
			temp = '<li><p> ID:' + item.id + ', Name: ' + item.name + '</p></li>';

			allTeamList.append($(temp));

			item.score = 0;

			if(i<teams.length/2.0){
				$('.groupA').append($(temp));
				groupA.push(item);
			}
			else{
				$('.groupB').append($(temp));
				groupB.push(item);
			}
		});

		var groupPair = [];
		groupPair.push(groupA);
		groupPair.push(groupB);
		groups.push(groupPair);

		var rounds = 2;
		var matchesCount = teams.length/2.0;

		for(var i=0;i<rounds;i++){
			if (i !== 0) {
				allTeams = uniteGroups(groups);

				var newGroups = getNewGroups(allTeams);
				// console.log('~~~~~~~');
				// console.log('newGroups', newGroups);
				// console.log('~~~~~~~');
				// console.log('newGroups', newGroups);
				generateTwoTeamsForEachGroup(newGroups);
			} else {
				playRound(matchesCount,groupA,groupB);
			}
		}
	}

	function playRound(matchesCount,A,B){

		for(var i=0;i<matchesCount;i++){
			fight(A[i], B[i]);
		}
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

	function uniteGroups(groups) {
		var teams = [];

		groups.forEach(function(pair, i) {
			pair.forEach(function(group, i) {
				teams.push(group);
			});
		});

		teams = [].concat.apply([], teams);

		teams.sort(function (a, b) {
		  return b.score - a.score;
		});

		return teams;
	}

	function getNewGroups(teamsArray) {
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

	function generateTwoTeamsForEachGroup(groupsArray) {
		var groupCount = groupsArray.length;

		for (i = 0; i < groupCount; i++) {
			var groupA, groupB;
			var currentGroupLength = 0;
			var matchesCount = 0;

			if (groupsArray[i].length % 2 !== 0 && i < groupCount - 1) {
				var lastTeam = groupsArray[i].pop();
				groupsArray[i+1].splice(0, 1, lastTeam);
			}

			currentGroupLength = groupsArray[i].length;
			groupB = groupsArray[i];
			groupA = groupsArray[i].splice(0, Math.ceil(currentGroupLength / 2.0));

			matchesCount = currentGroupLength / 2.0;

			console.log('matchesCount', matchesCount);
			console.log('team ', i);
			console.log('groupA ', groupA);
			console.log('groupB ', groupB);
			playRound(matchesCount,groupA,groupB);
			// console.log('currentGroupLength / 2.0', Math.ceil(currentGroupLength / 2.0));

		}
	}

});
