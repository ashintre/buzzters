var numFlipPanels = 0;

/**
    @public
    @description Creates a set of flip panels tabs from a specified array
    @param {String[]} panels array of properties of the tabs to be created - id, title, number of panels is the number of elements in the array
    @param panels the array with the properties of the panels to be created
    @param panels.cssClassString css class to be given to the panel
    @param panels.id id of the panel
    @param panels.html html in the panel
*/
function createFlipPanels(panels){
	numFlipPanels += panels.length;
	var flipPanelIndex =  numFlipPanels - panels.length;
	var dots = $(document).find('#dots');
	if(dots.length < 1){
		$('.panel_container').append("<ul id='dots'></ul>");
	}
	for(var i = 0; i < panels.length; i++){
		var div = "<div elementtype='flippanels' numberofpanels='"+numFlipPanels+"' index='"+(flipPanelIndex+i+1)+"' id='" + panels[i].id + "' class='"+panels[i].cssClassString+" flipPanels navigationClass' >" + panels[i].html + "</div>";
		
		//document.getElementById('panel_container').innerHTML = document.getElementById('panel_container').innerHTML + div;
		$(div).insertBefore('#dots');
			
		$('.flipPanels').attr('numberofpanels',numFlipPanels);
		$('#dots').append("<li><a href='#"+panels[i].id+"'></a></li>");
	}
}

/* KEYHANDLING FUNCTIONS */

/**
    @private
    @description Main Key handling for Flip Panels
    @param {integer} activeElementId the element that is currently selected
    @param {string} key Key Press
*/
function keyNavigationElementHandler_flippanels(activeElementId,key){
	 
	if($('#'+activeElementId).hasClass('horizontal') && key == 'UP'){
		return keyNavigationElementHandler_flippanels_LEFT(activeElementId, "LEFT_HORIZONTAL");
	}
	if($('#'+activeElementId).hasClass('horizontal') && key == 'DOWN'){
		return keyNavigationElementHandler_flippanels_RIGHT(activeElementId, "RIGHT_HORIZONTAL");
	}
	
	switch(key){
		case "UP":
			return true;
					
		case "DOWN":		
			return keyNavigationElementHandler_flippanels_DOWN(activeElementId, key);
			
		case "LEFT":
			if($('#'+activeElementId).hasClass('horizontal'))
				return true;
			return keyNavigationElementHandler_flippanels_LEFT(activeElementId, key);
			
		case "RIGHT":
			/*
        	 * If its in horizontal mode and right is pressed when a panel is active, then do nothing 
        	 */
			if($('#'+activeElementId).hasClass('horizontal')) 
				return true;
			return keyNavigationElementHandler_flippanels_RIGHT(activeElementId, key);
	}
}

/**
    @private
    @description DOWN Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_flippanels_DOWN(activeElementId){
	
	// remove class
    // get the next element of the sibling of the UL of tabs which has navigation class set
    // add the class to it
    // set the active element variable
	var currentPanelIndex = parseInt($('#'+activeElementId).attr('index'));
    $('#'+activeElementId).removeClass(getActiveClass());
    var x = $('#'+activeElementId);
    //var findUL = $(x).parent().get(0);     
    var firstChild = $(x).children();
    //allChildren = $(firstChild).find();
    var allChildren = $(x).children();
    var elementBelow = null;
    // no for loop required here - this is because the platform knows that there is <div>s with panel content after the list, its just a question of picking the right div!
    for(var j=0;j<allChildren.length;j++){
	    t = allChildren.get(j);
	    if($(t).hasClass("navigationClass")){
	    	elementBelow = t;
	    	break;
	    }
	    else if($(t).find(".navigationClass")[0] != undefined){
	    	elementBelow = $(t).find(".navigationClass")[0];
	    	break;
	    }
	    else{
	    	elementBelow = null;
	    }
    }
    if(elementBelow == null){
    	newActiveElementId = activeElementId;
    }
    else{
    	newActiveElementId = elementBelow.id;
    }
    
    setActiveElementId(newActiveElementId);
    // if there is no navigable element inside the flip panel - nothing gets highlighted
    if($("#"+getActiveElementId()).attr('elementtype') != 'flippanels'){
    	$("#"+getActiveElementId()).addClass(getActiveClass());
    }
    
    //$("#"+newActiveElementId).addClass(getActiveClass());
    return true;
	
}

/**
    @private
    @description LEFT Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_flippanels_LEFT(activeElementId){	
	var currentPanelIndex = parseInt($('#'+activeElementId).attr('index'));
    var numPanels =  parseInt($('#'+activeElementId).attr('numberofpanels'));
    
	currentPanelIndex = (currentPanelIndex == 1) ? (numPanels) : (currentPanelIndex-1);
	
	flipToPanel(currentPanelIndex);
	
	return true;
	
}

/**
    @private
    @description RIGHT Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_flippanels_RIGHT(activeElementId){	

	var currentPanelIndex = parseInt($('#'+activeElementId).attr('index'));
    var numPanels =  parseInt($('#'+activeElementId).attr('numberofpanels'));
    
    if(currentPanelIndex < numPanels){
    	currentPanelIndex = (currentPanelIndex+1);
	}
    else
    	currentPanelIndex = 1;	
	
	flipToPanel(currentPanelIndex);
	
	return true;
}

/**
 * @description Show the panel with the index passed as parameter
 * @param index of the panel to be shown - index starts from 1
 */
function flipToPanel(index){
	// remove the class from current element
	// set the new element id 
	// add the class
	// whenever flip panel is called, set the active element to the first navigable element of the active panel

	var activeElementId = getActiveElementId();
	$('#'+activeElementId).removeClass(getActiveClass());
	//var parent = $('#'+activeElementId).parent().get(0);
	//var siblings = $(parent).children();
	//var parent = $('#'+activeElementId).parent('.flipPanels').get(0);
	var siblings = $('.panel_container').find('.flipPanels');
	var newActiveElement =  null;
    var t;
    for(var j=0;j<siblings.length;j++){
    	t = siblings[j];
    	if($(t).attr('index') == index){
    		$(t).show();
    		var newPanel = $(t).attr('id');
    		newActiveElement = $('#'+newPanel).find('.navigationClass');
    		if(newActiveElement.length < 1){
    			newActiveElement = $('#'+newPanel).get(0);
    		}
    		else
    			newActiveElement = $(newActiveElement).get(0);
    		
    		setActiveElementId(newActiveElement.id);
    	}
    	else{
    		$(t).hide();
    	}
    }
    // if there is no navigable element inside the flip panel - nothing gets highlighted
    if($("#"+getActiveElementId()).attr('elementtype') != 'flippanels'){
    	$("#"+getActiveElementId()).addClass(getActiveClass());
    }
    
    $('#dots').show();
    var rDot = $('#dots').find('.active')[0];
    $(rDot).removeClass('active');
    var hDot = $('#dots').find('a').get(index-1);
    $(hDot).addClass('active');
    
    return true;
}

/**
 * @description returns the index of the current active panel
 * @return {int} index of the panel (start index - 1)
 */
function getCurrentPanelIndex(){
	var panels = $('#'+getActiveElementId()).parents("[elementtype=flippanels]").get(0);
	console.log(panels)
	panelnum = $(panels).attr('index');
	return parseInt(panelnum);
}

/**
    @description Keyhandling Related
    @description Current View Index
*/
var currentViewIndex = 0;

/**
    @description Keyhandling Related
    @description Array of views. View configuration is defined in example.css
*/
var views = new Array('icon', 'regular', 'small', 'ticker', 'full');

/**
   	@description Switch View Related
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){

	// Set view to newView
	document.getElementById('view').className = newView;
	removeHorizontalClass();
	
	switch(newView){
		case "icon":
			currentViewIndex = 0;
			switchViewIcon();
			break;
		case "regular":
			currentViewIndex = 1;
			switchViewRegular();
			break;
		case "small":
			currentViewIndex = 2;
			switchViewSmall();
		 	break;
		case "ticker":
			currentViewIndex = 3;
			switchViewTicker();
			break;
		case "full":
			currentViewIndex = 4;
			switchViewFull();
			break;
	}
}

function addHorizontalClass(){
	var allNavElements = $('.panel_container').find('.navigationClass');
	// add horizontal class to all navigable elements
	for(var i=0; i<allNavElements.length; i++){
		var t = allNavElements.get(i);
		$(t).addClass('horizontal');
	}
	
}
function removeHorizontalClass(){
	var allNavElements = $('.panel_container').find('.navigationClass');
	// add horizontal class to all navigable elements
	for(var i=0; i<allNavElements.length; i++){
		var t = allNavElements.get(i);
		if($(t).hasClass('horizontal') && $(t).attr('direction') != 'horizontal'){
			console.log('horizontal element'+ $(t).attr('id'));
			$(t).removeClass('horizontal');
		}
	}
	
}
/**
    @description Switch View Related
    @description Switch widget to Icon View
*/
function switchViewIcon(){
    console.log("switchViewSmall");
}

/**
   	@description Switch View Related
    @description Switch widget to Regular View
*/
function switchViewRegular(){


}

/**
 	@description Switch View Related
    @description Switch widget to Ticker View
*/
function switchViewTicker(){
    console.log("switchViewTicker");
    //make dots Vertical !    
    addHorizontalClass();
    
}

/**
 	@description Switch View Related
    @description Switch widget to Small View
*/
function switchViewSmall(){
    console.log("switchViewSmall");

}