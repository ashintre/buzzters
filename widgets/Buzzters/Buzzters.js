/*
 * global variables used here
 */
var API_GET_IMDB_ID = "http://www.deanclatworthy.com/imdb/?q=";

var TMDB_BASE_URL = "http://api.themoviedb.org/2.1/";
var APIKEY = "dd27fee2224698e58c5e5a3886b5dee0/";
var MOVIE_IMDB_LOOKUP = "Movie.imdbLookup/en/json/";
var MOVIE_TMDB_GETINFO = "Movie.getInfo/en/json/";
var GET_TOMATO_RATING = "http://www.rottentomatoes.com/m/";

var generalInfo = new Array();
var __delimiter = " : ";
var channelIndexStationIdMap = new Array();


String.prototype.commafy = function () {
	return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
		return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
	});
}

Number.prototype.commafy = function () {
	return String(this).commafy();
}

function parseableMovieName(origName){
	return origName.split(" ").join("+");
}

function isMovieDuration(endTime, startTime)
{
	var time1 = new Date(entTime);
	var time2 = new Date(startTime);
	var lengthOfShow = new Date();
	lengthofShow.setTime(time1 - time2)
	return ((lengthofShow.getHours() >= 1) && (lengthofShow.getMinutes() >= 0));	
}

/*
 * panels array - this is the format of the array to be passed to the createTabs function of the Elements Library
 * Each tab has a panel associated with it. This panel is enclosed by a <div> with id specified in the array
 * The name/label of the tab is also specified here 
 */
var panels = new Array(
{id: 'csf', name: 'General'},
{id: 'thirdParty', name: 'Cast'},
{id: 'uielements', name: 'Poster'},
{id: 'description', name: 'Synopsis'}
);

var movieChannelIndexes = [3, 4];
var tvSeriesChannelIndexes = [12397];

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
});


function init(){	
	platform = getPlatform();	
	subscribeChannelChangeEvent();
	getStationList(function(stations){
		for(var channelIndex in stations)
		{
			channelIndexStationIdMap.push(stations[channelIndex].stationId);
			console.log("Index " + channelIndex + " Channel " + stations[channelIndex].stationId);
		}
	});
	channelChangeEventHandler(platform.getCurrentChannelIndex());
	//top.switchToChannel("225.1.1.15:5015");
}

function populateMovieInfo()
{				
	// API_GET_IMDB_ID contains the baseURL for the API to get IMDB Id of movie from movie name
	$.getJSON(getProxyURL(API_GET_IMDB_ID + parseableMovieName('The Dark Knight')), function(data)
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
	setTomatoMeter("The Dark Knight".replace(/\s/g, "_"));
}

function channelChangeEventHandler(channelIndex){	
	console.log(">>> In channel changed event with channelIndex " + channelIndex);
	nowPlaying(platform.getCurrentStationId(), nowPlayingAggregator);	
}

function nowPlayingAggregator(nowPlayingInfo){	
	
	// Code to distinguish between Movie/TV Series/News/Sports goes here
	if((nowPlayingInfo.rating == null) || (nowPlayingInfo.rating == undefined))
	{
		// Must be a Sports/News Channel. At best we can present meta-data
	}
	else if(nowPlayingInfo.rating.indexOf('TV') != -1)
	{
		// Its a TV Series/Movie. Expand widget code to accomodate for this
		populateMovieInfo();
	}
	else
	{
		console.log(">>>> UNEXPECTED MOVIE RATING" + nowPlayingInfo.rating + " FOUND. Populating default aggregated data");
	}
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
				generalInfo['Budget'] = "$ " + tmdb_info_response[0].budget.commafy(); //console.log("Budget : $" + tmdb_info_response[0].budget);
				generalInfo['Revenue'] = "$ " + tmdb_info_response[0].revenue.commafy(); //console.log("Revenue : $" + tmdb_info_response[0].revenue);
				setGeneralHTML();
				populateCastInfo(tmdb_info_response);
				populateOverViewTab(tmdb_lookup_response);
			});
			populatePostersTab(tmdb_lookup_response);
		}
	});
}

function setGeneralHTML()
{	
	var generalInfoHTML = "<table class='gnrlInfo'><tbody>";
	for(var key in generalInfo)
	{
		generalInfoHTML += "<tr><td class='ui-state-default ui-corner-all infoHeader'>" + key + "</td><td colspan='2' class='infoDetail'>" + generalInfo[key] + "</td></tr>";
	}
	generalInfoHTML += "<tr><td class='ui-state-default ui-corner-all infoHeader'>Rotten Tomatoes</td>" +
					   "<td width='170px'><div id='rottenTomatoesBar' style='padding-left:0.2em; padding-right:0.3em'></div></td>" +
					   "<td><span class='tomatoMeter'></span></td></tr>";
	generalInfoHTML += "</tbody></table>";
	$("#csf").html(generalInfoHTML);
	$("#rottenTomatoesBar").progressbar({value:82});
	$(".tomatoMeter").html('82%');	
}

function setTomatoMeter(movieName)
{
	$.get(getProxyURL(GET_TOMATO_RATING + movieName), function(data){
		var tomatoRating = document.evaluate("//span[@id='all-critics-meter']/text()", data, null, XPathResult.ANY_TYPE, null );  
		console.log(">>>>>>>>>>>>TomatoRating : " + tomatoRating);
	});
}

function populateOverViewTab(tmdb_lookup_response)
{
	$('#description').html(tmdb_lookup_response[0].overview);
}

function animateTomatoBar(value)
{	
	$("#rottenTomatoesBar").progressbar("value", value);
	if(value < 80)
	{	
		setTimeout(animateTomatoBar(value+5), 10000000);
	}
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

function populatePostersTab(tmdb_lookup_response)
{
	var posterImgUrls = getMoviePosters(tmdb_lookup_response);
	console.log(">>>Poster Image URLs : " + posterImgUrls);
	//Create base to put images in	
	var posterTabContent = "<div id='posterSlideShow' class='pics'>";
	for(var i in posterImgUrls)
	{
		posterTabContent += "<img src='" + posterImgUrls[i] + "' width='270px' height='350px' />";
	}
	posterTabContent += "</div>";
	$('#uielements').html(posterTabContent);
	$('#posterSlideShow').cycle({ 
		fx : 'shuffle',
		delay : -2000,
		shuffle : {
			top : 25,
			left : 260
		}		
	});	
}

function getMoviePosters(tmdb_lookup_response)
{	
	var count = 0, max_count = 4;
	var posterImgUrls = new Array();	
	$.each(tmdb_lookup_response[0].posters, function(posterIndex, poster){
		if(count >= max_count){return false;}
		//if(1)
		if(poster.image.size == "mid")
		{
			posterImgUrls.push(poster.image.url);
			++count;
		}		
	});
	return posterImgUrls;
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
