$( function(){

	$( "#datepicker" ).datepicker( {
	    onSelect: function(date) { console.log(date) }
	});
	
});