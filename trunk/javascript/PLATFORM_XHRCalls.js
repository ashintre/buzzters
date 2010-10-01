
function getChannelList(){
 //   var url = "../../javascript/channelList.json";
	console.log(getJavaProxyURL());
    var url = getIptvPortalURL()+"StationList%3Fmethod%3Dstationlist";
    console.log(url);
    var cList;
    				console.log("crazy call");
                    $.ajax({
                            url: url,
                            dataType: 'json',
                            success:function(result){console.log(result); cList = fillChannelList(result);},
                            async: false
                        });
                     console.log(cList);
                     return cList;
}

function fillChannelList(response){
    //console.log(channelListJson.entryCount);
    var channelListJson = response;
    console.log(channelListJson.items.length);
    
    var channelsArray = new Array();

    for(i=0;i<channelListJson.items.length;i++){
        channelsArray[i] = new Object();
    	console.log(channelListJson.items[i].stationName);
        channelsArray[i].name = channelListJson.items[i].stationName;
        channelsArray[i].stationId = channelListJson.items[i].stationId;
        //channelsArray[i].multicastAddress = channelListJson[i].multicastAddress;
        //Mano: I have used to items array to access the objects.
        channelsArray[i].multicastAddress = channelListJson.items[i].streamAddress;                        
    }

    console.log(channelsArray);//[2].name+widgetsArray[1].title+ widgetsArray[0].view);
    return channelsArray;
} 

// to be used for local development
/*
function fillChannelList(response){

    var channelListJson = response;
    var channelsArray = new Array();

    for(i=0;i<channelListJson.length;i++){
        channelsArray[i] = new Object();
        channelsArray[i].name = channelListJson[i].stationName;
        channelsArray[i].stationId = channelListJson[i].stationId;
        channelsArray[i].multicastAddress = channelListJson[i].multicastAddress;
    }

   // console.log(channelsArray);//[2].name+widgetsArray[1].title+ widgetsArray[0].view);
    return channelsArray;
}
*/

function getPreferredWidgetsXML(){
  
	var mac = returnMACAddress();
	var url = window.GetWidgetListURL + "macaddress="+mac+"&projectkey="+getProjectKey() ;
	console.log(url);
    var wList;
                    $.ajax({
                            url: url,
                            dataType: 'xml',
                            success:function(result){wList = fillPreferredWidgetListXML(result);},
                            async: false
                        });
                    //console.log(wList);
                    console.log("in get preferred widget xml");
                    return wList;
} 

function fillPreferredWidgetListXML(preferredWidgetListXML){
    var widgetsArray = new Array();
    var globalValuesArray =  new Object();
    var i=0;
    console.log("In preferredWidgetListXML=" + platformObject.environment);
   
        $(preferredWidgetListXML).find("user").each(function() {
            var user = $(this);
                user.find("widgetList").each(function(){
                    $(this).find("widget").each(function(){
                        widgetsArray[i] = new Object();
                        var valuesAll = $(this).children();
                        for(var j=0;j<valuesAll.length;j++){
                    		var values = $(this).children()[j];
                    		var propertyName = values.nodeName;  
                    		// the WD will have to call a method to retrieve the preferenjsonpces - which will basically return the widget preferences object
                    		widgetsArray[i][propertyName] = $(this).find(propertyName).text();
                    	}
                        i++;
                      
                    })
                })
                user.find("globalvalues").each(function(){
                	
                	var gvaluesAll = $(this).children();
                	for(var j=0;j<gvaluesAll.length;j++){
                		var gvalues = $(this).children()[j];
                		var propertyName = gvalues.nodeName;  
                		// the WD will have to call a method to retrieve the preferences - which will basically return the widget preferences object
                		globalValuesArray[propertyName] = $(this).find(propertyName).text();
                	}
                })
    });  
 	//console.log("after XML Parse" + widgetsArray[0].title);
    console.log("in fill preferred widget xml");
    console.log("preferences - "+ widgetsArray[0]); //  widgetsArray[0].widgetPreferences[1] +"--"+ widgetsArray[0].widgetPreferences[0]);
    console.log("*** This is the current widget array ***")
    console.log(globalValuesArray);//.zipcode + globalPreferencesArray[0].email);
    platformObject.globalValues = globalValuesArray;
    return widgetsArray;
}

function setVal(key, value){
	var updates = new Array();
	updates[0] = new Object;
	updates[0].key = key;
	updates[0].value = value;
	setVals(updates);
}

function setVals(keyValuePairs){
    if(!($.isArray(keyValuePairs))){
    	alert("array required as a parameter");
    	return;
    }
	param0 = top.returnMACAddress();
	var queryString = "macaddress"+"="+param0+"&projectkey="+getProjectKey();
	for(var i=0;i<keyValuePairs.length; i++){
		queryString += "&"+keyValuePairs[i].key+"="+keyValuePairs[i].value;
		platformObject.globalValues[keyValuePairs[i].key] = keyValuePairs[i].value;
	}
	console.log(queryString);
	var url = window.UpdateGlobalValuesURL + queryString;
	
    console.log(url);
    //var url = window.UpdatePreferencesService+"macaddress="+param0+"&zipcode="+param1+"&email=mano@gatech" ;
                    $.ajax({
                            url: url,
                            dataType: 'xml',
                            success:function(result){console.log("complete");},
                            async: true
                        });
                    // return wList;

}



/**
@description returns the global preferences object  
@return returns the global preferences object
*/
function getVal(key, defaultReturnValue){

	if(platformObject.globalValues[key] != undefined)
		return platformObject.globalValues[key];
	else
		return defaultReturnValue;

}



