
// blendo

var blendoServiceListAll = new Array("flickr"); // search and display these services
var blendoServiceListPhotoOnly = new Array("flickr"); // search and display these services
var blendoServiceList = blendoServiceListAll;
var blendoSearchQuantity = 5; // number of elements to return from each search
var blendoDisplayQuantity = 4; // number of elements to return from each search
var blendoProgramInfo = new Array(); // current words we can use for our search
var blendoSearchStr = ""; // the current search string, includes commas for compatibility with some APIs
var blendoSearchStrQuantity = 4; // number of terms to include in each search
var blendoChangeTimer = 600; // how often (ms) to rotate between the different services
var blendoChangeContentTimeoutHandle = 10000;
var blendoBlendTimer = 10000; // how often (ms) to reshuffle the search terms and search each service
var blendoBlendTimeoutHandle = 10000;
var blendoRefreshProgramInfoTimeoutHandle = 100;
//var proxyUrl = "/quercus-4.0.3/WidgetProxy.php?query=";


var global_activeElementId = "img0";
/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	
	//return "photoSelected";
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
	//$('#'+global_activeElementId).css('background-color, none');
	global_activeElementId = _activeElementId;
	//$('#'+global_activeElementId).css('background-color, black');
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


function blendoSetSearchStr(searchStr) {
  blendoSearchStr = searchStr;
}

function blendoSetBlendTimer(timerValue) {
  blendoBlendTimer = timerValue;
}

function blendoSetChangeTimer(timerValue) {
  blendoChangeTimer = timerValue;
}

function blendoSetSearchQuantity(searchQuantity) {
  blendoSearchQuantity = searchQuantity;
}

function blendoSetDisplayQuantity(displayQuantity) {
  blendoDisplayQuantity = displayQuantity;
}

// Load Initial Javascripts
//window.onload = blendoInit;
function init(){
	blendoInit();
	var callbackFunction = addPanel;
	for (i=0; i < 4; i++){
		//imgindex = "img"+i;
		registerKeyPressCallback('img'+i, "KEY_OK", callbackFunction);
	}
}

function blendoInit() {
  plat = getPlatform();
  subscribeChannelChangeEvent();
  console.log("Now is when I go regular");
  switchView('regular'); // TODO - shouldn't the platform call switchView?
  $("#"+getActiveElementId()).addClass(getActiveClass());
  
  document.getElementById("content_container").innerHTML = '<H2>Simple Blendo</H2>';
  blendoChangeContent(0);
  blendoChangeContentTimeoutHandle = setTimeout("blendoChangeContent(0)", blendoChangeTimer);
  blendoRefreshProgramInfo();
  
}

function channelChangeEventHandler(currentChannelIndex){
  // alert(currentChannelIndex);
  blendoRefreshProgramInfo();
}

function blendoRefreshProgramInfo() {
  clearTimeout(blendoRefreshProgramInfoTimeoutHandle); // in case I wasn't called via timout, ensures only 1 active timer

  platform = getPlatform();
  stationId = platform.getCurrentStationId();
  nowPlaying(stationId, blendoNowPlayingAggregator);

  // This function should be called as a method on nowPlayingInfo
  // refreshTime = nowPlayingInfo.getTimeRemaining();
  // TODO remove this once the new function is implemented
  refreshTime = 360000;
  blendoRefreshProgramInfoTimeoutHandle = setTimeout("blendoRefreshProgramInfo()", refreshTime);
}

function blendoNowPlayingAggregator(nowPlayingData) {
  var programInfoStr = "";
//Mano edit
  /*
  programInfoStr = nowPlayingData.getTitle();
  programInfoStr += nowPlayingData.getSummary();
  programInfoStr += nowPlayingData.getSubtitle;
  */
  programInfoStr = nowPlayingData.title;
  programInfoStr += nowPlayingData.description;
  console.log("This is the blendoblend string"+programInfoStr);
  blendoBlend(programInfoStr);
}

function getTimeRemaining(endTime) {
  // TODO - this should be a method on nowPlayingInfo
  // TODO - what units is endTime in?
  // TODO - calculate the remaining time in ms & return
}

widgetKeyBACK = function(){
    return false;
}

switchView = function(newView) {
  // Set view to newView
  document.getElementById('view').className = newView;    

  switch(newView) {
    case "icon":
      blendoServiceList = blendoServiceListPhotoOnly;
      blendoSetDisplayQuantity(1);
      blendoChangeContent(0);
      break;
    case "regular":
      blendoServiceList = blendoServiceListAll;
      blendoSetDisplayQuantity(4);
      break;
    case "small":
      blendoServiceList = blendoServiceListAll;
      blendoSetDisplayQuantity(1);
      break;
    case "ticker":
      blendoServiceList = blendoServiceListAll;
      blendoSetDisplayQuantity(2);
      break;
    case "full":
      blendoServiceList = blendoServiceListAll;
      blendoSetDisplayQuantity(10);
      break;
  }
}

function blendoBlend(programInfoStr) {
  clearTimeout(blendoBlendTimeoutHandle); // in case I wasn't called via timout, ensures only 1 active timer
  if (programInfoStr != null) {
    blendoProgramInfo=programInfoStr.split(" ");
  }
  j=Math.floor(Math.random() * (blendoProgramInfo.length-1));
  var newStr = blendoProgramInfo[j];
  for (var i=0; i < (blendoSearchStrQuantity - 1); i++) {
    j=Math.floor(Math.random() * (blendoProgramInfo.length-1));
    newStr += ',' + blendoProgramInfo[j];
  }
  blendoSetSearchStr(newStr);
  blendoSearch();
  blendoBlendTimeoutHandle = setTimeout("blendoBlend()", blendoBlendTimer);
}

function blendoSearch() {
  var arr2str = blendoServiceList.toString();  //Converting the String content to String

  for (var i=0; i < blendoServiceListAll.length; i++) {
    switch(i) {
      case 0:
        if (arr2str.search("flickr") != -1)
          flickrSearch(blendoSearchStr, blendoSearchQuantity);
        break;
      default: // something is broken
    }
  }
}

function blendoChangeContent(serviceIdx) {
  clearTimeout(blendoChangeContentTimeoutHandle); // in case I wasn't called via timout, ensures only 1 active timer

  var arr2str = blendoServiceList.toString();  //Converting the String content to String

  switch(serviceIdx) {
    
    case 0:
      if (arr2str.search("flickr") != -1)
        flickrPrint();
      break;
    case 1:
        if (arr2str.search("googleNews") != -1)
          googleNewsPrint();
        break;
    case 2:
      if (arr2str.search("twitter") != -1)
        twitterPrint();
      break;
    case 3:
      if (arr2str.search("picasa") != -1)
        picasaPrint();
      break;
    default: // something is broken
  }

  var nextIdx = (serviceIdx+1)%blendoServiceListAll.length;
  blendoChangeContentTimeoutHandle = setTimeout("blendoChangeContent(" + nextIdx + ")", blendoChangeTimer);
}


// FLICKR

var flickrResponse = "notSet";

function flickrSearch(searchStr, searchQuantity) {
  var htmlstr = 'http://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1&tag_mode=all&sort=date-taken-desc&api_key=57b9bb68bc0a319739d51a899ebb4fbc';
  htmlstr += '&per_page=' + searchQuantity;
  htmlstr += '&tags=' + searchStr;
  htmlstr = getProxyURL(htmlstr);
  $.getJSON(htmlstr, function(data) {
    if ((data !== null) &&
        (data !== undefined) &&
        (data.photos.photo !== undefined) &&
        (data.photos.photo !== null) &&
        (data.photos.photo.length > 0)) {
      flickrResponse = data;
    }
  });
}

var thumb_url = new Array();
var photo_url = new Array(); 

function flickrPrint() {
  /*
	var flag = 0;
  	if(document.getElementById('view').className === "icon"){
	flag = 1;
  	}
   */
	//alert(flickrResponse);
  var htmlstr = '<div class="title">Flickr:</div><div class="results">';
  if (flickrResponse == "notSet") {
    htmlstr += 'Loading Photos...';
  } else {
    var results=flickrResponse.photos.photo;
   
    var n;
    var pl = getPlatform();
	var layoutIndex = pl.OUX.layouts.getCurrentLayoutIndex();
	if(layoutIndex === 0){ n=1;}else {n=4;}
	
    for (var i=0; (i < results.length && i < n) ; i++) {
      var result = results[i];
      thumb_url[i] = "http://farm" + result.farm + ".static.flickr.com/" + result.server + "/" + result.id + "_" + result.secret + "_" + "t.jpg";
      photo_url[i] = "http://www.flickr.com/photos/" + result.owner + "/" + result.id;
      htmlstr +=  '<div id=img'+i+' class="photo navigationClass"><img alt="' + result.title + '"src="' + thumb_url[i] + '"/></div>';
      //$('#img0').addClass('ui-state-active');
      //alert(htmlstr);
    }
    /*
    if ($('#view').is('.icon')){
    	for (var j=1; j<4; j++){
    		$('#img'+i).hide();
    	}
    }
    */
    $('.icon').css('background-image', 'none');
    imgobj = new Image();
    /*
    for (var n=0; n<4; n++){
  	  var imgurl = thumb_url[n].replace("_t","");
  	  imgobj.src = imgurl;
    }
    */
  }
  htmlstr += '</div>';
  document.getElementById("content_container").innerHTML = htmlstr;
  
  //$('#'+global_activeElementId).css('background-color, black');
  $('#'+global_activeElementId).addClass(getActiveClass());
  
}

/* Image viewer */

var photoflag = 0;



function addPanel(){
	var imgIndex;

	if (photoflag === 0){
		photoflag = 1;
		var activeImg = getActiveElementId();
		imgIndex = activeImg.substring(3, 4);
		console.log("This is the imgIndex: "+imgIndex);
		top.popPanel(thumb_url[imgIndex]);
		//alert(photo_url);
	}
	else {
		photoflag = 0;
		top.removePanel();
	}
	//setActiveElementId("img0");
	$("#"+global_activeElementId).addClass(getActiveClass());
	return(true);
}
