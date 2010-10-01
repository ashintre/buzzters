// OK -G  button is pressed - the context changes to the widgets
// BACK - V button is pressed - the context comes back to the layout
// F & H for previous and next (widgets or layouts)

/* The below enum variable represents key board keys */
/* 	"OK" : g
	"UP" : t
	"DOWN" : b
	"LEFT" : f
	"RIGHT" : h
	"BACK" : v
	"MENU" : c
	"RED": 1
	"GREEN": 2
	"YELLOW": 3
	"BLUE": 4
*/


function keyHandler(e){
	// intitializing last key pressed - a variable for storing what key was pressed previous to the current key event
	e.preventDefault();

	if(e.dummyCode == undefined){ // if it was a key press
		keyId = (window.event) ? event.keyCode : e.keyCode;
	}
	else{
		keyId = e.dummyCode;
	}

        var platformObj = getPlatform();
        var widgetInContext = platformObj.getCurrentContext(); // true if widget context
        /* any number keys are pressed */
        if(keyId>=49 && keyId<=57){

        	var iframe = document.getElementById(widgetList[platformObj.getCurrentWidget()].name);
        	widgetInContext = widgetKeystrokeCallback(iframe, keyId);

        	// if widgetInContext is returned as -1 - that means the control is not in a text box, so go ahead change the channel
        	// assuming that the widget is not exited on any number press so setting the widgetInContext to true

        	if(widgetInContext == -1){
	        	if((keyId-48) < platformObj.channels.length){
	                channelChangeHandler(keyId-48);
	            }
        	}
        	platformObj.setCurrentContext(true);
            return;
        }
        if(keyId == 917747){
        	channelChangeHandler(platformObj.getCurrentChannelIndex()+1);
        }
        if(keyId == 917748){
        	channelChangeHandler(platformObj.getCurrentChannelIndex()-1);
        }
        if(keyId == 88 || keyId == 917777){
        	setTextKeyFlag(!getTextKeyFlag());
        }
        

        if(widgetInContext && platformObj.isKeyInWidgetSet(keyId)){
           //widgetKeyHandler(keyId, platform);
           //var iframeid = platform.getCurrentWidgetIframeId();
           var iframeid = document.getElementById(widgetList[platformObj.getCurrentWidget()].name);
           widgetInContext = widgetKeystrokeCallback(iframeid, keyId);//iframeid.contentWindow.keystrokeCallback(keyId); // so if the control has exited then return false
           platformObj.setCurrentContext(widgetInContext);

        }
        if(platformObj.isKeyInLayoutSet(keyId)){
            platformObj.OUX.layouts.keystrokeCallback(keyId);
        }
 }


function channelChangeHandler(channel){
	
	var p = getPlatform();
	if(channel > p.channels.length || channel <=0){
		return;
	}
	
	p.setCurrentChannelIndex(channel);
	$(document).trigger('channelChanged');
	closeMediaPlayer();
	play(p.channels[channel].multicastAddress);
	console.log("IAM IN THE CHANNEL CHANGER");
	console.log("channel changed"+p.channels[p.getCurrentChannelIndex()].multicastAddress);	
	channelWidgetMapper();
}

/*
 * Set the mappedChannel: e.g Moto video network channelindex=4 == ESPNNEWS
 */

var channelMappedWidgets = [{widgetname:'newsopinion', mappedStationId:'16485', status:"unset"}];
/*
platform = top.getPlatform();
index = platform.getCurrentChannelIndex();

platform.subscribeChannelChangeEvent('programprofile');
console.log(platform.channels[index].stationId);
widget = platform.getAllWidgetList();
*/

function channelWidgetMapper(){
	platform = top.getPlatform();
	var index = platform.getCurrentChannelIndex();
	var widgets = platform.getAllWidgetList();
	
	var station = platform.channels[index].stationId;
	console.log("NEWSOPINION"+station);
	console.log("LIST LENGTH:"+widgets.length);
	
		for (var i=0; i < channelMappedWidgets.length; i++){
		if(station === channelMappedWidgets[i].mappedStationId){
			console.log("MATCHED STATION ID"+channelMappedWidgets[i].mappedStationId);
			if(channelMappedWidgets[i].status === "unset"){
				console.log("ADDING NEWSOPINION which is :"+ channelMappedWidgets[i].status);
				for(var j=0; j < widgets.length; j++){
 					if(widgets[j].name === channelMappedWidgets[i].widgetname){
						var widgetToAdd = widgets[j];
						console.log("THIS IS THE WIDGET TO ADD:"+widgetToAdd.name);
					}
				}
				var ret = addWidgetToContainer(widgetToAdd);
				console.log("Mano this is the return"+ret);
				console.log("DONE ADDING WIDGET WITH NAME" + channelMappedWidgets[i].widgetname);
				channelMappedWidgets[i].status = "set";
			}
		}
		else {
			if(channelMappedWidgets[i].status === "set"){
				channelMappedWidgets[i].status = "unset";
				removeUnselectedWidget(channelMappedWidgets[i].widgetname);
			}
		}
	}
}

function registerKeyPressCallbacks_PLATFORM(widget, id, key, callbackFunction){
	var platformObj = getPlatform();
	var keyId, keyIdRemote;
	var len = platformObj.keyPressRegistry.length;
	if(len == undefined){
		len = 0;
		//platformObj.keyPressRegistry = new Array();//
	}
		
	switch(key){
		case "KEY_UP":
			keyId = 84;
			keyIdRemote = 38;
			break;
		case "KEY_DOWN":
			keyId = 66;
			keyIdRemote = 40;
			break;
		case "KEY_LEFT":
			keyId = 70;
			keyIdRemote = 37;
			break;
		case "KEY_RIGHT":
			keyId = 72;
			keyIdRemote = 39;
			break;
		case "KEY_OK":
			keyId = 71;
			keyIdRemote = 137;
			break;
		case "KEY_BACK":
			keyId = 86;
			keyIdRemote = 917536;
			break;
		case "KEY_MENU":
			keyId = 67;	
			keyIdRemote = 917555;
			break;
		default:
			keyId = 0;
			keyIdRemote = 0;
	}
	
	var tmp = new Array({widget:widget, id:id, keyIdRemote:keyIdRemote, keyIdKeyboard: keyId, callbackFunction:callbackFunction});
	platformObj.keyPressRegistry[len] =  tmp[0];
}

function searchRegistry(iframeid, elementId, key){

	var platformObj = getPlatform();
	var registry = platformObj.keyPressRegistry;
	//alert(registry[0].widget);
	for(var i=0;i<platformObj.keyPressRegistry.length;i++){
		if((document.getElementById(registry[i].widget) == iframeid) && (registry[i].id == elementId) && ((registry[i].keyIdKeyboard == key) || registry[i].keyIdRemote == key)){
			//alert("registry");
			return registry[i].callbackFunction;
		}
	}
	return false;

}
