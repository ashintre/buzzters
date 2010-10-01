
// blendo

var blendoServiceListAll = new Array("googleNews", "picasa", "twitter", "flickr"); // search and display these services
var blendoServiceListPhotoOnly = new Array("flickr", "picasa"); // search and display these services
var blendoServiceList = blendoServiceListAll;
var blendoSearchQuantity = 10; // number of elements to return from each search
var blendoDisplayQuantity = 4; // number of elements to return from each search
var blendoProgramInfo = new Array(); // current words we can use for our search
var blendoSearchStr = ""; // the current search string, includes commas for compatibility with some APIs
var blendoSearchStrQuantity = 4; // number of terms to include in each search
var blendoChangeTimer = 30000; // how often (ms) to rotate between the different services
var blendoChangeContentTimeoutHandle = 0;
var blendoBlendTimer = 60000; // how often (ms) to reshuffle the search terms and search each service
var blendoBlendTimeoutHandle = 0;
var blendoRefreshProgramInfoTimeoutHandle = 0;
//var proxyUrl = "/quercus-4.0.3/WidgetProxy.php?query=";

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
}

function blendoInit() {
  plat = getPlatform();
  subscribeChannelChangeEvent();
  switchView('regular'); // TODO - shouldn't the platform call switchView?
  document.getElementById("content_container").innerHTML = '<H2>Welcome to Blendo</H2>';
  blendoChangeContentTimeoutHandle = setTimeout("blendoChangeContent(0)", blendoChangeTimer);
  blendoRefreshProgramInfo();
  // blendoBlend("cnn anderson cooper gulf oil spill obama");
}

function channelChangeEventHandler(currentChannelIndex){
  // alert(currentChannelIndex);
  blendoRefreshProgramInfo();
}

function blendoRefreshProgramInfo() {
  clearTimeout(blendoRefreshProgramInfoTimeoutHandle); // in case I wasn't called via timout, ensures only 1 active timer

  platform = getPlatform();
  nowPlaying(platform.getCurrentStationId(), blendoNowPlayingAggregator);

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
        if (arr2str.search("googleNews") != -1)
          googleNewsSearch(blendoSearchStr, blendoSearchQuantity);
        break;
      case 1:
        if (arr2str.search("flickr") != -1)
          flickrSearch(blendoSearchStr, blendoSearchQuantity);
        break;
      case 2:
        if (arr2str.search("twitter") != -1)
          twitterSearch(blendoSearchStr, blendoSearchQuantity);
        break;
      case 3:
        if (arr2str.search("picasa") != -1)
          picasaSearch(blendoSearchStr, blendoSearchQuantity);
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
      if (arr2str.search("googleNews") != -1)
        googleNewsPrint();
      break;
    case 1:
      if (arr2str.search("flickr") != -1)
        flickrPrint();
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

function flickrPrint() { 
  var htmlstr = '<div class="title">Flickr:</div><div class="results">';
  if (flickrResponse == "notSet") {
    htmlstr += 'Loading Photos...';
  } else {
    var results=flickrResponse.photos.photo;
    for (var i=0; (i < results.length && i < blendoDisplayQuantity) ; i++) {
      var result = results[i];
      var thumb_url = "http://farm" + result.farm + ".static.flickr.com/" + result.server + "/" + result.id + "_" + result.secret + "_" + "t.jpg";
      var photo_url = "http://www.flickr.com/photos/" + result.owner + "/" + result.id;
      htmlstr +=  '<div class="photo"><img alt="' + result.title + '"src="' + thumb_url + '"/></div>';
    }
  }
  htmlstr += '</div>';
  document.getElementById("content_container").innerHTML = htmlstr;
}

// PICASA

var picasaResponse = "notSet";

function picasaSearch(searchStr, searchQuantity) {
  var htmlstr = 'http://picasaweb.google.com/data/feed/base/all?alt=json&fields=entry(media:group)';
  htmlstr += '&q=' + searchStr;
  htmlstr += '&max-results=' + searchQuantity;
  htmlstr = getProxyURL(htmlstr);
  $.getJSON(htmlstr, function(data) {
    if ((data !== null) &&
        (data !== undefined) &&
        (data.feed.entry !== undefined) &&
        (data.feed.entry !== null) &&
        (data.feed.entry.length > 0)) {
      picasaResponse = data;
    }
  });
}

function picasaPrint() {
  var htmlstr = '<div class="title">Picasa:</div><div class="results">';
  if (picasaResponse == "notSet") {
    htmlstr += 'Loading Photos...';
  } else {
    var results = picasaResponse.feed.entry;
    for (var i=0; (i < results.length && i < blendoDisplayQuantity); ++i) {
      var result = results[i].media$group;
      var thumb_url = result.media$thumbnail[1].url;
      var photo_url = result.media$content[0].url
      htmlstr +=  '<div class="photo"><img "src="' + thumb_url + '"/></div>';
    }
  }
  htmlstr += '</div>';
  document.getElementById("content_container").innerHTML = htmlstr;
}

// GOOGLE NEWS

var googleNewsResponse = "notSet";

function googleNewsSearch(searchStr, searchQuantity) {
  var htmlstr='http://ajax.googleapis.com/ajax/services/search/news?v=1.0&q=' + searchStr;
  htmlstr = getProxyURL(htmlstr);
  console.log(htmlstr);
  $.getJSON(htmlstr, function(data) {
    if ((data !== null) &&
        (data !== undefined) &&
        (data.responseData.results !== undefined) &&
        (data.responseData.results !== null) &&
        (data.responseData.results.length > 0)) {
      googleNewsResponse = data;
      console.log("Mano googleNewsResponse" + googleNewsResponse);
    }
  });
}

function googleNewsPrint() {
  var htmlstr = '<div class="title">Google News:</div><div class="results">';
  if (googleNewsResponse == "notSet") {
    htmlstr += 'Loading Bad News...';
  } else {
    var results=googleNewsResponse.responseData.results;
    for (var i=0; (i < results.length && i < blendoDisplayQuantity) ; i++) {
      var result = results[i];
      htmlstr +=  '<div class="text">' + result.title + '</div>';
    }
  }
  htmlstr += '</div>';
  document.getElementById("content_container").innerHTML = htmlstr;
}

// TWITTER

var twitterResponse = "notSet";

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
  var htmlstr = '<div class="title">Twitter:</div><div class="results">';
  if (twitterResponse == "notSet") {
    htmlstr += 'Loading Tweets...';
  } else {
    var results=twitterResponse.results;
    for (var i=0; (i < results.length && i < blendoDisplayQuantity); i++) {
      var result = results[i];
      htmlstr += '<div class="text">' + result.from_user + ': ' + result.text + '</div>';
    }
  }
  htmlstr += '</div>';
  document.getElementById("content_container").innerHTML = htmlstr;
}
