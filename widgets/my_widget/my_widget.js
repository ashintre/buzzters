/*
 * global variables used here
 */



/*
 * panels array - this is the format of the array to be passed to the createTabs function of the Elements Library
 * Each tab has a panel associated with it. This panel is enclosed by a <div> with id specified in the array
 * The name/label of the tab is also specified here 
 */
var panels = new Array(
{id: 'csf', name: 'TV Data'},
{id: 'thirdParty', name: '3rd Party API'},
{id: 'uielements', name: 'UI'}
);


/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	if(getActiveElementId() == 'textBox'){
		return "textBox_active";
	}
	return "ui-state-hover";
}
/**
@description implemented by the Widget Developer to return the id of the element that currently has focus.  
@return {string} the id of the element in focus
*/

var global_activeElementId = "first_activeElement"; // first active element's id
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

/*
 * the widget developer informs the platform
 * id -keypress- callback function
 * the platform maintains a table widget - id - key - callback_function
 * if this exists in the table and is implemented by the widget then its called
 * else the default functionality is called 
 */ 


$(document).ready(function(){  
	/* add code that will be called before init() is called
	 */
});


function init(){
	
	/* this is the first function to be called after the widget loads
	 */
	console.log("this is my first TV widget ! Hurray!");
	createTabs(panels);
	addUIElements();
	
}

setInterval("csfRequester()", 3000);

function csfRequester(){
	/* get the Platform Object 
	 */
    platform = getPlatform();
        
    /* get the current playing information
     */
	nowPlaying(platform.getCurrentStationId(), nowPlayingAggregator);
	twitterPrint();
  	subscribeChannelChangeEvent();
}

function nowPlayingAggregator(nowPlayingInfo){
	var nowPlayingStr =  "<b>"+ nowPlayingInfo.title + "</b>" +"<br/><br/>" + nowPlayingInfo.description;
	$('#csf').html(nowPlayingStr);
	console.log(nowPlayingInfo.title);
	console.log(nowPlayingInfo.description);
	twitterSearch(nowPlayingInfo.description, 10);
	
}

/*
 * Example of a 3rd party API Call using the proxy
 */
var twitterResponse ="notSet";

function twitterSearch(searchStr, searchQuantity) {
  var htmlstr = 'http://search.twitter.com/search.json?lang=en&result_type=recent';
  htmlstr += '&rpp=' + searchQuantity;
  htmlstr += '&q=' + searchStr;
  
  htmlstr = getProxyURL(htmlstr);
  $.getJSON(htmlstr, function(data) {
    if ((data !== null) &&
        (data !== undefined) &&
        (data.results !== undefined) &&
        (data.results !== null) &&
        (data.results.length > 0)) {
      twitterResponse = data;
    }
  });
}


function twitterPrint() {
  var htmlstr = '<div class="title"><h3>Twitter:</h3></div><div class="results">';
  if (twitterResponse == "notSet") {
    htmlstr += 'Loading Tweets...';
  } else {
    var results=twitterResponse.results;
    for (var i=0; (i < results.length && i < 3); i++) {
      var result = results[i];
      htmlstr += '<div class="text">' + result.from_user + ': ' + result.text + '</div><br/>';
    }
  }
  htmlstr += '</div>';
 
  $("#thirdParty").html(htmlstr);
}
/*
function channelChangeEventHandler(channelIndex){

	nowPlaying(platform.channels[index].stationId, nowPlayingAggregator);

}
*/


function addUIElements(){
	/*
	 * this function shows all the UI Elements offered by the library
	 */
	
	
	// a radiobutton/checkbox list
	var array = new Array();
	for(var i=0; i<2; i++){
		array[i] = new Object();
		array[i].listItemClass = "";
		array[i].callback = inputSelected;
		array[i].listItemId="inputlistitem_"+i;
		if(i==0){
			array[i].type="radio";
			array[i].html = "<span> Would you like to create a cool widget? </span>";
		}
		else{
			array[i].type = "checkbox";
			array[i].html = "<span> Do you like this Platform? </span><br/>";
		}			
		array[i].id = "unique_id_"+i;
		array[i].checked="checked";
		array[i].appendElementId = "uielements";
	}
	createInputListItems(array,"uielements");
	$("#uielements").append("<br/>");
 // sliding checkboxes
	
	var preferencesChangedRef = preferencesChanged;
	//var checkboxdata = new Array();
	var tmp = new Array();
	for(i=0;i<2;i++){
	      //widgetString = widgetString + "<div id='"+"widget_"+i+"_"+widget[i].name+"'><input type='checkbox' id='check_"+i+"_"+widget[i].name+"' value='Submit' >&nbsp;&nbsp;&nbsp;" +widget[i].title+"</div>";
		tmp[i] = new Object();
		tmp[i].id = "check_"+i;
	  	tmp[i].appendTo = "uielements";
	  	tmp[i].callback = preferencesChangedRef;
	  	if(i%2==0){
	  		tmp[i].selected = "on";
	  		tmp[i].html = "<span id='slidingcheckbox_"+i+"'> Autoupdates? </span>";
	  	}
	  	else{
	  		tmp[i].html = "<span id='slidingcheckbox_"+i+"'> Notifications?</span>";
	  		tmp[i].selected = "off";
	  	}
	  	//tmp[i] = new Array({id:tmp_id, selected:tmp_selected, html:tmp_html, appendTo:tmp_appendTo, callback:tmp_callback});
	  	//checkboxdata[i] =  tmp[0];
	  	
	  }
	createSlidingCheckboxes(tmp);
	$("#uielements").append("<br/>");
	
// this will create a text box
    
    var appendElementId = "uielements";
    var max = 20;
	var size = 25;
	var cssClassString = "";
	var value = "Enter your name";
	var name ="Name";
	var id = "textBox";
	var textBox = new Array(
	            {id: id, value: value, appendElementId:appendElementId, cssClassString:cssClassString, max:max, size:size});
	createTextBoxElement(textBox);
	$("#uielements").append("<br/>");
	
	
	
	// this will create a button
	var callbackFunction = updateWidgetValues;
    var htmlStr = "<p>Submit</p>";
    var buttonArray = new Array(
                {id: 'button', value: 'Submit', html:htmlStr, appendTo:"uielements", callback:callbackFunction, type:'button',
                        cssClassString:""});
    createButton(buttonArray);
    
}

function updateWidgetValues(){
	setVal("property", "new_value");
}

function inputSelected(){
	alert("the selection was made");
}

function preferencesChanged(){
	console.log("preferences have changed");
}
