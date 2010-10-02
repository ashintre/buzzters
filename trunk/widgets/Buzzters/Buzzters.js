/*
 * global variables used here
 */
var API_GET_IMDB_ID = "http://www.deanclatworthy.com/imdb/?q=";

var TMDB_BASE_URL = "http://api.themoviedb.org/2.1/";
var APIKEY = "dd27fee2224698e58c5e5a3886b5dee0/";
var MOVIE_IMDB_LOOKUP = "Movie.imdbLookup/en/json/";
var MOVIE_TMDB_GETINFO = "Movie.getInfo/en/json/";

var generalInfo = new Array();
var __delimiter = " : ";
/*
 * panels array - this is the format of the array to be passed to the createTabs function of the Elements Library
 * Each tab has a panel associated with it. This panel is enclosed by a <div> with id specified in the array
 * The name/label of the tab is also specified here 
 */
var panels = new Array(
{id: 'csf', name: 'Overview'},
{id: 'thirdParty', name: 'Cast'},
{id: 'uielements', name: 'Description'}
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
	createTabs(panels);
	platform = getPlatform();		
	/*
	$("#tabs").bind("tabsselect", function(event, ui) {
		console.log("Tab selection called");		
		
	});*/
	nowPlaying(platform.getCurrentStationId(), nowPlayingAggregator);	
});


function init(){			
}

function nowPlayingAggregator(nowPlayingInfo){	
	// API_GET_IMDB_ID contains the baseURL for the API to get IMDB Id of movie from movie name
	$.getJSON(getProxyURL(API_GET_IMDB_ID + parseableMovieName('Inception')), function(data)
	{					
		if ((data !== null) && (data !== undefined)) 
		{
			console.log("IMDB URL is " + data.imdburl);
			generalInfo['Genre'] = data.genres; //console.log("Movie genres are " + data.genres);
			generalInfo['Available Languages'] = data.languages; //console.log("Movie is available in " + data.languages);			
			if(data.imdburl != "")
			{
				// IMDB URL is in the form "http://www.imdb.com/title/tt1375666/" where tt1375666 is the IMDBId of the movie. Get this data from the URL
				var urlData = data.imdburl.substr(data.imdburl.indexOf('/title/') + '/title/'.length);
				var imdbId = urlData.substr(0, urlData.length - 1);
				getTMDBBaseDetails(imdbId);
			}
		}
	});
}

function getTMDBBaseDetails(imdbId)
{
	var tmdbLookupURL = TMDB_BASE_URL + MOVIE_IMDB_LOOKUP + APIKEY + imdbId;
	console.log(tmdbLookupURL);	
	$.getJSON(getProxyURL(tmdbLookupURL), function(tmdb_lookup_response)
	{
		if((tmdb_lookup_response != null) && (tmdb_lookup_response != undefined))
		{									
			generalInfo['IMDB Rating'] = tmdb_lookup_response[0].rating; //console.log("IMDB Rating is " + tmdb_lookup_response[0].rating);
			generalInfo['Certification'] = tmdb_lookup_response[0].certification; //console.log("Certification " + tmdb_lookup_response[0].certification);
			generalInfo['Released'] = tmdb_lookup_response[0].released; //console.log("Released " + tmdb_lookup_response[0].released);
			generalInfo['Runtime'] = Math.floor(tmdb_lookup_response[0].runtime/60) + 'hr' + tmdb_lookup_response[0].runtime%60 + 'min';
			//console.log("Runtime " + Math.floor(tmdb_lookup_response[0].runtime/60) + 'hr' + tmdb_lookup_response[0].runtime%60 + 'min');
			var tmdbId = tmdb_lookup_response[0].id;
			
			var tmdbInfoURL = TMDB_BASE_URL + MOVIE_TMDB_GETINFO + APIKEY + tmdbId;
			$.getJSON(getProxyURL(tmdbInfoURL), function(tmdb_info_response)
			{
				generalInfo['Tagline'] = tmdb_info_response[0].tagline; //console.log("Tagline : " + tmdb_info_response[0].tagline);
				generalInfo['Budget'] = "$" + tmdb_info_response[0].budget; //console.log("Budget : $" + tmdb_info_response[0].budget);
				generalInfo['Revenue'] = "$" + tmdb_info_response[0].revenue; //console.log("Revenue : $" + tmdb_info_response[0].revenue);
				setGeneralHTML();
				populateCastInfo(tmdb_info_response);
			});						
		}
	});
}

function setGeneralHTML()
{
	var generalInfoHTML = "<ul class='gnrlInfo'>";
	for(var key in generalInfo)
	{
		generalInfoHTML += "<li>" + key + __delimiter + generalInfo[key] + "</li>";
	}
	generalInfoHTML += "</ul>";
	$("#csf").html(generalInfoHTML);
}

function populateCastInfo(tmdb_info_response)
{	
	var jobs = new Array();
	var cast = new Array();
	for(var index in tmdb_info_response[0].cast)
	{		
		// Just filtering out two jobs for now to resolve space issues.
		// TODO: Try to put it back when space issues are resolved
		var currentJob = tmdb_info_response[0].cast[index].job;
		if($.inArray(currentJob, jobs) == -1 && currentJob != 'Editor' && currentJob != 'Director of Photography')
		{	
			jobs.push(tmdb_info_response[0].cast[index].job);
			cast[tmdb_info_response[0].cast[index].job] = new Array();
		}
	}
	console.log("Jobs : " + jobs);
	
	// Put these into the cast Array	
	for(var index in tmdb_info_response[0].cast)
	{
		// Just filtering out two jobs for now to resolve space issues.
		// TODO: Try to put it back when space issues are resolved
		var currentJob = tmdb_info_response[0].cast[index].job;
		if(currentJob != 'Editor' && currentJob != 'Director of Photography')
		{
			cast[tmdb_info_response[0].cast[index].job].push(tmdb_info_response[0].cast[index].name);
		}		
	}
	setCastHTML(cast);
}

function setCastHTML(cast)
{
	//First create the accordion		
	var castAccordionHTML = "<div id='castAccordion'>";
	for(var index in cast)
	{
		castAccordionHTML += "<h3><a href='#'>" + index + "</a></h3>";
		castAccordionHTML += "<div><span class='custAccrdCnt'><ul>";
		$.each(cast[index], function(i, castMember){
			castAccordionHTML += "<li>" + castMember +"</li>";
			if(i >= 4){return false;}			// This breaks the loop. Used to limit the size of displayed content
		});
		castAccordionHTML += "</ul></span></div>";
	}
	castAccordionHTML += "</div>";
	console.log(castAccordionHTML);
	$("#thirdParty").html(castAccordionHTML);
	$("#castAccordion").accordion({
		autoheight:"false",
		change:function(event, ui){
			//TODO: Use ui.newHeader to preferably set size of the span. Alternatively use ui.newContent
			$("#castAccordion .custAccrdCnt").parent().height(150);
		},
		event:"mouseover"
	});
	$("#castAccordion").accordion("activate", 1);		
}

function parseableMovieName(origName)
{
	return origName.split(" ").join("+");
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
