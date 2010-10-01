/**
    @description An array of panels that will be added to the widget
*/
var panels = new Array();
//	{id: 'panel1', cssClassString: 'theme-content', html: panel1}

/**
	@description Callback to update Panel (used by proxy)
*/
function updatePanelCallback(newHtml){
        updatePanel(getCurrentPanelIndex(), newHtml);
}

/*
 * the widget developer registers with the platform - those element id, the key press and the callback function 
 * to be called when the key is pressed with the element id in focus
 * the parameter passed as callbackFunction is a function reference
 */

//window.onload = init;

function init(){
	
	panels[0] = new Object({id: 'panel_rssSubscribe', cssClassString: '', html: ""});
	panels[1] = new Object({id: 'panel_rss1', cssClassString: '', html: ""});
	panels[2] = new Object({id: 'panel_rss2', cssClassString: '', html: ""});
	panels[3] = new Object({id: 'panel_rss3', cssClassString: '', html: ""});
	
	createFlipPanels(panels);
	
	var url = 'http://www.gatech.edu/newsroom/rss/?fid=47310'; //'http://www.digg.com/rss/index.xml';'http://www.cricinfo.com/rss/content/story/feeds/page2.rss?author=321'; 
	var key = "ABQIAAAA7ZnUUuSyDdKQ5rjpJ1QzdBTUgvb2js3FkcpEU2hefT9CP44QKBS_fUNwlH6EbEjoadoLAnsm0gfDsw";
	var callbackFunction = rssFeedSubmit;
	var feedStr = "";
	$.jGFeed(url,
			function(feeds){
			  // Check for errors
			  if(!feeds){
			    // there was an error
			    return false;
			  }
			  // do whatever you want with feeds here
			  for(var i=0; i<feeds.entries.length; i++){
			    var entry = feeds.entries[i];
			    // Entry title
			    //console.log("digg-"+entry.title);
			    //console.log(feedStr);
			    feedStr = "<li class = 'navigationClass listItem' id='feeditem_"+i+"'><span>"+entry.title+"</span></li>";
			    //alert("asad"+feedStr);
			    $('#panel_rssSubscribe').append(feedStr);
			    var content = "<div class = '' id='feedContent_"+i+"'><p>"+feeds.entries[i].content+"</p></div>";
			    $('#panel_rss'+(i+1)).append(content);
			    registerKeyPressCallback("feeditem_"+i, "KEY_OK", callbackFunction);
			    
			  }
			  
			
			  flipToPanel(1);
			  $("#"+getActiveElementId()).addClass(getActiveClass()); 
			}, 3, key);
	
	

	  // Apply CSS Style
    console.log("getOUXTheme in flipPanel.js");
    getOUXTheme(); // Theme related function
    //activateJqueryUI(); // Activate JQuery UI
    
}


function rssFeedSubmit(){
	var index = parseInt(getActiveElementId().substr(9));
	flipToPanel(index+2);
	return true;
	
}

function updatePanel(index, html){
	$("#"+getActiveElementId()).removeClass(getActiveClass());
	setActiveElementId(panels[index].id);
	$("#" + panels[index].id).html(html);
}

  	
function keyHandler(function_keyPress){
	return function_keyPress();
}

var global_activeElementId = "panel_rssSubscribe";

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