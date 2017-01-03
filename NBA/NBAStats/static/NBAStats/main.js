$(document).ready(function(){

	// Caching DOM selectors
	var $calendar = $("#datepicker");
	var $gameButtonsList = $("#game_buttons");
	var $teamNames = $('#teamNames');
	var $bGraphName = $('#bGraphName');
	var $team1 = $('#team1');
	var $team1PieChart = $('#team1PieChart');
	var $team2 = $('#team2');
	var $team2PieChart = $('#team2PieChart');
	var $BarGraphContainer = $("#BarGraphContainer");
	var $advContainer = $("#advContainer");

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
		console.log("You clicked on game: " + gameID); // sanity check
		showStats(gameID);
	});

	// wrapper function for loading and visualizing the game stats
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
				console.log(players[0]);
				console.log(players[1]);
				console.log(players[2]);
				console.log(players[3]);

				createPieGraph1(players[0], players[1]);
				createPieGraph2(players[2], players[3]);

				// Create Line Chart
                plays = json.playbyplay;
                $('#playbyplay').text("Score Timeline");
                createLineChart(plays[2], plays[0], plays[1], teams);

                $('#advTeamName').text("Team Advanced Stats");
                createAdvancedGraph(json.teamAdvanced[0], json.teamAdvanced[1], teams);

                $('#aboutProject').show();
                $('#boxscoreTitle').show();
				addBoxscore(json.boxscore[0], json.boxscore[1]);

			},

			error : function(xhr,errmsg,err) {
				alert(errmsg);
				console.log(xhr.status + ": " + xhr.responseText);
			}
		});

	}

	// creates the bar chart for quarter scores
	function createBarGraph(homeTeamScores, awayTeamScores, teams) {
		deleteBarGraph();
		console.log("you called createBarGraph()"); // sanity check
		var barCtx = $("#BarGraph");
		var barData = {
		labels: ["Start", "Q1", "Q2", "Q3", "Q4", "Total"],
		datasets: [

			   {
				   label: teams[0],
				   backgroundColor: [
				       '#49b880',
                       '#49b880',
                       '#49b880',
                       '#49b880',
                       '#49b880',
                       '#49b880'
                   ],
				   borderColor: [
				       '#5BCE20',
                       '#5BCE20',
                       '#5BCE20',
                       '#5BCE20',
                       '#5BCE20',
                       '#5BCE20'
                   ],
				   borderWidth: 1,
				   data: homeTeamScores
			   },
			   {
				   label: teams[1],
				   backgroundColor: [
                       '#E84A5f',
                       '#E84A5f',
                       '#E84A5f',
                       '#E84A5f',
                       '#E84A5f',
                       '#E84A5f'
				   ],
				   borderColor: [
				       '#243D6C',
                       '#243D6C',
                       '#243D6C',
                       '#243D6C',
                       '#243D6C',
                       '#243D6C'
                   ],
				   data: awayTeamScores
			   }
		   ]
		};
		var BarGraph = new Chart(barCtx, {
			type: 'bar',
			data: barData
		});
		console.log("Bar graph successfully created");
	}

	function deleteBarGraph() {
		$("#BarGraph").remove();
		$BarGraphContainer.append("<canvas id='BarGraph'></canvas>");
	}

	function createPieGraph1(players1, scores1) {
		console.log("you called createPieGraph1()");
		deletePieGraph1();
		var i; // for loop index
		var colors1 = []; // empty loop for colors
		for (i = 0; i < scores1.length; i++) { // generate random colors for pie chart
			colors1.push(getRandomColor());
		}

		var pieCtx1 = $('#myPieChart1');
		var data1 = {
		labels: players1,
		datasets: [
		   {
			   data: scores1,
			   backgroundColor: colors1
		   }]
		};
		// For a Pie chart
		var myPieChart = new Chart(pieCtx1,{
		 type: 'doughnut',
		 data: data1
		});
	}

	function deletePieGraph1() {
		$("#myPieChart1").remove();
		$("#myPieChart1Container").append("<canvas id='myPieChart1'></canvas>");
	}

	function createPieGraph2(players2, scores2) {
		console.log("you called createPieGraph2()");
		deletePieGraph2();
		var i; // for loop index
		var colors2 = []; // empty loop for colors
		for (i = 0; i < scores2.length; i++) { // generate random colors for pie chart
			colors2.push(getRandomColor());
		}

		var pieCtx2 = $('#myPieChart2');
		var data2 = {
		labels: players2,
		datasets: [
		   {
			   data: scores2,
			   backgroundColor: colors2
		   }]
		};

		// For a Pie chart
		var myPieChart = new Chart(pieCtx2,{
		 type: 'doughnut',
		 data: data2
		});
	}

	function deletePieGraph2() {
		$("#myPieChart2").remove();
		$("#myPieChart2Container").append("<canvas id='myPieChart2'></canvas>");
	}

		// creates the line chart for plays of the game
    function createLineChart(period_Data, homeTeam, awayTeam, teams) {
	    deleteLineChart();
	    console.log("You called createLineChart()"); // sanity check
        var lineCtx = document.getElementById('myLineChart');
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
         var myLineChart = new Chart(lineCtx, {
             type: 'line',
             data: lineData
         });
         console.log("Line chart successfully created");
    }

    function deleteLineChart() {
		$("#myLineChart").remove();
		$("#LineChartContainer").append("<canvas id='myLineChart'></canvas>");
	}

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

	function createAdvancedGraph(home, away, teams) {
	    deleteAdv();
		var barCtx = $("#advTeamStats");
		var barData = {
		labels: ["TS%", "eFG%", "OREB%", "DREB%", "REB%", "AST%", "AST_RATIO", "AST-TOV", "TO%", "OFF-RATING", "DEF-RATING", "NET-RATING"],
		datasets: [

			   {
				   label: teams[0],
				   backgroundColor: [
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                       '#b8a939',
                   ],
				   borderColor: [
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31',
                       '#b34c31'

                   ],
				   borderWidth: 1,
				   data: home
			   },
			   {
				   label: teams[1],
				   backgroundColor: [
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c',
                       '#243d6c'
				   ],
				   borderColor: [
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                       '#18b389',
                   ],
				   data: away
			   }
		   ]
		};
		var advTeam = new Chart(barCtx, {
			type: 'horizontalBar',
			data: barData
		});
		console.log("Advanced Stats graph successfully created");
    }

	function deleteBarGraph() {
		$("#BarGraph").remove();
		$BarGraphContainer.append("<canvas id='BarGraph'></canvas>");
	}

    function deleteAdv() {
	    $("#advTeamStats").remove();
	    $advContainer.append("<canvas id='advTeamStats'></canvas>>");
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