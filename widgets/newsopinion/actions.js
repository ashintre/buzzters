// JavaScript Document

function loadSliders(){
	// Sliders
	//.slider( "option" , options )
	$('#slider_regular').slider({
		range: false,
		value: 0,
		max: 5,
		min: -5,
		change: function(event, ui) {
				var currSliderValue = $("#slider_regular").slider("value");
				if(currSliderValue==-5){document.getElementById('currOpinion_reg').innerHTML ='Strongly Disagree';}
				else if(currSliderValue==-4){document.getElementById('currOpinion_reg').innerHTML ='Disagree';}
				else if(currSliderValue==-3){document.getElementById('currOpinion_reg').innerHTML ='Mostly Disagree';}
				else if(currSliderValue==-2){document.getElementById('currOpinion_reg').innerHTML ='Somewhat Disagree';}
				else if(currSliderValue==-1){document.getElementById('currOpinion_reg').innerHTML ='Slightly Disagree';}
				else if(currSliderValue==0){document.getElementById('currOpinion_reg').innerHTML ='Neutral';}
				else if(currSliderValue==1){document.getElementById('currOpinion_reg').innerHTML ='Slightly Agree';}
				else if(currSliderValue==2){document.getElementById('currOpinion_reg').innerHTML ='Somewhat Agree';}
				else if(currSliderValue==3){document.getElementById('currOpinion_reg').innerHTML ='Mostly Agree';}
				else if(currSliderValue==4){document.getElementById('currOpinion_reg').innerHTML ='Agree';}
				else if(currSliderValue==5){document.getElementById('currOpinion_reg').innerHTML ='Strongly Agree';}
				
				//document.theform.opinions_value.value = currSliderValue;
			}
	});
	
	$( "#slider_regular" ).bind( "slidechange", function(event, ui) {
	});
		
}