
    //TODO: Clean this up. Move to tools at least.
    $(document).ready(function() {
	$(".tools-checkbox").click(function() {
	    var checked = this.checked;
	    var type = $(this).val();
	    console.log("Tools checkbox clicked:",type);
	    switch(type) {
		// FAULT LAYER
	    case 'fault-layer':
	 	break;
	    case 'kml-layer':
		if(checked) {
		    $('#KmlMapperDiv').show();
		}
		else {
		    $('#KmlMapperDiv').hide();
		}
		break;
	    }
	});
    });
    function updateGamma(slidervalue) {
	    var mapStyles = [{
	        "stylers": [{
	            "gamma": slidervalue
	        }]
	    }];

	    mapA.setOptions({
	        styles: mapStyles
	    });
	}