$(function(){	

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

		var rounds = 1;

		for(var i=0;i<rounds;i++){
			playRound(teams,groupA,groupB);
		}
	  


	}

	function playRound(teams,A,B){

		var matches = teams.length/2.0;

		for(var i=0;i<matches;i++){
			fight(A[i], B[i]);
		}

	}

	function fight(home,away){
		var result = Math.round(Math.random()*10)/10;

		console.log(result)
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

});


