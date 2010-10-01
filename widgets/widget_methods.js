function getProxyURL(url, java) {
	if(java == true)
		return top.getJavaProxyURL()+ encodeURIComponent(url);
	else
		return top.getPhpProxyURL()+ encodeURIComponent(url);
}

/**
@description Widget ID
*/
var widgetID;

/**
@description init_all() method - called when the iframe loads
*/
function init_all(iframe){
	
	widgetID = iframe.id;
	console.log("widgetID ="+widgetID);
	if(typeof window.init == 'function')
		init();
	
}

/**
    @description Get Widget ID
    @returns the Widget ID
*/
function getWidgetId(){
	return widgetID;
}

//widget get set value calls
/**
@description returns the values of the key specified  
@return returns the values of the key specified or the default value if it cannot find the value 
*/
function getVal(key,defaultReturnValue){
	//alert(widgetID);
	var platformObject =  top.getPlatform();
	var returnValue = defaultReturnValue;
	for(var i=0;i<platformObject.allWidgets.length;i++){
		if(platformObject.allWidgets[i].name == widgetID){
			returnValue = platformObject.allWidgets[i][key];
		}
	}
	return returnValue;
}

/**
@description set values
@param {} key
@param {} value
*/

function setVal(key, value){
	var updates = new Array();
	updates[0] = new Object;
	updates[0].key = key;
	updates[0].value = value;
	setVals(updates);
}
/**
@description set values
@param {} keyValuePairs
*/
function setVals(keyValuePairs){
	
	var updateArray = new Array();
	var createArray = new Array();
	var ctr1=0;
	var ctr2=0;
	console.log(keyValuePairs);
		
	// first check if the key exists then do an update 
	// else do a create
	var platformObject =  top.getPlatform();
	for(var i=0;i<platformObject.allWidgets.length;i++){
		if(platformObject.allWidgets[i].name == getWidgetId()){
			for(var j=0;j<keyValuePairs.length;j++){
				console.log("keyvalue pairs"+platformObject.allWidgets[i][keyValuePairs[j].key]);
				if(platformObject.allWidgets[i][keyValuePairs[j].key]){
					updateArray[ctr1++] = keyValuePairs[j];		
				}
				else{
					createArray[ctr2++] = keyValuePairs[j];
				}
				platformObject.allWidgets[i][keyValuePairs[j].key] = keyValuePairs[j].value; // local updation
			}
			
		}
	}
	
	updateWidgetValues(widgetID,updateArray, createArray);
	//console.log(updateArray);
}
/**
@description remove values
@param {} key
*/
function removeVal(key){
	var remove = new Array();
	remove[0] = key;
	removeVals(remove);
}

/**
@description remove values
@param {} keyValue
*/
function removeVals(keyValues){
	var removeArray = new Array();
	var ctr1=0;
	console.log("remove array"+removeArray);
		
	// else do a create
	var platformObject =  top.getPlatform();
	for(var i=0;i<platformObject.allWidgets.length;i++){
		if(platformObject.allWidgets[i].name == getWidgetId()){
			for(var j=0;j<keyValues.length;j++){
				console.log("keyvalues "+platformObject.allWidgets[i][keyValues[j]]);
				removeArray[j] = keyValues[j];
				platformObject.allWidgets[i][keyValues[j]] = null; // local updation
			}
		}
	}
	
	removeWidgetValues(widgetID,removeArray);
}

/*
 * This calls the createWidgetValues function after completion so that we do not have 2 servlets trying to write to a single file
 */
function updateWidgetValues(widgetName, updateVals, createVals){
	
	if(updateVals.length < 1){
		createWidgetValues(widgetName, createVals);
		return;
	}
	param0 = top.returnMACAddress();
	var queryString = "macaddress="+param0+"&widgetName="+widgetName+"&projectkey="+top.getProjectKey();
	for(var i=0;i<updateVals.length; i++){
		queryString += "&"+updateVals[i].key+"="+updateVals[i].value;
	}
	console.log(queryString);
	var url = top.UpdateWidgetValuesURL + queryString;
	
    console.log(url);
                        $.ajax({
                            url: url,
                            //dataType: 'xml',
                            success:function(result){if(createVals != undefined){createWidgetValues(widgetName, createVals);}},
                            async: true
                        });
                     return true;
}

/**
@description Create Widget values
@param {string} widgetName
@param {string} removeVals
@returns
*/
function createWidgetValues(widgetName, createVals){
	    
	if(createVals.length < 1){
		return;
	}
	param0 = top.returnMACAddress();
	var queryString = "macaddress="+param0+"&widgetName="+widgetName+"&projectkey="+top.getProjectKey();
	for(var i=0;i<createVals.length; i++){
		queryString += "&"+createVals[i].key+"="+createVals[i].value;
	}
	console.log(queryString);
	var url = top.CreateWidgetValuesURL + queryString;
	
    console.log(url);
                    $.ajax({
                            url: url,
                           // dataType: 'xml',
                            success:function(result){console.log("complete");},
                            async: true
                        });
                    // return wList;
}
/**
@description Remove Widget Values
@param {string} widgetName
@param {string} removeVals
@returns
*/
function removeWidgetValues(widgetName,removeVals){
	if(removeVals.length < 1){
		return;
	}
	param0 = top.returnMACAddress();
	var queryString = "macaddress="+param0+"&widgetName="+widgetName+"&projectkey="+top.getProjectKey();
	for(var i=0;i<removeVals.length; i++){
		queryString += "&"+removeVals[i]+"="+removeVals[i];
	}
	console.log(queryString);
	var url = top.RemoveWidgetValuesURL + queryString;
	
    console.log(url);
                    $.ajax({
                            url: url,
                           // dataType: 'xml',
                            success:function(result){console.log("complete");},
                            async: true
                        });
}

/**
@description Add New Widget
@param {} createVals
@returns 
*/

function addNewWidget(createVals){
    
	var p = top.getPlatform(); 
	param0 = top.returnMACAddress();
	var queryString = "macaddress="+param0+"&projectkey="+top.getProjectKey();
	for(var i=0;i<createVals.length; i++){
		if(p.existsInWidgetList(createVals[i])){
			return false;
		}
		queryString += "&"+createVals[i].key+"="+createVals[i].value;
	}
	console.log(queryString);
	var url = top.AddNewWidgetURL + queryString;
    console.log(url);
                       $.ajax({
                            url: url,
                           // dataType: 'xml',
                            success:function(result){console.log("complete");},
                            async: true
                        });
}

//THEME RELATED FUNCTION CALLS

/**
    @description Communicate & Register with parent frame to retrieve Theme CSS.
*/
function getOUXTheme() {
    registerThemeWidget();
    updateOUXTheme();
}
/**
@description Register Widget to the OUX to receive Theme Updates 
*/
function registerThemeWidget(){
    console.log("registerThemeWidget");
    if(window.top && window.top.location.href != document.location.href) {
        if(widgetID != undefined){
            window.top.updateThemeWidgetList(widgetID);
        }
    } else {
        console.log("Orphan Frame");
    }
}

/**
    @description This is a call back function the parent uses to update OUX Theme.
*/
function updateOUXTheme() {
  console.log("updateOUXTheme");
  if(window.top && window.top.location.href != document.location.href) {

    // Get Jquery files from OUX
    var customCSS = window.top.document.getElementById('customCSS');
    var minJS = window.top.document.getElementById('minJS');
    var uiMinJS = window.top.document.getElementById('uiMinJS');

    // Update Widget Jquery
    $("#customCSS").attr("href", customCSS.href);
    $("#minJS").attr("src",  minJS.src);
    $("#uiMinJS").attr("src", uiMinJS.src);

  } else {
    console.log("Orphan Frame");
  }
}



/*
 * the widget developer informs the platform
 * id -keypress- callback function
 * the platform maintains a table widget - id - key - callback_function
 * if this exists in the table and is implemented by the widget then its called
 * else the default functionality is called 
 */ 

/*
 * the widget developer registers with the platform - those element id, the key press and the callback function 
 * to be called when the key is pressed with the element id in focus
 * the parameter passed as callbackFunction is a function reference
 */
function registerKeyPressCallback(id,key,callbackFunction){
	top.registerKeyPressCallbacks_PLATFORM(getWidgetId(), id, key, callbackFunction);	
}

function getPlatform(){
	return top.getPlatform();
}

function subscribeChannelChangeEvent(){
	var p = top.getPlatform();
	p.subscribeChannelChangeEvent(getWidgetId());
}

function getPath(){
	var href = window.location.href;
	href = href.replace(getWidgetId()+".html", "");
	return href;
	
}