/**
	Creates a new Layout object
	@constructor
    @description This class object is implement by OUX Developer. 
	@property {array} layoutsArray List of layout names of the Layout object.
	@property {integer} currentLayoutIndex Current layout index.
	@property {string} currentLayout Current layout name.
*/
Layout = function() {
    this.layoutsArray = new Array('SingleSmall', 'SingleTicker', 'ThreeSmall'); // can be picked from a file that has the layouts w.r.t the skin
    this.currentLayoutIndex = 0;
    this.currentLayout = 'noLayout';
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
	console.log("setCurrentLayoutIndex");
	this.currentLayoutIndex = layoutIndex;
}

/**
    @description ???
	@param {integer} keyId ???
	@returns {boolean} ???
*/
Layout.prototype.isKeyInWidgetSet = function(keyId){
    for(i=0;i<platform.WIDGET_KEY_NUMBERS_REMOTE.length;i++){
        if((keyId == platform.WIDGET_KEY_NUMBERS_REMOTE[i]) || (keyId == platform.WIDGET_KEY_NUMBERS_KEYBOARD[i])){
            return true;
        }

    }
    return false;
}

/**
    @description ???
	@param {integer} keyId ???
	@returns {boolean} ???
*/
Layout.prototype.isKeyInLayoutSet = function(keyId){
    for(i=0;i<platform.LAYOUT_KEY_NUMBERS_REMOTE.length;i++){
        if((keyId == platform.LAYOUT_KEY_NUMBERS_REMOTE[i]) || (keyId == platform.LAYOUT_KEY_NUMBERS_KEYBOARD[i])){
            return true;
        }
     
    }
    return false;       
}

/**
    @description The function defines the key handling mechanism for the layout implemented by the OUX developer. 
	@param {integer} keyId Remote key code
*/
var widgetList;

Layout.prototype.keystrokeCallback = function(keyId){

    // Need layoutsList and WidgetList for the switch cases
    var layoutsList = platform.OUX.layouts.getLayoutList();
    widgetList = platform.getSelectedWidgetList(3);//returnSelectedWidgetList(3);
    console.log("WidgetList size test " + widgetList.length);

    var widget_id = "#widget_" + widgetList[platform.getCurrentWidget()].name;;
    var new_widget_id;
    var index;
    
    platformInUse = platform.getIsPlatformInUse();

		switch(keyId){

		case platform.LAYOUT_KEY_SET_REMOTE.OK: // G
		case platform.LAYOUT_KEY_SET_KEYBOARD.OK:

                       console.log("OK!");
                        
			if(!platform.getCurrentContext() && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "SingleSmall"){
                            widgetInitialized();
                            removeNavigationPoint(widget_id);
                            break;
			}

			if(!platform.getCurrentContext() && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "SingleTicker"){
                            widgetInitialized();
                            removeNavigationPoint(widget_id);
                            break;
			}
			if(!platform.getCurrentContext() && layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "ThreeSmall"){
                            widgetInitialized();
                            removeNavigationPoint(widget_id);
                            break;
			}
                        
		case platform.LAYOUT_KEY_SET_KEYBOARD.RIGHT:
		case platform.LAYOUT_KEY_SET_REMOTE.RIGHT:
                        console.log("keyboard right");
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.LEFT:
		case platform.LAYOUT_KEY_SET_REMOTE.LEFT:
                        console.log("keyboard left");
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.UP: // T
		case platform.LAYOUT_KEY_SET_REMOTE.UP:
			if((layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "ThreeSmall") &&
                            (!platform.getCurrentContext())){

                            // remove border from current selected widget\
                            removeNavigationPoint(widget_id);
                            
                            index= (platform.getCurrentWidget()==0) ? (widgetList.length-1) : platform.getCurrentWidget()-1;
                            platform.setCurrentWidget(index);

                            // add border to the new selected widget
                            new_widget_id = "#widget_" + widgetList[platform.getCurrentWidget()].name;
                            addNavigationPoint(new_widget_id);
                        }
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.DOWN: //
		case platform.LAYOUT_KEY_SET_REMOTE.DOWN:
			if(layoutsList[platform.OUX.layouts.getCurrentLayoutIndex()] == "ThreeSmall" &&
                            (!platform.getCurrentContext())){
                            // remove border from current selected widget
                            removeNavigationPoint(widget_id);
                            
                            index= ((platform.getCurrentWidget()+1)==widgetList.length) ? 0 : platform.getCurrentWidget()+1;
                            platform.setCurrentWidget(index);

                            // add border to the new selected widget
                            new_widget_id = "#widget_" + widgetList[platform.getCurrentWidget()].name;
                            addNavigationPoint(new_widget_id);
    			}
			break;

		case platform.LAYOUT_KEY_SET_KEYBOARD.MENU: // C
		case platform.LAYOUT_KEY_SET_REMOTE.MENU:
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
		case platform.LAYOUT_KEY_SET_KEYBOARD.BACK: // Back
		case platform.LAYOUT_KEY_SET_REMOTE.BACK:
                        if(!platform.getCurrentContext()){ // if Widget is not in focus now.
                             $(widget_id + " .widget_header").addClass("ui-state-default");
                            $(widget_id + " .widget_header").removeClass("ui-state-active");    
                            addNavigationPoint(widget_id);
                        }
			break;
                case platform.LAYOUT_KEY_SET_KEYBOARD.RED: // RED
		case platform.LAYOUT_KEY_SET_REMOTE.RED:
			if(!platformInUse){
                            activateWidgetPlatform();
                            switchLayout(platform.OUX.layouts.getCurrentLayoutIndex());
			}
			else{
                            deActivateWidgetPlatform();
                            switchLayout(-1);
			}
			break;
                case platform.LAYOUT_KEY_SET_KEYBOARD.BLUE: // Blue
		case platform.LAYOUT_KEY_SET_REMOTE.BLUE:
                        index= (platform.OUX.layouts.getCurrentLayoutIndex()==(platform.OUX.layouts.layoutsArray.length-1)) ? 0 : platform.OUX.layouts.getCurrentLayoutIndex()+1;
                        switchLayout(index);
                        removeNavigationPoint(widget_id);
                        break;
                        
		default:
			//alert("I support G T F H B C V Q W E R only :"+ myName);
		}
               lastKeyPressed = keyId;
               return;
}

/**
    @description Get current widget iframe id; Set focus to widget 
*/
function widgetInitialized(){
        var widgetList = platform.getSelectedWidgetList(3);//returnSelectedWidgetList(3);
        var widget_id = "#widget_" + widgetList[platform.getCurrentWidget()].name;
	iframeid = document.getElementById(widget_id);
        $(widget_id + " .widget_header").addClass("ui-state-active");
        $(widget_id + " .widget_header").removeClass("ui-state-default");
	platform.setCurrentContext(true);
}

/**
    @description Activate Widget Platform implemented by the OUX developer. 
*/
activateWidgetPlatform = function(){
	platform.setIsPlatformInUse(true);
}

/**
    @description Deactivate Widget Platform implemented by the OUX developer. 
*/
deActivateWidgetPlatform = function(){
	platform.setIsPlatformInUse(false);
}

function addNavigationPoint(divID){
        console.log("addNavigationPoint");
        if($('.transparent', divID).length == 0){
            var divItem = $(divID);
            var transHeight = divItem.height() - 30;
            var transWidth = divItem.width() - 30;
            $(divID).append("<div class='transparent ui-corner-all'></div>");
            $(".transparent").css({
                'height' : transHeight,
                'width' : transWidth,
                'background' : 'black',
                'position' : 'absolute',
                'top' : '20px',
                'left' : '15px',
                'z-index' : '10',
                'opacity' : '0.5',
                'text-align' : 'center'});
        }
}

function removeNavigationPoint(divID){
    $(divID + " .transparent").remove();
}