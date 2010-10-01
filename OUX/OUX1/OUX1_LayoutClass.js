/**
	Creates a new Layout object
	@constructor
    @description This class object is implement by OUX Developer. 
	@property {array} layoutsArray List of layout names of the Layout object.
	@property {integer} currentLayoutIndex Current layout index.
	@property {string} currentLayout Current layout name.
*/
Layout = function() {
    this.layoutsArray = new Array('BasicStatusBar', 'BasicOneWidget', 'BasicAccordion'); // can be picked from a file that has the layouts w.r.t the skin
    this.currentLayoutIndex = 0;
    this.currentLayout = 'BasicStatusBar';
}

/**
    @description Return the list of layout names of the Layout object.
	@returns {array} List of layout names of the Layout object
*/
Layout.prototype.getLayoutList = function() {
  return this.layoutsArray;
}

/**
    @description Set the list of layout names of the Layout object.
	@param {array} layoutsList A list of names for Layout Object
*/
Layout.prototype.setLayoutList = function(layoutsList) {
	this.layoutsArray = layoutsList;
}

/**
    @description Return the current layout index of the Layout object.
	@returns {integer} Current layout index
*/
Layout.prototype.getCurrentLayoutIndex = function() {
  return this.currentLayoutIndex;
}

/**
    @description Set the current layout index of the Layout object.
	@param {integer} layoutIndex Current layout index
*/
Layout.prototype.setCurrentLayoutIndex = function(layoutIndex) {
	this.currentLayoutIndex = layoutIndex;
}
var widgetList;
var layoutsList;
var platformInUse;
var inUserSettingsWidget = false;
var accordionPopUpMessageFlag = false;
/**
 @description The function defines the key handling mechanism for the layout implemented by the OUX developer. 
 @param {integer} keyId Remote key code
*/
Layout.prototype.keystrokeCallback = function(keyId){

    layoutsList = platform.OUX.layouts.getLayoutList();
    //widgetList = OUXReturnSelectedWidgetList(platform.allWidgets.length);
    widgetList = platform.getSelectedWidgetList();
    platformInUse = platform.getIsPlatformInUse();

		switch(keyId){

		case platform.LAYOUT_KEY_SET_REMOTE.OK: // G
		case platform.LAYOUT_KEY_SET_KEYBOARD.OK:
			console.log("OUX1 Key OK");
			if(!platform.getCurrentContext() && platform.OUX.layouts.getCurrentLayoutIndex() == 0){  // if icon layout
				platform.OUX.layouts.setCurrentLayoutIndex(platform.OUX.layouts.getCurrentLayoutIndex()+1);
				switchLayout(platform.OUX.layouts.getCurrentLayoutIndex());
				widgetInitialized();
				break;
			}

			// if switching to accordion layout - get the first widget and highlight it
			// when in the accordion layout the user presses OK - that means he is selecting a widget
			// so the widget should open up and the context should change

			if(!platform.getCurrentContext() && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "BasicAccordion"){
				//platform.show(widgetList);
                                if(accordionPopUpMessageFlag == true){
                                    console.log("G WidgetInitialized()");
                                    widgetInitialized();
                                }
                                else{
                                    console.log("G inAccordionLayoutOK()");
                                    inAccordionLayoutOK();
                                }                                
				break;
			}


		case platform.LAYOUT_KEY_SET_KEYBOARD.RIGHT:
		case platform.LAYOUT_KEY_SET_REMOTE.RIGHT:
			if(platform.OUX.layouts.getCurrentLayoutIndex() == 0){  // if in icon view, just switch between widgets
				previousWidgetIndex = platform.getCurrentWidget();
				currentWidgetIndex = platform.getCurrentWidget();
				currentWidgetIndex = (currentWidgetIndex==0) ? (widgetList.length-1) : currentWidgetIndex-1;
				nextWidgetInIconView(previousWidgetIndex, currentWidgetIndex);
			}
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.LEFT:
		case platform.LAYOUT_KEY_SET_REMOTE.LEFT:
			if(platform.OUX.layouts.getCurrentLayoutIndex() == 0){  // if in icon view, just switch between widgets
				previousWidgetIndex = platform.getCurrentWidget();
				currentWidgetIndex = platform.getCurrentWidget();
				currentWidgetIndex = (currentWidgetIndex==(widgetList.length-1)) ? 0 : currentWidgetIndex+1;
				nextWidgetInIconView(previousWidgetIndex, currentWidgetIndex);
			}
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.UP: // T
		case platform.LAYOUT_KEY_SET_REMOTE.UP:
			if(accordionPopUpMessageFlag == true && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "BasicAccordion"){
				previousWidgetInAccordionLayoutUP();
			}
                       
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.DOWN: //
		case platform.LAYOUT_KEY_SET_REMOTE.DOWN:
			if(accordionPopUpMessageFlag == true && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "BasicAccordion"){
				nextWidgetInAccordionLayoutDOWN();
			}
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.MENU: // C
		case platform.LAYOUT_KEY_SET_REMOTE.MENU:
			if(!platformInUse){
                                // if platform is not activated, then activate platform and switch layout to icon (default=0)
				activateWidgetPlatform();
                switchLayout(0);         // switch to icon layout  - this is a call made by the layout developer right ?
			}
			else{
                           // load OUX settings widget?
				loadOUXSettings();
			}
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.BACK: // Back
		case platform.LAYOUT_KEY_SET_REMOTE.BACK:
                        console.log("OUX1 back key");
			if(!platform.getCurrentContext() && inUserSettingsWidget){
                           exitOUXSettings();
                           inUserSettingsWidget = false;
                        }
                       
                        if(!platform.getCurrentContext() && platform.OUX.layouts.getCurrentLayoutIndex() == 2){// || platform.OUX.layouts.getCurrentLayoutIndex() == 0){
				
                            //$( "#accordion" ).accordion("option", "active", false);
                            addAccordionHeaderHighlight();
                            removeClassesFromActiveWidget();
                         // added by Nadu
                            var divActiveW = "#" + "widget_"+ widgetList[platform.getCurrentWidget()].name;
                            var activeWidgetH = divActiveW + ' .widget_header';
                            $(activeWidgetH).addClass("ui-state-active");
                                                     
                            
                            if(accordionPopUpMessageFlag == true){
                                $( "#accordion" ).accordion("option", "active", false);
                                $('#accordionMessage').remove();
                            }
                            else{
                                accordionPopUpMessage(1);
                            }

			}
                        // regular layout
                         if(!platform.getCurrentContext() && platform.OUX.layouts.getCurrentLayoutIndex() == 1){
                            removeClassesFromActiveWidget();
                            switchLayout(0); // switch to regular layout
                        }
			break;
		case platform.LAYOUT_KEY_SET_KEYBOARD.RED: // Back
		case platform.LAYOUT_KEY_SET_REMOTE.RED:
                        //console.log("red key");
			if(!platformInUse){
                            //console.log("Platform not in use, activate");
                            activateWidgetPlatform();
                            switchLayout(platform.OUX.layouts.getCurrentLayoutIndex());
			}
			else{
                            //console.log("Platform in use, deActivate");
                            deActivateWidgetPlatform();
                            switchLayout(-1);
			}
			break;        
		case platform.LAYOUT_KEY_SET_KEYBOARD.BLUE: // Switch Layouts
		case platform.LAYOUT_KEY_SET_REMOTE.BLUE:
                        if(!inUserSettingsWidget){
                            var index= (platform.OUX.layouts.getCurrentLayoutIndex()==(platform.OUX.layouts.layoutsArray.length-1)) ? 0 : platform.OUX.layouts.getCurrentLayoutIndex()+1;

                            platform.OUX.layouts.setCurrentLayoutIndex(index)
                            removeClassesFromActiveWidget();
                            $('#accordionMessage').remove();
                            switchLayout(index);

                            if(index == 1){  // if regular layout)
                            	addIconOutline(); // added as the widget header had no style
                            	widgetInitialized();
                            }
                            if(index == 2){  // if accordion layout
                               platform.setCurrentContext(false);
                               inAccordionLayoutOK();
                            }
                            if(index == 0){ // if icon layout
                              
                                addIconOutline();
                            }
                            
                        }
                        break;
                        
		default:
			//alert("I support G T F H B C V Q W E R only :"+ myName);
		}
               lastKeyPressed = keyId;
               return;
}

/**
    @description Open the drawer of the active widget in the accordion layout
*/
function inAccordionLayoutOK(){ 
	jQuery("#accordion").accordion("activate", platform.getCurrentWidget()); // open the drawer of the active widget
   	accordionPopUpMessage(0);
	//widgetInitialized();
}

/**
    @description Navigate up in the accordion layout
*/
function previousWidgetInAccordionLayoutUP(){
    previousWidgetIndex = platform.getCurrentWidget();
    widgetIndex = platform.getCurrentWidget();
    removeAccordionHeaderHighlight();
    widgetIndex = (widgetIndex==0) ? (widgetList.length-1) : widgetIndex-1;
    platform.setCurrentWidget(widgetIndex);
    addAccordionHeaderHighlight();
    jQuery("#accordion").accordion("activate", platform.getCurrentWidget());
    accordionPopUpMessage(0);
    //widgetInitialized();
}

/**
    @description Navigate down in the accordion layout
*/
function nextWidgetInAccordionLayoutDOWN(){
	previousWidgetIndex = platform.getCurrentWidget();
	widgetIndex = platform.getCurrentWidget();
	removeAccordionHeaderHighlight();
	widgetIndex = (widgetIndex == (widgetList.length-1)) ? 0 : widgetIndex+1;
	platform.setCurrentWidget(widgetIndex);
	addAccordionHeaderHighlight();
	jQuery("#accordion").accordion("activate", platform.getCurrentWidget());
        // inserting the message div
        accordionPopUpMessage(0);
	//widgetInitialized();
}

function accordionPopUpMessage(factor){
    $('#accordionMessage').remove();
    var widgetDiv ="#" + "widget_"+ platform.getSelectedWidgetList()[platform.getCurrentWidget()].name;
    $("<div id='accordionMessage' class='accordionMessage'></div>").insertAfter(widgetDiv);
    var msgOffset = $(widgetDiv).offset();//
    //$('#accordionMessage').css('top',msgOffset.top + 50);
    //$('#accordionMessage').css('left',msgOffset.left+100);
    //var addTop = 120 + 50*(1+platform.getCurrentWidget()) +450*factor;
    var addTop = 40*(1+platform.getCurrentWidget());
    //$('#accordionMessage').offset({top: msgOffset.top +addTop, left: msgOffset.left+20});
    $('#accordionMessage').css("top",addTop);
    console.log((addTop) + "--"+ (msgOffset.left+10));
    console.log($('#accordionMessage').offset().top);
    accordionPopUpMessageFlag = true;
}

/**
    @description Remove accordion header highlight
*/
function removeAccordionHeaderHighlight(){
    var divActiveWidget = "#" + widgetList[platform.getCurrentWidget()].name;
    //        $(divActiveWidget).addClass("theme-highlight-inactive");
    $(divActiveWidget).removeClass("ui-state-active");

}

/**
    @description Add accordion header highlight
*/
function addAccordionHeaderHighlight(){
        var divActiveWidget = widgetList[platform.getCurrentWidget()].name;
//        console.log("addIconOutline, divActiveWidget: " + divActiveWidget);
        $(divActiveWidget).addClass("ui-state-active");
//        $(divActiveWidget).removeClass("theme-highlight-inactive");
/*        var divID = "#widget_" + divActiveWidget + " .widget_frame";
        var divItem = $(divID);
        var transHeight = divItem.height() + 22;
        var transWidth = divItem.width();
        $(divID).append("<div class='transparent ui-corner-all'></div>");
        $(".transparent").css({
            'height' : transHeight,
            'width' : transWidth,
            'background' : 'white',
            'position' : 'absolute',
            'top' : '-12px',
            'left' : '0px',
            'z-index' : '-10',
            'opacity' : '0.3'});
            */
}

/**
    @description Navigate in the Status Bar Layout
*/
function nextWidgetInIconView(previousWidgetIndex, currentWidgetIndex){
	removeIconOutline(previousWidgetIndex);
	platform.setCurrentWidget(currentWidgetIndex);
	addIconOutline();
}

/**
    @description Get current widget iframe id; Set focus to widget 
*/
function widgetInitialized(){
    $('#accordionMessage').remove();
    accordionPopUpMessageFlag = false; // not accordion
    var iframeid = document.getElementById(widgetList[platform.getCurrentWidget()].name);
    platform.setCurrentContext(true); // set focus to widget
}

/**
    @description Remove highlights from active widget
*/
function removeClassesFromActiveWidget(){
	if(platform.OUX.layouts.getCurrentLayoutIndex() == 2){
		removeAccordionHeaderHighlight();
	}
	removeIconOutline(platform.getCurrentWidget());
	
	 
}

/**
    @description Add Icon outline
*/
function addIconOutline(){
	 
        var divActiveWidget = widgetList[platform.getCurrentWidget()].name;
        console.log("addIconOutline, divActiveWidget: " + divActiveWidget);
        // added by Nadu
        $('#'+divActiveWidget).addClass("ui-state-active");
        
       
        // Ruby's code - Add Border to Icon

        var divID = "#widget_" + divActiveWidget + " .widget_frame";
        var divItem = $(divID);
        var transHeight = divItem.height() + 22;
        var transWidth = divItem.width();
        $(divID).append("<div class='transparent ui-corner-all'></div>");
        $(".transparent").css({
            'height' : transHeight,
            'width' : transWidth,
            'background' : 'white',
            'position' : 'absolute',
            'top' : '-12px',
            'left' : '0px',
            'z-index' : '-10',
            'opacity' : '0.3'});

        
        // added by Nadu
        var divActiveWidget = "#" + "widget_"+ widgetList[platform.getCurrentWidget()].name;
        var activeWidgetHeader = divActiveWidget + ' .widget_header';
        $(activeWidgetHeader).addClass("ui-state-active");
}

/**
    @description Remove Icon outline
*/
function removeIconOutline(previousWidget){
	var divActiveWidget = "#" + widgetList[previousWidget].name;
     
    // added by Nadu
	$(divActiveWidget).removeClass("ui-state-active");
    
	// Ruby's code - Add border to ICON
	var divID = ".transparent";
        $(divID).remove();
	
	// added by Nadu
    var divActiveWidget = "#" + "widget_"+ widgetList[previousWidget].name;
    var activeWidgetHeader = divActiveWidget + ' .widget_header';
   	$(activeWidgetHeader).removeClass("ui-state-active");
    
}

/**
    @description Activate Widget Platform implemented by the OUX developer.
*/
activateWidgetPlatform = function(){
	platform.setIsPlatformInUse(1);
}

/**
    @description Deactivate Widget Platform implemented by the OUX developer.
*/
deActivateWidgetPlatform = function(){
	platform.setIsPlatformInUse(0);
}


// save settings prior to preference widget call
var tempCurrentWidgetIndex;
var tempCurrentWidgetIndex;
var tempOUXSettingsWidgetIndex;

/**
    @description called before the OUX Settings widget is shown
*/
function loadOUXSettings(){
    inUserSettingsWidget = true;

    // save settings prior to preference widget call
    tempCurrentWidgetIndex = platform.getCurrentWidget();
    tempCurrentLayoutIndex = platform.OUX.layouts.getCurrentLayoutIndex();
    
    // create temporary array element to be added to the Selected Widget List
    preferencesWidget = new Array({name:'OUXSettingsWidget', view:'icon', title:'User Preferences', description:'Set User preferences and App Store'});
    
    // temp variable storing index in which the OUX Settings widget got inserted - will be useful for removing the widget
    tempOUXSettingsWidgetIndex = platform.getSelectedWidgetList().length;

    addToSelectedWidgetsList(preferencesWidget[0]);
    widgetList = platform.getSelectedWidgetList(); // updating the widgetList array
    platform.setCurrentWidget(platform.getSelectedWidgetList().length-1);
    $('#widget_OUXSettingsWidget').show();
    addIconOutline();

    switchLayout(1); // switch to regular layout for the preferred widget
    
    platform.setCurrentContext(true);
    
}

function addToSelectedWidgetsList(addW){
    platform.addToSelectedWidgetList(addW);
}


function exitOUXSettings(){

// platform.show function console logs the array that is passed as an argument
     platform.show(platform.getSelectedWidgetList());
// remove the Settings Widget from the Selected Widgets List
     platform.removeSelectedWidget(tempOUXSettingsWidgetIndex);
     platform.show(platform.getSelectedWidgetList());
     
     //var wtest = platform.createSelectedWidgetList(platform.allWidgets.length);
//   the following line recreates the Selected widget list so that the platform's selected array is also refreshed
     platform.setSelectedWidgetList(platform.createSelectedWidgetList(platform.allWidgets.length));
    
     //platform.show(platform.getSelectedWidgetList());
     
// Revert back to previous layout before the Settings widget was invoked
     platform.OUX.layouts.setCurrentLayoutIndex(tempCurrentLayoutIndex);
// start with the first widget - coz the last active widget might have been deselected by the user
     platform.setCurrentWidget(0);
     
     removeIconOutline(tempCurrentWidgetIndex);
     addIconOutline();
     widgetList = platform.getSelectedWidgetList();
// hide the Settings Widget
     $('#widget_OUXSettingsWidget').hide();

// reshuffle the order of the widgets
     reshuffleSelectedWidgets();
    
// currently forcing it to go back to the Icon layout
     switchLayout(0);
 
}

/**
    @description This method is called when the Settings widget is exited. If the user changes which widgets to display on the screen using the Preferences panel, then the Selected Widget list is recreated
*/

function reshuffleSelectedWidgets(){
    var tmpWidgetList =  widgetList;
    $('#accordionMessage').remove();
    
    var accordionChildren =  $('#accordion').children();
    console.log(accordionChildren);
    for(var i=0;i<widgetList.length;i++){
        var str = $(accordionChildren).get(i).id;
        console.log("index of "+ widgetList[i].name+" ="+$(accordionChildren).get(i).id); //'widget_'+widgetList[i].name));
       	swapWidgets(i,str.substr(7));
        
    }
    $("<div id='accordionMessage'></div>").insertAfter("#" + "widget_"+ platform.getSelectedWidgetList()[0].name);
    $('#accordionMessage').hide();
    
    for(var i=0;i<widgetList.length;i++){
        console.log("new widgetList=" +widgetList[i].name);
    }

}

function swapWidgets(index, name){
    console.log("swap widgets"+ index + ' ' + name);
	for(var i=0;i<widgetList.length;i++){
        if(widgetList[i].name === name){
            if(i!=index){
                var tmp = widgetList[i];
                widgetList[i] = widgetList[index];
                widgetList[index] = tmp;
            }
        }
    }

}
