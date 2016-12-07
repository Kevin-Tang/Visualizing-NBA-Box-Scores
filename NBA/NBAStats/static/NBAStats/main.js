$( function(){

	$( "#datepicker" ).datepicker( {
	    onSelect: function(date) { console.log(date) }
	});
	
});

function populateStatistics(){
        var stats = document.getElementById("game").innerHTML;
        var gameDiv = document.createElement("div");

        var text = gameDiv.innerHTML = "Visualization of "+stats+" goes here";
        document.getElementById("stats").innerHTML = text;
}

