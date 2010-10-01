var global_activeElementId = "label_r1"; // first active element's id
/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	return "ui-state-active";
}
/**
@description implemented by the Widget Developer to return the id of the element that currently has focus.  
@return {string} the id of the element in focus
*/

function getActiveElementId(){
	return global_activeElementId;
}

/**
@description implemented by the Widget Developer to set the id of the element that currently has focus.  
@param {string} _activeElementId the id of the element in focus
*/

function setActiveElementId(_activeElementId){
	global_activeElementId = _activeElementId;
}
/*
 * This function is injected by the platform. This function is called by the platform with the function reference as parameter
 * The Platform calls this function when it finds that there is a user registered function for an element and a key press. 
 * The corresponding function reference is sent as a parameter. 
 * This is an extra function written since I was unable to call the function reference from the iframe.
 * 
 */

function keyHandler(function_keyPress){
	return function_keyPress();
}


var zipCodeEntry = "";
var currQID = 0;
var newQID = 0;
var partyID = 0;
var currView = 0;

var questions = ['Health reform should include a public option insurance plan.', 'It should be mandatory for all Americans to possess health insurance.', 'Investment in preventative care will ultimately lower the cost of health care in the United States.'];



function checkQuestion(){
	//var qreq = "http://www.synlab.gatech.edu/projects/kinoPuzzle/KinoQChecker.php?jsoncallback=?";
	var qreq = "/quercus-4.0.3/WidgetProxy.php?query=" + encodeURIComponent("http://www.synlab.gatech.edu/projects/kinoPuzzle/KinoQChecker.php");

         
	$.getJSON(qreq,
		function(data){
			console.log("data: " + data.qid);
			newQID = data.qid;
			if(newQID!=currQID){
				document.getElementById('currquestion').innerHTML = questions[newQID];
				currQID=newQID;
				$('#sliderfocus').show();
				$('#currsubmit').show();
				$("#slider_regular").slider("value", 0);
			}
			//alert(data.qid);
			//$('h1#name').html(data.name).css("color","green");
		});
    
	
	//console.log('checking question');
	setTimeout("checkQuestion()", 5000);
}

function getKeyInfo(){
    var y = document.getElementById('key_container');
    if(y.style.display=="none"){
      y.style.display='block';
    }
    else{
        y.style.display="none";
    }
}



/**
    @description init is immediately called after document ready which provides default start values.
*/
function init(){
		
	var callbackFunction = submitClicked;
    var htmlStr = "<p>Submit</p>";
    var buttonArray = new Array(
			{id: 'submitbuttonparty', value: 'Submit', html:htmlStr, appendTo:'buttondiv', callback:callbackFunction, type:'button',
				cssClassString:""});
    createButton(buttonArray); 
		
	
	// To Widget Developers, you can try to pass the 'regular' or 'small' view! For more questions, please email ruby or nadu
	switchView('regular'); // Required function that must be implement by Widget Developer
    
	$('#instructions').hide();
	$('#sliders').hide();
	
	$("#"+getActiveElementId()).addClass(getActiveClass());
	
	callbackFunction = slideLeft;
	registerKeyPressCallback('sliderfocus', "KEY_LEFT", callbackFunction);
	callbackFunction = slideRight;
	registerKeyPressCallback('sliderfocus', "KEY_RIGHT", callbackFunction);
	callbackFunction = submitClicked;
	registerKeyPressCallback('submitbutton', "KEY_OK", callbackFunction);
	callbackFunction = downPressed;
	registerKeyPressCallback('label_r1', "KEY_DOWN", callbackFunction);
	registerKeyPressCallback('label_r2', "KEY_DOWN", callbackFunction);
	registerKeyPressCallback('label_r3', "KEY_DOWN", callbackFunction);
	callbackFunction = upPressed;
	registerKeyPressCallback('submitbuttonparty', "KEY_UP", callbackFunction);
	
	
	$('#radio').addClass("ui-state-active");
	//setWidgetElementInFocus('sliderfocus');
	document.getElementById('currquestion').innerHTML = questions[0];
	
	//checkQuestion();
}

function downPressed(){
	setActiveElementId('submitbuttonparty');
	$('#submitbuttonparty').addClass(getActiveClass());
	return true;
}
function upPressed(){
	$('#submitbuttonparty').removeClass(getActiveClass());
	$('#label_r3').removeClass(getActiveClass());
	$('#label_r2').removeClass(getActiveClass());
	setActiveElementId('label_r1');
	$('#label_r1').addClass(getActiveClass());
	
	return true;
}


// Load Initial Javascripts
//window.onload = init;


/**
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){
	//console.log("switchView: " + newView);
	document.getElementById('view').className = newView;
	if(currView==0){
		if(newView == 'icon'){
			$('#partychoice').hide();
			$('#iconimage').show();
		}
		else{
			$('#iconimage').hide();
			$('#partychoice').show();
		}
	}
	else{
		if(newView == 'regular'){
			$('#iconimage').hide();
			$('#instructions').show();
			$('#sliders').show();
	/*		document.getElementById('iconimage').style.display = "none";
			document.getElementById('instructions').style.display = "inline";
			document.getElementById('sliders').style.display = "block";
			document.getElementById('tickersliders').style.display = "none";*/
		}
		else if(newView == 'small'){
			$('#iconimage').hide();
			$('#instructions').hide();
			$('#sliders').show();
		}
		else if(newView == 'ticker'){
			$('#iconimage').hide();
			$('#instructions').hide();
			$('#sliders').show();
		}
		else if(newView == 'icon'){
			$('#iconimage').show();
			$('#instructions').hide();
			$('#sliders').hide();
		}
	}
	
}

function slideRight(){
	var currSliderValue = $("#slider_regular").slider("value");
	//console.log('right key press');
	$("#slider_regular").slider("value", currSliderValue+1);
	return true;
}

function slideLeft(){
	var currSliderValue = $("#slider_regular").slider("value");
	//console.log('right key press');
	$("#slider_regular").slider("value", currSliderValue-1);
	return true;
}

/**
    @description wigetKeyOK is a callback function that maps to the OK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
function submitClicked(){ 
	//console.log('pressed ok');
	var newView = document.getElementById('view').className;
		
	if(currView==0){
		if(getActiveElementId() == "submitbuttonparty"){
			var length = $('input[name="radio"]').length;
			for(var i = 0; i < $('input[name="radio"]').length; i++ ){
				if( $('input[name="radio"]')[i].checked == true ){
					partyID=i;
				}
			}
			
			$('#partychoice').hide();
			if(newView == 'regular'){
				$('#instructions').show();
				$('#sliders').show();
			}
			else if(newView == 'icon'){
				$('#iconimage').show();
			}
			else{
				$('#sliders').show();
			}
			
			setActiveElementId('sliderfocus');
			$("#"+getActiveElementId()).addClass(getActiveClass());
			
			checkQuestion();
			currView=1;
		}
		else{
			alert("in else- wrong");
			setActiveElementId('submitbuttonparty');
		}
	}
	else{
	  
		if(newView == 'icon'){
		}
		else{
			if(getActiveElementId() == "submitbutton"){
				//document.forms["theform"].submit();
				var currSliderValue = $("#slider_regular").slider("value");
                                //console.log("about to submit, slider value is"+currSliderValue);
                                //console.log("about to submit, viewpoint value is"+partyID);
                                //console.log("about to submit, current question value is"+currQID);
				//var req = "/quercus-4.0.3/WidgetProxy.php?query=" + encodeURIComponent("http://www.synlab.gatech.edu/projects/kinoPuzzle/KinoTVSubmission.php");
				var req = "http://www.synlab.gatech.edu/projects/kinoPuzzle/KinoTVSubmission.php?" + "opinions_topic_id="+currQID+"&opinions_value="+currSliderValue+"&viewpoint_id="+partyID;
                req = window.ProxyPortal + encodeURIComponent(req);
				//var req = "http://www.synlab.gatech.edu/projects/kinoPuzzle/KinoTVSubmission.php";
				$.ajax({
                                    type: "GET",
                                    url: req,
                                    //data: "opinions_topic_id="+currQID+"&opinions_value="+currSliderValue+"&viewpoint_id="+partyID,
                                    success: function(msg){console.log("Data Saved:"+msg);},
                                    dataType: "text"
                                })
/*
                                $.post(req,
                                    { "opinions_topic_id": currQID, "opinions_value": currSliderValue, "viewpoint_id": partyID },
                                    function(data, textStatus){
                                        console.log("data is " + data);
                                        console.log("textStatus is " + textStatus);
                                    });
				*/
				document.getElementById('currquestion').innerHTML = "Thanks for submitting!";
				$('#sliderfocus').hide();
				$('#currsubmit').hide();
			}
			else{
				setActiveElementId('submitbutton');
			}
		}
	  
	}
   
	return true;

}


