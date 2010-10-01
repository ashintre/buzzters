/**
    @description Determines what to put in Panel 1
*/

var panel1 = "<p>Proxy Example:<br><button id='btnProxyDigg' class='btn1 navigationClass'>Get Popular Digg News</button></p>";

/**
    @description Determines what to put in Panel 2
*/
var panel2 = "<p>CSF Example:<br><button id='btnCSFNowPlaying' class='btn1 navigationClass'>Get Now Playing Information</button></p>";

/**
    @description Determines what to put in Panel 3
*/
var panel3 = "<p>Input Test:\n\
                <br><input class='btn1 navigationClass' type='checkbox' id='optProxy' />Proxy Digg News\n\
                <br><input type='checkbox' class= 'navigationClass' id='optCSF' />CSF Now Playing\n\
                <br><button id='btnReset' class= 'navigationClass'>Reset</button></p>";



/**
    @description An array of panels that will be added to the widget
*/
var panels = new Array(
	{id: 'panel1', cssClassString: 'theme-content', html: panel1},
	{id: 'panel2', cssClassString: 'theme-content', html: panel2},
	{id: 'panel3', cssClassString: 'theme-content', html: panel3}
);

/**
    @description Panel Object created by Widget Developer
*/
/*
var myPrototype = {};
var myPanel = {};
myPrototype.prototype = Panels.prototype.beget(); //new Panels(); //null; // Global object. Need to initialize in init function
myPanel = myPrototype.prototype;

myPrototype.prototype =  new TextBox();
myTextBox = myPrototype.prototype;

*/

document.onkeydown = mainKeyHandler;

/**
    @description Detects key presses and pass event to Panel Object
*/
function mainKeyHandler(e){
    myPanel.keyHandler(e);
}

/**
	@description Activate JQuery UIs
*/
function activateJqueryUI(){
	$("button").button();
	// add more jquery activation stuff here
}

/**
	@description Callback to update Panel (used by proxy)
*/
function updatePanelCallback(newHtml){
        updatePanel(getCurrentPanelIndex(), newHtml);
}

/**
    @description Initial function to be called when page is loaded.
*/
function init(){
      
	// Define Panels
    //myPanel = new Panels(); // create new object
	//myPanel.generatePanels(panels); // generate new Panels
	//myPanel.switchPanels(0); // switch to first panel
	//switchView(views[currentViewIndex]); // switch to current view
	
	//createElements();
	
	// added by nadu - for registering key press callback for elements

	createFlipPanels(panels);
	flipPanels(0);
	$("#"+getActiveElementId()).addClass(getActiveClass());
	
	registerKeyPressCallbacks();
	
      // Apply CSS Style
        console.log("getOUXTheme in flipPanel.js");
       // getOUXTheme(); // Theme related function
        activateJqueryUI(); // Activate JQuery UI
     
}

/*
 * the widget developer registers with the platform - those element id, the key press and the callback function 
 * to be called when the key is pressed with the element id in focus
 * the parameter passed as callbackFunction is a function reference
 */

function widgetKeyPressOK(){
	var currentBtn = $('#'+getActiveElementId()); 
	if(currentBtn != null){
		switch(currentBtn[0].id){
			case "btnProxyDigg":
				getDiggPopular();
				break;
			case "btnCSFNowPlaying":
				getNowPlayer();
				break;
			case "optProxy":
				if($(currentBtn).attr('checked')){
                                    $(currentBtn).attr('checked', false);
                                }
                                else{
                                    $(currentBtn).attr('checked', true);
                                }
				break;
			case "optCSF":
				if($(currentBtn).attr('checked')){
                                    $(currentBtn).attr('checked', false);
                                }
                                else{
                                    $(currentBtn).attr('checked', true);
                                }
				break;
			case "btnReset":
                                if($('#optProxy').attr('checked')){
                                    updatePanel(0, panels[0].html);
                                }
                                if($('#optCSF').attr('checked')){
                                    updatePanel(1, panels[1].html);
                                }
				break;
			default:
				break;
		}
	}
	return true;;
}

function updatePanel(index, html){
	$("#"+getActiveElementId()).removeClass(getActiveClass());
	setActiveElementId(panels[index].id);
	$("#" + panels[index].id).html(html);
}

function registerKeyPressCallbacks(){
	
	callbackFunction = widgetKeyPressOK;
	top.registerKeyPressCallbacks_PLATFORM("flipPanels","btnProxyDigg","KEY_OK",callbackFunction);
	top.registerKeyPressCallbacks_PLATFORM("flipPanels","btnCSFNowPlaying","KEY_OK",callbackFunction);
	top.registerKeyPressCallbacks_PLATFORM("flipPanels","btnReset","KEY_OK",callbackFunction);
	
}

function keyHandler(function_keyPress){
	return function_keyPress();
}

var global_activeElementId = "panel1";

/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	if(getActiveElementId() == 'panels'){
		return "ui-state-active";
	}
	return "ui-state-hover";
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