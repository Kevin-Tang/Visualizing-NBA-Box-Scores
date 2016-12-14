$( function(){

	$( "#datepicker" ).datepicker({
		onSelect: function(date) {
			month = date.slice(0,2); // parse out month
			day = date.slice(3,5);  // parse out 
			year = date.slice(6);  // parse out year
			// console.log("month is " + month + "\nday is " + day + "\nyear is " + year);
			populateGameButtons(date, month, day, year);
		}
	});

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
				$('#game_buttons').empty(); // delete games from previously selected date
				$.each(json.game_ids, function(i, val){ // add a button for each game
					// console.log(i + " " + val);  // print game IDs
					$('#game_buttons').append("<li><input type='button' value='"+val+"' class='game' id='"+val+"'></li>");
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
		console.log("you clicked on game: " + gameID); // sanity check
		showStats(gameID);
	});

	// wrapper function for loading and visualizing the game stats
	function showStats(gameID) {
		console.log("you called showStats() with game: " + gameID); // sanity check
		$.ajax({
			url : "get_game_data/", // the endpoint
			type : "POST", // http method
			data : {
				gameID : gameID
			},
			success : function(json) {
				console.log(json);
				gameID = json.gameID;
				homeTeamScores = json.quarterPoints[0];
				awayTeamScores = json.quarterPoints[1];
				createBarGraph(json.gameID, homeTeamScores, awayTeamScores);
			},

			error : function(xhr,errmsg,err) {
				alert(errmsg);
				console.log(xhr.status + ": " + xhr.responseText);
			}
		});

	}

	// creates the bar chart for quarter scores
	function createBarGraph(gameID, homeTeamScores, awayTeamScores) {
		deleteBarGraph();
		console.log("you called createBarGraph()"); // sanity check
		console.log("the gameID is " + gameID); // sanity check
		var barCtx = $("#BarGraph");
		var barData = {
		labels: ["Start", "Q1", "Q2", "Q3", "Q4", "Total"],
		datasets: [

		       {
		           label: "Team_1",
		           backgroundColor: [
		                   'rgba(255, 99, 132, 0.2)',
		                   'rgba(54, 162, 235, 0.2)',
		                   'rgba(255, 206, 86, 0.2)',
		                   'rgba(75, 192, 192, 0.2)',
		                   'rgba(153, 102, 255, 0.2)',
		                   'rgba(203, 15, 15, 0.2)'
		           ],
		           borderColor: [
		                   'rgba(255,99,132,1)',
		                   'rgba(54, 162, 235, 1)',
		                   'rgba(255, 206, 86, 1)',
		                   'rgba(75, 192, 192, 1)',
		                   'rgba(153, 102, 255, 1)',
		                   'rgba(200, 120, 24, 1)'
		           ],
		           borderWidth: 1,
		           data: homeTeamScores //[0, 20, 28, 35, 25, 108]
		       },
		       {
		           label: "Team_2",
		           backgroundColor: [
		                   'rgba(255, 99, 132, 0.2)',
		                   'rgba(54, 162, 235, 0.2)',
		                   'rgba(255, 206, 86, 0.2)',
		                   'rgba(75, 192, 192, 0.2)',
		                   'rgba(153, 102, 255, 0.2)',
		                   'rgba(203, 15, 15, 0.2)'
		           ],
		           borderColor: [
		                   'rgba(255,99,132,1)',
		                   'rgba(54, 162, 235, 1)',
		                   'rgba(15, 206, 246, 1)',
		                   'rgba(75, 192, 192, 1)',
		                   'rgba(153, 102, 255, 1)',
		                   'rgba(40, 120, 24, 1)'
		           ],
		           data: awayTeamScores //[0, 25, 30, 30, 25, 110]
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
		$("#BarGraphContainer").append("<canvas id='BarGraph'></canvas>");
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

});






function populateStatistics(){
		var stats = document.getElementById("game").innerHTML;
		var gameDiv = document.createElement("div");

		var text = gameDiv.innerHTML = "Visualization of "+stats+" goes here";
		document.getElementById("stats").innerHTML = text;
}

