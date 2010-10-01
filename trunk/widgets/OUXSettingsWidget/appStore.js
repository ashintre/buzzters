var widgetList;
var currentIndex;

/*
 * the ajax call to get the store widgets
 * this calls the function fillAppStoreWidgetList on success
 */

function getStoreWidgets(){
    var url = getPath()+"appStore.xml";
	var wList='';
                    $.ajax({
                            url: url,
                            dataType: 'xml',
                            success:function(result){console.log("result of app store="+result); wList = fillAppStoreWidgetList(result);},
                            async: true
                        });
                     //console.log("appstore widgets = " +wList);
}

/*
 * It retrieves the XML file received from the server
 * This function strips of the App Store Widgets information and converts them into HTML
 * Each widget is inside a <div> element with the image and span text inside it
 */
function fillAppStoreWidgetList(storeListXML){

                       p = top.getPlatform();
                        attribs ="";
                       
						var widgetsArray = new Array();
                                                var i=1;

						$(storeListXML).find("widget").each(function() {
							var widget = $(this);
							var description = widget.find("description").text();
							var name = widget.find("name").text();
                                                        var view = widget.find("view").text();
                                                        var title = widget.find("title").text();
                                                        var icon = '../' + name + '/'+widget.find("icon").text();
                                                        
                                                        widgetsArray[i-1] = new Object();
                                                        widgetsArray[i-1].name = name;
                                                        widgetsArray[i-1].title = title;
                                                        widgetsArray[i-1].description = description;
                                                        widgetsArray[i-1].icon = icon;
                                                        widgetsArray[i-1].view = view;
                                                        widgetsArray[i-1].divId = "app_"+i+"_"+name;
                                                       // if the user has already subscribed to the widget, show it as installed in green color
                                                       // existsInWidgetList is a function in the Platform, that checks if a given widget exists in the Widget list of the user 
                                                        if(p.existsInWidgetList(widgetsArray[i-1])){
                                                            appStatusText = 'Installed';
                                                       }
                                                       else{
                                                           appStatusText = "";
                                                       }
                                                        attribs = attribs + "<div class='appItem navigationClass' id='app_"+i+"_"+name+"'><img class='appIcon' src='"+icon+"'/><span class='appTitle'>"+description+"</span><span class='appStatus' id='appstatus_"+i+"_"+name+"'>"+appStatusText+"</span></div>";
							//attribs = attribs + "<div id='app_"+i+"_"+name+"'><img src='"+icon+"'/><span style='vertical-align:middle'>"+description+"</span></div>";
							url = "url("+icon+")";
							//console.log("app store widgets="+attribs);
							
                                                        //$('#appStore').append(attribs); //.css('background-image',url);
                                                        i++;
						});
												$('#appStore').append(attribs);
                                                
                                                //console.log(attribs);
                                                widgetList = widgetsArray;
                                                callbackinit();
                                                //return widgetsArray;
}


/*
 *  * This adds the widget to the correct user ( based on MAC address) in the PLATFORM_UserWidgetList.xml
 * If its pulled on a browser then it adds to the first MAC address it finds
 * It needs the XML Servlet to work. If it is not there then, it fails silently 
 */

function addWidgetFromAppStore(i){
    var param = new Array();
    param[0] = new Object;
    param[0].key = "name";
    param[0].value = widgetList[i].name;
    param[1] = new Object;
    param[1].key = "title";
    param[1].value = widgetList[i].title;
    param[2] = new Object;
    param[2].key = "description";
    param[2].value = widgetList[i].description;
    param[3] = new Object;
    param[3].key = "icon";
    param[3].value = widgetList[i].icon;
    param[4] = new Object;
    param[4].key = "view";
    param[4].value = widgetList[i].view;
    param[5] = new Object;
    param[5].key = "selected";
    param[5].value = "true"; // has to be set here as AppStore doesnt have this property value
    
    addNewWidget(param);
    /*
    var url = "http://localhost:8080/moto/XMLUpdates?param0="+param0+"&param1="+param1+"&param2="+param2+"&param3="+param3+ "&param4="+param4+"&param5="+param5 ;

   // var url ="/Widget_Platform/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FTodGateway%3Fmethod%3DNOWPLAYING%26station-id"
                    $.ajax({
                            url: url,
                            dataType: 'xml',
                            success:function(result){console.log("complete");},
                            async: true
                        });
                    // return wList;
	*/
}

/*
 * This function is called when a widget is selected to be added to the store
 */

function appStorePanelKeyOK(){
           
			var p = top.getPlatform();
            activeId = getActiveElementId();
           // addWidgetFromAppStore("appStore", currentIndex);
            // 1. Load the iframe - add to widget container
            // 2. Update preferences list in the preferences tab
            // 3. add to the widgets array
            // 4. selected property is true 
           
            // i gives the index of the widget that has been selected by the user 
            // id's of the widgets in the app store are of the form -  "app_"+i+"_"+<widgetname>;
            // hence the charAt(4) will give the index and we convert it into integer using parseInt
            var i=parseInt(activeId.charAt(4));
            var len = widget.length;
           
            newWidget = new Array({name:widgetList[i-1].name, view:widgetList[i-1].view, title:widgetList[i-1].title, description:widgetList[i-1].description, selected:"true"});
            
            if(p.existsInWidgetList(newWidget[0])){
    			return true;
    		}
            top.addWidgetToContainer(newWidget[0]);
            
            // show the small green label that the app is installed
            $('#appstatus_'+(i)+"_"+widgetList[i-1].name).html("installed");
            
            platform.addWidget(newWidget[0]); // add to widget list 
            //platform.addToSelectedWidgetList(newWidget[0]); // add to selected widget list - new widget is auto selected
           
            // add it to the icheckbox list 
            createOptions(newWidget, 'preferencesList', len);
            addWidgetFromAppStore(i-1);
            return true;
}


