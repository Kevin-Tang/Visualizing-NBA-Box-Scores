$( function(){

	$( "#datepicker" ).datepicker({
	    onSelect: function(date) {
	    	month = date.slice(0,2);
	    	day = date.slice(3,5);
	    	year = date.slice(6);
	    	console.log("month is " + month + "\nday is " + day + "\nyear is " + year);
	    	populateGameButtons(month, day, year);
	    }
	});

	function populateGameButtons(month, day, year){
		console.log("you called populateGameButtons()");
		console.log(" the year is " + year);
		// $.ajax({
		// 	url : "populate_games/", // the endpoint
		// 	data : {
		// 		month : month,
		// 		day : day,
		// 		year : year,
		// 	},

		// 	success : function(json) {
				
		// 	}
		// })
	}
	
});




function populateStatistics(){
        var stats = document.getElementById("game").innerHTML;
        var gameDiv = document.createElement("div");

        var text = gameDiv.innerHTML = "Visualization of "+stats+" goes here";
        document.getElementById("stats").innerHTML = text;
}

