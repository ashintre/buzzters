var platformObject;
var mediaPlayer = null;

/**
@description Constructor for the Platform Class
@property {array of objects} allWidgets array of ALL widget objects that the user has subscribed/bought
@property {array} userPreferences array of user preferences - not used currently
@property {array} selectedWidgets array of widgets with selected property true. OUX developer can control the number of widgets on the screen by limiting the number of selected widgets
@property {int} currentWidget index of current widget in the selectedWidgets array
@property {object} OUX OUX Class
@property {array} channels array of currently listed channels
@property {int} currentChannelIndex index of the currently playing channel in the channels array 
@property {boolean} isInFrame keeps state of where the focus is -"true: in widget's focus, false - not in widget's focus"
@property {boolean} isPlatformInUse to keep the state if the user is using widgets or not 
@property {string} environment to identify which is the environment in which the widget platform is being pulled up - STB for Set Top Boxes, Browser for Browsers

*/

Platform = function() {

	this.allWidgets = {};//getPreferredWidgetsXML();
    this.userPreferences = {};
        
        
	this.currentWidget = 0;

    this.OUX = {};
       
    this.channels = getChannelList();//{}
    console.log(this.channels);
    this.currentChannelIndex = 0;

	
	this.isInIFrame = false; 			//  keep a state of where the context is
	this.isPlatformInUse = false;      // to keep the state if the user is using widgets or not
//Mano edit
        this.environment = "BROWSER";
//	this.environment = "STB";


    this.WIDGET_KEY_NUMBERS_REMOTE = new Array(137,38,40,37,39,917536,917555,48,49,50,51,52,53,54,55,56,57);
    this.WIDGET_KEY_NUMBERS_KEYBOARD = new Array(71,84,66,70,72,86,67,48,49,50,51,52,53,54,55,56,57);

this.LAYOUT_KEY_NUMBERS_REMOTE = new Array(137,38,40,37,39,917536,917555,917504,917505, 917506, 917507);
this.LAYOUT_KEY_NUMBERS_KEYBOARD = new Array(71,84,66,70,72,86,67,81,87,69,82);


this.WIDGET_KEY_SET_REMOTE = {"OK" : 137, "UP" : 38, "DOWN" : 40, "LEFT" : 37, "RIGHT" : 39, "BACK" : 917536, "MENU" : 917555, "ZERO":48, "ONE":49, "TWO":50, "THREE":51, "FOUR":52, "FIVE":53,
                            "SIX":54, "SEVEN":55, "EIGHT":56, "NINE":57, "TEXT_KEY": 917777};
this.LAYOUT_KEY_SET_REMOTE = {"OK" : 137, "UP" : 38, "DOWN" : 40, "LEFT" : 37, "RIGHT" : 39, "BACK" : 917536, "MENU" : 917555,
                                "RED": 917504, "GREEN": 917505, "YELLOW": 917506, "BLUE": 917507, "TEXT_KEY": 917777}

this.WIDGET_KEY_SET_KEYBOARD = {"OK" : 71, "UP" : 84, "DOWN" : 66, "LEFT" : 70, "RIGHT" : 72, "BACK" : 86, "MENU" : 67,"ZERO":48, "ONE":49, "TWO":50, "THREE":51, "FOUR":52, "FIVE":53,
                                "SIX":54, "SEVEN":55, "EIGHT":56, "NINE":57, "TEXT_KEY": 88};
this.LAYOUT_KEY_SET_KEYBOARD = {"OK" : 71, "UP" : 84, "DOWN" : 66, "LEFT" : 70, "RIGHT" : 72, "BACK" : 86, "MENU" : 67, "RED": 81,
                                "GREEN": 87, "YELLOW": 69, "BLUE": 82, "TEXT_KEY": 88};

 this.keyPressRegistry = new Array();
 this.globalPreferences = new Array();
 this.textKeyFlag = false;
 this.macid = null;
};

/**
@description the index of current widget in the selected widgets array.  
@return {int} returns the index of current widget
*/

Platform.prototype.getCurrentWidget = function() {
   //console.log("getCurrentWidget=" + this.currentWidget);
  return this.currentWidget;
}
/**
@description the index of current widget in the selected widgets array.  
@aparam {int} sets the index of current widget
*/

Platform.prototype.setCurrentWidget = function(widgetIndex) {
 //console.log("setCurrentWidget=" + widgetIndex);
	this.currentWidget = widgetIndex;
}

/**
@description Returns the entire widget array - all widgets that the user has subscribed to  
@return {array} returns the entire widget array
*/
Platform.prototype.getAllWidgetList = function() {
  return this.allWidgets;
}

/**
@description Returns the selected widget array - top 'n' widgets of the selected widgets array
@param {int} n top 'n' elements will be returned
@return {array} the selected widget array
*/
Platform.prototype.getSelectedWidgetList = function(n) {
  var tmpArray = new Array();
  if(n == undefined){
     return this.selectedWidgets;
  }
  if(n>this.selectedWidgets.length){
	  n = this.selectedWidgets.length;
  }
  for(var i=0;i<n;i++){
          tmpArray[i] = this.selectedWidgets[i];
  }
  return tmpArray;
}

/**
@description Sets the all widgets array 
@param {array} widgetsList
*/

Platform.prototype.setAllWidgetList = function(widgetsList) {
	this.allWidgets = widgetsList;
}

/**
@description Sets the selected widget
@param {array} widgetsList
*/

Platform.prototype.setSelectedWidgetList = function(widgetsList) {
	this.selectedWidgets = widgetsList;
}

/**
@description Returns true if widget is in focus else false
@return {boolean} true/false
*/
Platform.prototype.getCurrentContext = function() {
  return this.isInIFrame;
}

/**
@description sets isInIframe true if widget is in focus else false
@param {boolean} context - true or false
*/
Platform.prototype.setCurrentContext = function(context) {
	this.isInIFrame = context;
}


/**
@description returns the isPlatformInUse variable
@returns {int} 2 if the platform is in use
*/
Platform.prototype.getIsPlatformInUse = function() {
  return this.isPlatformInUse;
}
/**
@description sets the isPlatformInUse variable
@param {int} inUse -2 if the platform is in use
*/
Platform.prototype.setIsPlatformInUse = function(inUse) {
	this.isPlatformInUse = inUse;
}

/**
@description gets the iframe id of the widget in focus
@return {string} iframe id of the widget
*/

Platform.prototype.getCurrentWidgetIframeId = function(){
    this.selectedWidgets[platform.getCurrentWidget()].name;
}

/**
@description returns the index of the currently playing channel of channels array
@return {string} index of the currently playing channel
*/
Platform.prototype.getCurrentChannelIndex = function() {
  return this.currentChannelIndex;
}

/**
@description sets the index of the currently playing channel of channels array
@param {string} index of the currently playing channel
*/
Platform.prototype.setCurrentChannelIndex = function(index) {
  this.currentChannelIndex = index;
}

/**
@description returns the index of the currently playing channel of channels array
@return {string} index of the currently playing channel
*/
Platform.prototype.getCurrentStationId = function() {
  return this.channels[this.currentChannelIndex].stationId;

}

Platform.prototype.isKeyInWidgetSet = function(keyId){
    for(i=0;i<this.WIDGET_KEY_NUMBERS_REMOTE.length;i++){
        if((keyId == this.WIDGET_KEY_NUMBERS_REMOTE[i]) || (keyId == this.WIDGET_KEY_NUMBERS_KEYBOARD[i])){
            return true;
        }

    }
    return false;
}
Platform.prototype.isKeyInLayoutSet = function(keyId){
    for(i=0;i<this.LAYOUT_KEY_NUMBERS_REMOTE.length;i++){
        if((keyId == this.LAYOUT_KEY_NUMBERS_REMOTE[i]) || (keyId == this.LAYOUT_KEY_NUMBERS_KEYBOARD[i])){
            return true;
        }

    }
    return false;
}

/**
@description add widget to the all widgets list
@param {Array} widget object to be added 
*/

Platform.prototype.addWidget = function(widget){
   this.allWidgets[this.allWidgets.length] = widget;
    //console.log("parameter passed=" + widget);
    
}

/**
    @description removes widget from the all widgets list
    @param {int} index of the widget to be removed
*/

Platform.prototype.removeWidget = function(index){
 this.allWidgets.splice(index,1);
}

/**
@description add widget to the selected widgets list
@param {Array} widget object to be added 
*/

Platform.prototype.addToSelectedWidgetList = function(widget){
   this.selectedWidgets[this.selectedWidgets.length] = widget;
    //console.log("parameter passed=" + widget);

}

/**
    @description removes widget from the selected widgets list
    @param {int} index of the widget to be removed
*/
Platform.prototype.removeSelectedWidget = function(index){
	this.selectedWidgets.splice(index,1);
}

/**
    @description creates the Selected Widget list array from the all Widgets List
    @param {int} numberOfSelectedWidgets - passed here as the length of the all Widgets list
*/

Platform.prototype.createSelectedWidgetList = function(numberOfSelectedWidgets){

        var allWidgets = platformObject.getAllWidgetList();
        var selectedTopWidgets = [];
        var selectedTopWidgetsCount = 0;

        // loop through all widgets to get selected widget
        for(var i = 0; i < allWidgets.length; i++){
            if(allWidgets[i].selected == "true"){
                selectedTopWidgets[selectedTopWidgetsCount] = allWidgets[i];
                console.log("selectedTopWidgets[selectedTopWidgetsCount] = " + selectedTopWidgets[selectedTopWidgetsCount]);
                selectedTopWidgetsCount++;
            }

            if(selectedTopWidgetsCount == numberOfSelectedWidgets){
                return selectedTopWidgets;
            }
        }

        return selectedTopWidgets;
}


Platform.prototype.show = function(arrayW){
    for(var i=0;i<arrayW.length;i++){
        console.log(arrayW[i].name+"--"+arrayW[i].selected);
    }
}



// Load Initial Javascripts
/**
@description Builds each widget as an iframe.
 All widgets under the <widgetlist> tag of the STB will be loaded.  
*/
function buildWidgetsAsIframes(){
     createPlatformObject();
     //var widgets = platformObject.getAllWidgetList();
     // only the selected widgets are loaded ! - before this code change - all widgets were being loaded
     var widgets = platformObject.getSelectedWidgetList();
		// Attach Widgets (frames) to #widgets_container
		for(i in widgets) {
			// The code below is defining <div id ="widget_<widget>"><h3 class='widget_header'>Name</h3><div class='widget_frame'><iframe id ="<widget>"></iframe</div></div>
			//The transparency div and cover div were introduced to achieve opacity for the widget frame without effecting child elements.
			//The above is work in progress.
			/*$('.widget_container').append("<div id='widget_" + widgets[i].name
				+ "'><h3 class='widget_header ui-helper-reset ui-accordion-header ui-corner-top'><a href='#'>"
				+ widgets[i].title + "</a></h3><div class='widget_frame'><iframe id=" + widgets[i].name + " src='../../widgets/"
				+ widgets[i].name + "/" + widgets[i].name + ".html' scrolling='no'></iframe></div></div>");*/
			
			$('.widget_container').append("<div id='widget_" + widgets[i].name
					+ "'><h3 class='widget_header ui-helper-reset ui-accordion-header ui-corner-top'><a href='#'>"
					+ widgets[i].title + "</a></h3><div class='widget_frame'></div></div>");
			 var iFrameObj = document.createElement('IFRAME');
			 iFrameObj.id = widgets[i].name;
			 iFrameObj.src = "../../widgets/" + widgets[i].name + "/" + widgets[i].name + ".html";
			 iFrameObj.scrolling = 'no';
			 $("#widget_"+ widgets[i].name +'> .widget_frame').append(iFrameObj)
			 iFrameObj.onload="init_all(this)";
			 console.log("iframeid = "+iFrameObj.id);
			 $(iFrameObj).load(function() 
					    {
				 			//alert("iframeid = "+this.id);
					        //iFrameObj.contentWindow.init_all(this);
				 			allWidgetsInit(this);
					        
					    }); 
			
			$('#widget_' +  widgets[i].name).show();
		}
}


/**
@description creates the video player and switches to the first channel. This is called before the widgets are built as iframes
*/
function bootStrapLoad(){
                //Call to create a media player

                /*
                 * This line ensures WebKit copmletes page layout etc. before the rest of
                 * the function is executed. If this is not done, the plugin will not be
                 * available when called.
                 */
                var ignoreMe = document.body.offsetWidth;
                console.log("******ADDRS***** =="+platformObject.channels[0].multicastAddress);
                createPlayer();
              
                play(platformObject.channels[0].multicastAddress); 
                SetTvDebugger(debuglevel);
                TvDebugger("debug msg 1");
                TvDebugger("debug msg 2");
                TvDebugger("debug msg 3");
}


/**
@description changes the size of the video
@param {String} the css class of the div - videoplane
*/

function changeSizeOfVideo(videoSize){ // para is either fullvideo or minivideo
        document.getElementById("videoplane").setAttribute("class",videoSize);
}

/**
@description returns the platform object

*/
function getPlatform(){
    return platformObject;
}

function createPlatformObject(){
          //platformObject = new Platform();   // create the platform object
          platformObject.allWidgets = getPreferredWidgetsXML();// new Widgets();
          console.log("create Platform obj");
          platformObject.selectedWidgets = platformObject.createSelectedWidgetList(platformObject.allWidgets.length);
         //platformObject.userPreferences = getUserPreferencesXML();
          platformObject.OUX = new OUX();        // create the OUX object - probably will have parameters that can be passed to it
}

function createPlayer() {
    try {

        mediaPlayer = toi.mediaService.createPlayerInstance();
        //mediaPlayer.addEventListener(mediaPlayer.ON_STATE_CHANGED, onStateChanged);
        //mediaPlayer.addEventListener(mediaPlayer.ON_POSITION_CHANGED, onPositionChanged);
    } catch(e) {
        console.log("Failed creating player: " + e);
    }
}



function play(uri) {
        
        try {
                //console.log("mediaPlayer state = "+mediaPlayer.getState());
                if(mediaPlayer && mediaPlayer.getState() != 0){
                    closeMediaPlayer();
                }
                //console.log("igmp://"+uri);
                mediaPlayer.open("igmp://"+uri);
                mediaPlayer.play(1000);
                platformObject.environment = "STB";
                //setInitialPath('STB');
        } catch (e) {
            console.log("Failed opening stream: " + e);
            platformObject.environment = "BROWSER";
            //setInitialPath('BROWSER');
            return;
        }
}
    


function closeMediaPlayer() {
    try{
        mediaPlayer.close();
        mediaPlayer.destroy();
    }
    catch (e) {
        console.log("Failed closing stream: " + e);
        return;
    }
}

$(document).keydown(function (e){
    keyHandler(e);
});

/**
@description widgets can register for the channel change event - channelChangeEventHandler
@param {String} widget name
*/

Platform.prototype.subscribeChannelChangeEvent =function(widgetName){
   
    iframeId = document.getElementById(widgetName);
    $(document).bind('channelChanged', function(){
        if(iframeId.contentWindow.channelChangeEventHandler)
        	iframeId.contentWindow.channelChangeEventHandler(platform.getCurrentChannelIndex());
        //iframeid.LoadVideoSearchControl();

    })
}


Platform.prototype.existsInWidgetList = function(w){
    for(i=0;i<this.allWidgets.length;i++){
        if(this.allWidgets[i].name == w.name){
            return true;
        }
    }
    return false;
}

function getParameterByName( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null ) 
    return "1";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
/**
@description returns the MAC address of the user  
@return {String} MAC address : -1 if it is a Browser 
*/

function returnMACAddress(){
	if(platformObject.environment == "STB"){
    	var mac = toi.informationService.getObject("const.ip.eth0.mac");
    	console.log("The MAC address is == "+mac);
        return toi.informationService.getObject("const.ip.eth0.mac"); 
    }
    // process the argument passed and return macaddress as the value passed as macid
	// if blank return 1
	else if(platformObject.macid == null){
		platformObject.macid = getParameterByName('id');
		
    }
	return platformObject.macid;
    
}


/**
@description switches the current channel to the multicast address passed as parameter   
@param {String} multicast address - "225.1.1.10:5010"
*/

function switchToChannel(multicastAddress){
   closeMediaPlayer();
	play(multicastAddress);
}
/**
@description returns true if the text key is switched on (text key is 'x' on the keyboard)   
@return {boolean} true if the text key is ON else false 
*/
function getTextKeyFlag(){
	return platformObject.textKeyFlag;
}

/**
@description sets the text key to the given parameter 
@param {boolean}  true will set the text key to ON
*/
function setTextKeyFlag(_textKeyFlag){
	platformObject.textKeyFlag = _textKeyFlag;
}

function getRunningEnvironment(){
	return platformObject.environment;
}
