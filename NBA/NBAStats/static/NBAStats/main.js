$(document).ready(function(){

	// Cache frequently used DOM selectors
	var $calendar = $("#datepicker");
	var $gameButtonsList = $("#game_buttons");
	var $teamNames = $('#teamNames');
	var $bGraphName = $('#bGraphName');
	var $team1 = $('#team1');
	var $team1PieChart = $('#team1PieChart');
	var $team2 = $('#team2');
	var $team2PieChart = $('#team2PieChart');
	var $playbyplay = $('#playbyplay')
	var $advTeamName1 = $('#advTeamName1')
	var $advTeamName2 = $('#advTeamName2')
	var $advTeamName3 = $('#advTeamName3')
	var $aboutProject = $('#aboutProject')
	var $boxscoreTitle = $('#boxscoreTitle')

	// Cache graph canvases
	var $BarGraph = $("#BarGraph");
	var $myPieChart1 = $('#myPieChart1');
	var $myPieChart2 = $('#myPieChart2');
	var $myLineChart = $('#myLineChart');
	var $advTeamStats1 = $("#advTeamStats1");
	var $advTeamStats2 = $("#advTeamStats2");
	var $advTeamStats3 = $("#advTeamStats3");

	// Declare graphs as global variables
	var BarGraph;
	var myPieChart1;
	var myPieChart2;
	var myLineChart;
	var advGraph1;
	var advGraph2;
	var advGraph3;

	// Initialize datepicker
	$calendar.datepicker({
		defaultDate: "-1d",
		onSelect: function(date) {
			month = date.slice(0,2); // parse out month
			day = date.slice(3,5);  // parse out 
			year = date.slice(6);  // parse out year
			// console.log("month is " + month + "\nday is " + day + "\nyear is " + year);
			populateGameButtons(date, month, day, year);
		}
	});

	// Initializes the page by setting default date to yesterday and populating game buttons
	// To be called at the bottom of this file
	function initializePage() {
		$calendar.datepicker("setDate", "-1d");
		var dateObj = $calendar.datepicker( "getDate" );
		var options = {month: '2-digit', day: '2-digit', year: 'numeric'};
		var date = dateObj.toLocaleDateString('en-US', options);
		month = date.slice(0,2); // parse out month
		day = date.slice(3,5);  // parse out 
		year = date.slice(6);  // parse out year
		// console.log(date);
		// console.log("month is " + month + "\nday is " + day + "\nyear is " + year);
		populateGameButtons(date, month, day, year);		
	}

	function populateGameButtons(date, month, day, year){
		console.log("you called populateGameButtons()");
		$.ajax({
			url : "populate_game_buttons/", // the endpoint
			type : "POST", // http method
			data : {
				date : date,
				month : month,
				day : day,
				year : year
			},
			success : function(json) {
				console.log(json); // log the returned json to the console
				$gameButtonsList.empty(); // delete games from previously selected date
				$.each(json.game_ids, function(i, val){ // add a button for each game
					// console.log(i + " " + val);  // print game IDs
					// $gameButtonsList.append("<li><input type='button' value='"+json.teamsList[i][0]+" vs. "+json.teamsList[i][1]+"' class='game' id='"+val+"'></li>");
					$gameButtonsList.append("<li><button id='"+val+"' class='game'>"+json.teamsList[i][0]+"<br>vs.<br>"+json.teamsList[i][1]+"</button></li>");
				});
				console.log("SUCCESS!"); // sanity check
			},

			error : function(xhr,errmsg,err) {
				alert(errmsg);
				console.log(xhr.status + ": " + xhr.responseText);
			}
		});
	}

	// event handling for click on a game button
	$(document).on("click", ".game", function() {
		var gameID = $(this).attr('id');
		showStats(gameID);
	});

	// Wrapper function for loading and visualizing the game stats
	function showStats(gameID) {
		console.log("You called showStats() with game: " + gameID); // sanity check
		$.ajax({
			url : "get_game_data/", // the endpoint
			type : "POST", // http method
			data : {
				gameID : gameID
			},
			success : function(json) {
				console.log(json);

				// Create Bar Graph
				teams = json.teams;
				$teamNames.text(teams[0] + " vs. " + teams[1]);
				$bGraphName.text("Team Points by Quarter");
				$team1.text("Home Team: " + teams[0]);
				$team1PieChart.text("Score Contribution");
				$team2.text("Away Team: " + teams[1]);
				$team2PieChart.text("Score Contribution");

				homeTeamScores = json.quarterPoints[0];
				awayTeamScores = json.quarterPoints[1];
				createBarGraph(homeTeamScores, awayTeamScores, teams);

				// Create Pie Graph
				players = json.players;
				// console.log(players[0]);
				// console.log(players[1]);
				// console.log(players[2]);
				// console.log(players[3]);

				createPieGraph1(players[0], players[1]);
				createPieGraph2(players[2], players[3]);

				// Create Line Chart
				plays = json.playbyplay;
				$playbyplay.text("Score Timeline");
				createLineChart(plays[2], plays[0], plays[1], teams);

				// Create Team Advanced Charts
				$advTeamName1.text("Team Advanced Percentage Statistics");
				$advTeamName2.text("Team Advanced Assist-Turnover Statistics");
				$advTeamName3.text("Team Advanced Rating");
				createAdvancedGraph1(json.teamAdvanced[0], json.teamAdvanced[3], teams);
				createAdvancedGraph2(json.teamAdvanced[1], json.teamAdvanced[4], teams);
				createAdvancedGraph3(json.teamAdvanced[2], json.teamAdvanced[5], teams);

				// Create Regular Boxscore
				$aboutProject.show();
				$boxscoreTitle.show();
				addBoxscore(json.boxscore[0], json.boxscore[1]);

			},

			error : function(xhr,errmsg,err) {
				alert(errmsg);
				console.log(xhr.status + ": " + xhr.responseText);
			}
		});

	}

	// creates the bar graph for quarter scores
	function createBarGraph(homeTeamScores, awayTeamScores, teams) {
		var barCtx = $BarGraph;
		var barData = {
			labels: ["Start", "Q1", "Q2", "Q3", "Q4", "Total"],
			datasets: [
			   	{
					label: teams[0],
					backgroundColor: '#49b880',
					borderColor: '#5BCE20',
					borderWidth: 1,
					data: homeTeamScores
			   },
			   {
					label: teams[1],
					backgroundColor: '#E84A5f',
					borderColor: '#243D6C',
					data: awayTeamScores
			   }
		   ]
		};
		if (BarGraph != null) {
			BarGraph.destroy(); // delete the existing chart
		}
		BarGraph = new Chart(barCtx, {
			type: 'bar',
			data: barData
		});
	}

	// creates a pie chart for the home team
	function createPieGraph1(players1, scores1) {
		var i; // for loop index
		var colors1 = []; // initiate loop for colors
		for (i = 0; i < scores1.length; i++) { // generate random colors for pie chart
			colors1.push(getRandomColor());
		}

		var pieCtx1 = $myPieChart1;
		var data1 = {
			labels: players1,
			datasets: [
			   {
				data: scores1,
				backgroundColor: colors1
			   }
			]
		};
		if (myPieChart1 != null) {  // clear existing pie chart
			myPieChart1.destroy();
		}
		myPieChart1 = new Chart(pieCtx1,{
		 type: 'doughnut',
		 data: data1
		});
	}

	// creates a pie chart for the away team
	function createPieGraph2(players2, scores2) {
		var i; // for loop index
		var colors2 = []; // empty loop for colors
		for (i = 0; i < scores2.length; i++) { // generate random colors for pie chart
			colors2.push(getRandomColor());
		}

		var pieCtx2 = $myPieChart2;
		var data2 = {
			labels: players2,
			datasets: [
			   {
				   data: scores2,
				   backgroundColor: colors2
			   }]
		};
		if (myPieChart2 != null) {  // clear existing pie charts
			myPieChart2.destroy();
		}
		myPieChart2 = new Chart(pieCtx2,{
		 type: 'doughnut',
		 data: data2
		});
	}

	// creates the line chart for plays of the game
	function createLineChart(period_Data, homeTeam, awayTeam, teams) {
		var lineCtx = $myLineChart;
		var lineData = {
			labels: period_Data,
			datasets: [
				{
					label: teams[0],
					fill: false,
					lineTension: 0.1,
					backgroundColor: "#ff000a",
					borderColor: "#999999",
					borderCapStyle: 'round',
					borderWidth: 5,
					borderJoinStyle: 'bevel',
					pointBorderColor: "#ff000a",
					pointBackgroundColor: "#999999",
					pointBorderWidth: 2,
					pointHoverRadius: 7,
					pointHoverBackgroundColor: "#ff000a",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: homeTeam,
					spanGaps: false
				},
				{
					label: teams[1],
					fill: false,
					lineTension: 0.1,
					backgroundColor: "#0033CC",
					borderColor: "#2bcc1a",
					borderCapStyle: 'round',
					borderWidth: 5,
					borderJoinStyle: 'bevel',
					pointBorderColor: "#0033CC",
					pointBackgroundColor: "#2bcc1a",
					pointBorderWidth: 2,
					pointHoverRadius: 7,
					pointHoverBackgroundColor: "#0033CC",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: awayTeam,
					spanGaps: false
				}
			]
		};
		if (myLineChart != null) {  // delete existing line chart
			myLineChart.destroy();
		}
		myLineChart = new Chart(lineCtx, {
			 type: 'line',
			 data: lineData
		 });
	}

	// generate a random color in the format '#000000'
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 3; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	function removeBoxscore() {
		homeBoxscore = document.getElementById("homeBoxscore");
		if (homeBoxscore) homeBoxscore.parentNode.removeChild(homeBoxscore);

		awayBoxscore = document.getElementById("awayBoxscore");
		if (awayBoxscore) awayBoxscore.parentNode.removeChild(awayBoxscore);
	}

	function addBoxscore(homeTeam, awayTeam) {
		removeBoxscore();
		var boxscoreDiv = document.getElementById("regBoxscore");

		var homeTable = document.createElement('TABLE');
		homeTable.className = "table table-condensed ";
		homeTable.id = "homeBoxscore";

		var heading = [];
		heading[0] = "Player_Name";
		heading[1] = "Mins";
		heading[2] = "FGM";
		heading[3] = "FGA";
		heading[4] = "FG%";
		heading[5] = "3PM";
		heading[6] = "3PA";
		heading[7] = "3P%";
		heading[8] = "FTM";
		heading[9] = "FTA";
		heading[10] = "FT%";
		heading[11] = "DREB";
		heading[12] = "OREB";
		heading[13] = "REB";
		heading[14] = "AST";
		heading[15] = "TOV";
		heading[16] = "STL";
		heading[17] = "BLK";
		heading[18] = "PF";
		heading[19] = "PTS";
		heading[20] = "+/-";

		// Add the header row
		var hRow = homeTable.insertRow(-1);
		for (var i = 0; i < heading.length; i++) {
			var hHeaderCell = document.createElement("TH");
			hHeaderCell.innerHTML = heading[i];
			hRow.appendChild(hHeaderCell)
		}

		// Add the data rows.
		for (var i = 0; i < homeTeam.length; i++) {
			row = homeTable.insertRow(-1);
			for (var j = 0; j < heading.length; j++) {
				var hCell = row.insertCell(-1);
				hCell.innerHTML = homeTeam[i][j];
			}
		}
		boxscoreDiv.appendChild(homeTable);
		boxscoreDiv.appendChild(document.createTextNode( '\u00A0' ));

		var awayTable = document.createElement('TABLE');
		awayTable.className = "table table-condensed";
		awayTable.id = "awayBoxscore";

		// Add the header row
		var row = awayTable.insertRow(-1);
		for (var i = 0; i < heading.length; i++) {
			var headerCell = document.createElement("TH");
			headerCell.innerHTML = heading[i];
			row.appendChild(headerCell)
		}

		// Add the data rows.
		for (var i = 0; i < awayTeam.length; i++) {
			row = awayTable.insertRow(-1);
			for (var j = 0; j < heading.length; j++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = awayTeam[i][j];
			}
		}
		boxscoreDiv.appendChild(awayTable);
	};

	function createAdvancedGraph1(home, away, teams) {
		var barCtx = $advTeamStats1;
		var barData = {
		labels: ["TS%", "eFG%", "OREB%", "DREB%", "REB%", "AST%"],
		datasets: [
			   {
				   label: teams[0],
				   backgroundColor: '#b8a939',
				   borderColor: '#b34c31',
				   borderWidth: 0.5,
				   data: home
			   },
			   {
				   label: teams[1],
				   backgroundColor: '#243d6c',
				   borderColor: '#18b389',
				   borderWidth: 0.5,
				   data: away
			   }
		   ]
		};
		if (advGraph1 != null) {
			advGraph1.destroy();
		}
		advGraph1 = new Chart(barCtx, {
			type: 'horizontalBar',
			data: barData
		});
	}

	function createAdvancedGraph2(home, away, teams) {
		var barCtx = $advTeamStats2;
		var barData = {
		labels: ["AST_RATIO", "AST-TOV", "TO%"],
		datasets: [
			   {
				   label: teams[0],
				   backgroundColor: '#b8a939',
				   borderColor: '#b34c31',
				   borderWidth: 0.5,
				   data: home
			   },
			   {
				   label: teams[1],
				   backgroundColor: '#243d6c',
				   borderColor: '#18b389',
				   borderWidth: 0.5,
				   data: away
			   }
		   ]
		};
		if (advGraph2 != null) {
			advGraph2.destroy();
		}
		advGraph2 = new Chart(barCtx, {
			type: 'horizontalBar',
			data: barData
		});
	}

	function createAdvancedGraph3(home, away, teams) {
		var barCtx = $advTeamStats3;
		var barData = {
		labels: ["OFF-RATING", "DEF-RATING", "NET-RATING"],
		datasets: [
			   {
				   label: teams[0],
				   backgroundColor: '#b8a939',
				   borderColor: '#b34c31',
				   borderWidth: 0.5,
				   data: home
			   },
			   {
				   label: teams[1],
				   backgroundColor: '#243d6c',
				   borderColor: '#18b389',
				   borderWidth: 0.5,
				   data: away
			   }
		   ]
		};
		if (advGraph3 != null) {
			advGraph3.destroy();
		}
		advGraph3 = new Chart(barCtx, {
			type: 'horizontalBar',
			data: barData
		});
	}

	// Code below is from Django documentation
	// It enables AJAX to pass the csrf_token

	// This function gets cookie with a given name
	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
	var csrftoken = getCookie('csrftoken');

	/*
	The functions below will create a header with csrftoken
	*/
	function csrfSafeMethod(method) {
		// these HTTP methods do not require CSRF protection
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	function sameOrigin(url) {
		// test that a given url is a same-origin URL
		// url could be relative or scheme relative or absolute
		var host = document.location.host; // host + port
		var protocol = document.location.protocol;
		var sr_origin = '//' + host;
		var origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
			// or any other URL that isn't scheme relative or absolute i.e relative.
			!(/^(\/\/|http:|https:).*/.test(url));
	}

	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
				// Send the token to same-origin, relative URLs only.
				// Send the token only if the method warrants CSRF protection
				// Using the CSRFToken value acquired earlier
				xhr.setRequestHeader("X-CSRFToken", csrftoken);
			}
		}
	});

	initializePage();

});