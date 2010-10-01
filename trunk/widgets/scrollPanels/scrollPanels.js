/**
@description Global Active Element Id
*/
var global_activeElementId = "";

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

/**
	@description Get Popular NYT News
*/
function getNYTPopular(){

	var diggAPI = "http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key=ef6e501729d44cd9da45c9b1a4baf4f3:0:60732044";

	var req = getProxyURL(diggAPI);
	console.log(req);
	$.getJSON(req, function(data){
		if ((data !== null) &&
	        (data !== undefined)){
			createScrollPanels(createPanelArray(data));
		}
	});
}

/**
	@description Callback function for getDiggPopular()
*/
function createPanelArray(data){
        var panels = new Array();
        
        console.log("createPanelArray");
        for(var i = 0; i < 5; i++){
            var panel_id = i;
            var panel_name = data.results[i].title;
            var panel_html = data.results[i].abstract;
            panels[i] = new Object({id: panel_id, name: panel_name, html: panel_html});
        }
        console.log("end createPanelArray");
        console.log(panels);
        return panels;
}

function keyHandler(function_keyPress){
	return function_keyPress();
}

/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	return "ui-state-active";
}


function init(){

    // Get Content from Proxy Call to NYT
    getNYTPopular();

    // Apply CSS Style
    getOUXTheme(); // Theme related function

    // Set up views
    switchView(views[currentViewIndex]);
}
