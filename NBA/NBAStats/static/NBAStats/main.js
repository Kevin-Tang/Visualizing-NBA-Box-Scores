$( function(){

	$( "#datepicker" ).datepicker( {
	    onSelect: function(date) {
	    	month = date.slice(0,2);
	    	day = date.slice(3,5);
	    	year = date.slice(6);
	    	console.log("month is " + month + "\nday is " + day + "\nyear is " + year);
	    }
	});
	
});

// 12/06/2016
function populateStatistics(){
        var stats = document.getElementById("game").innerHTML;
        var gameDiv = document.createElement("div");

        var text = gameDiv.innerHTML = "Visualization of "+stats+" goes here";
        document.getElementById("stats").innerHTML = text;
}

