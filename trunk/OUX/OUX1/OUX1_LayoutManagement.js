var layouts;
var currentLayout;
var currentWidget;
var platform;

/**
    @description Initialize OUX Settings
*/
function startOUXLoad(){
	platform = getPlatform();
	console.log("got platform");
	console.log(platform);
      //loading the preferences widget here
	/*$('.widget_container').append("<div id='widget_" + "OUXSettingsWidget"
				+ "'><h3 class='widget_header ui-helper-reset ui-accordion-header ui-corner-top'><a href='#'>"
				+ "User Settings" + "</a></h3><div class='widget_frame'><iframe id='" + "OUXSettingsWidget" + "' src='../../widgets/"
				+ "OUXSettingsWidget" + "/" + "OUXSettingsWidget" + ".html' scrolling='no'></iframe></div></div>");
	*/
	
	var w = platform.getSelectedWidgetList();
	var divLastWidget = w[w.length-1].name;
	//alert(divLastWidget);
	$("<div id='widget_" + "OUXSettingsWidget"
			+ "'><h3 class='widget_header ui-helper-reset ui-accordion-header ui-corner-top'><a href='#'>"
			+ "CHIMP Settings" + "</a></h3><div class='widget_frame'></div></div>").insertAfter(('#widget_'+divLastWidget));
	var iFrame = document.createElement('IFRAME');
	iFrame.id = 'OUXSettingsWidget';
	iFrame.src = "../../widgets/" + "OUXSettingsWidget" + "/" + "OUXSettingsWidget" + ".html";
	iFrame.scrolling = 'no';
	$("#widget_"+ "OUXSettingsWidget" +'> .widget_frame').append(iFrame); 
	 
	 $(iFrame).load(function() 
			    {
		 			allWidgetsInit(this);
			        //iFrame.contentWindow.init_all(this);
			        //document.body.removeChild(iFrameObj);
			    });
	 $('#widget_OUXSettingsWidget').hide();
	currentWidget = 0;
	
	/*creating these variables for accessing layouts in this js file, else will need to do platform.layout everytime */
	layouts = platform.OUX.layouts.getLayoutList();
	console.log("L " + layouts);
	currentLayout = platform.OUX.layouts.getCurrentLayoutIndex(); // variable for maintaining the currentLayout
	console.log("CL" + currentLayout);
	//determineVideoSource();
        hideAllWidgets();
        var test = platform.getSelectedWidgetList();
        console.log("Selected WL");
        console.log(test);
        $("<div id='accordionMessage'></div>").insertAfter("#" + "widget_"+ platform.getSelectedWidgetList()[0].name);
        $('#accordionMessage').hide();
       

}
function hideAllWidgets(){
    var allWidgets = platform.getAllWidgetList();
    console.log("All Ws ");
    console.log(allWidgets);
    
    for(var i = 0; i < allWidgets.length; i++){
       var widget_div = "#widget_" + allWidgets[i].name;
       $(widget_div).hide();
    }
}

function addWidgetToContainer(newWidget){
	/*
   	/*$("<div id='widget_" + newWidget.name
				+ "'><h3 class='widget_header' class='widget_header' class='ui-helper-reset' class='ui-accordion-header' class='ui-corner-top'><a href='#'>"

				+ newWidget.title + "</a></h3><div class='widget_frame'><iframe id='" + newWidget.name + "' src='../../widgets/"
				+ newWidget.name + "/" + newWidget.name + ".html' scrolling='no'></iframe></div></div>").insertBefore("#widget_OUXSettingsWidget");
	*/
    $("<div id='widget_" + newWidget.name
			+ "'><h3 class='widget_header ui-helper-reset ui-accordion-header ui-corner-top'><a href='#'>"
			+ newWidget.title + "</a></h3><div class='widget_frame'></div></div>").insertBefore("#widget_OUXSettingsWidget");
    
    var iFrame = document.createElement('IFRAME');
	iFrame.id = newWidget.name;
	iFrame.src = "../../widgets/" + newWidget.name + "/" + newWidget.name + ".html";
	iFrame.scrolling = 'no';
	$("#widget_"+ newWidget.name +'> .widget_frame').append(iFrame); 
	 
	 $(iFrame).load(function() 
			    {
		 			allWidgetsInit(this);
			        //iFrame.contentWindow.init_all(this);
			        //document.body.removeChild(iFrameObj);
			    });
   	$('#widget_'+newWidget.name).hide();

   	
	/* Note : The css for the widget_widgetname div is set to display:none. This is to avoid the widget from 
	 * being rendered in the first place.
	 * TODO Another option to be considered is to have all widgets rendered, but to use the selected tag to determine
	 * which widget to hide/show. When a widget is to be added, we do a show instead of add. This is specific to the case
	 * of widget selection from a user's set of widgets when the total number of widgets on-screen will be small. 
	 
    $('#accordion').append("<div id='widget_" + newWidget.name
			+ "' style='display:none'><h3 class='widget_header' class='widget_header' class='ui-helper-reset' class='ui-accordion-header' class='ui-corner-top'><a href='#'>"
			+ newWidget.title + "</a></h3><div class='widget_frame'><iframe id='" + newWidget.name + "' src='../../widgets/"
			+ newWidget.name + "/" + newWidget.name + ".html' scrolling='no'></iframe></div></div>");
     $('#widget_'+newWidget.name).hide();*/
}

function removeUnselectedWidget(widgetName){
    	var widget_div = "#widget_" + widgetName;
        $(widget_div).remove();
}

/**
    @description Switch Widgets
	@param {integer} newWidget Index that Access the Widgets Array
*/
function switchWidget(newWidget){ 
	//var widgetList = OUXReturnSelectedWidgetList(platform.allWidgets.length);
        var widgetList = platform.getSelectedWidgetList();
        if(layouts[currentLayout] == 'BasicOneWidget'){ // Want to Show only One Widget at a time!
		// Loop through all the widgets and hide/show them
		for (var i=0; i < widgetList.length; i++){
			var widget_div = "#widget_" + widgetList[i].name;
			if(i == newWidget){
				$(widget_div).show();
				platform.setCurrentWidget(newWidget);
			}
			// Else
			else {
				$(widget_div).hide();
			}
		}
	}
	else {
		for (var i=0; i < widgetList.length; i++){
			var widget_div = "#widget_" + widgetList[i].name;
			$(widget_div).show();
		}
	}
}

/**
    @description Switch Layout
	@param {integer} newLayout Index that access the Layouts Array
*/
function switchLayout(newLayout){
	//console.log("switchLayout");
	// LAYOUT UPDATE!
        if(newLayout == -1){
                //console.log("noPlatform");
		document.getElementById('layout_container').className = 'noPlatform';
		changeSizeOfVideo("fullvideo");
        }
        else{
            var widgetList = platform.getSelectedWidgetList();
            // Set current layout to the new Layout if it wasn't done so already.
            currentLayout = newLayout;
            platform.OUX.layouts.setCurrentLayoutIndex(currentLayout); // setting the current layout of the object

            // LAYOUT UPDATE!
            if(layouts[currentLayout] == "BasicStatusBar"){ // BasicStatusBar View

                    // Update Widgets Container DIV Width assuming each widget has BasicStatusBar View
                    document.getElementById('layout_container').className = layouts[currentLayout];
                    // Update widget views to Icon for BasicStatusBar layout
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'icon';
                    }
                    $("#accordion").accordion("destroy");
                    // Update Widget DIVs, Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    //changeChannel(currentChannel);

                    $("#accordion").accordion("destroy");
                    changeSizeOfVideo('fullvideo');
            }
            else if(layouts[currentLayout] == "BasicOneWidget"){ // BasicOneWidget
                    document.getElementById('layout_container').className = layouts[currentLayout];
                    // Update widget views to Regular for Basic One Widget layout
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'regular';
                    }
                    // Update Widget DIVs, Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    //changeChannel(currentChannel);

                    $("#accordion").accordion("destroy");
                    changeSizeOfVideo('fullvideo');
            }
            else if(layouts[currentLayout] == "BasicAccordion"){ // BasicAccordion
                    document.getElementById('layout_container').className = layouts[currentLayout];
                    // Update widget views to Regular for Basic Accordion layout
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'regular';
                    }
                    // Update Widget DIVs, Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    //changeChannel(currentChannel);

                    /* to highlight selected widget header - added by Nadu -- start */
                    divActiveWidget = "#" + "widget_"+ widgetList[platform.getCurrentWidget()].name;
                    activeWidgetHeader = divActiveWidget + ' .widget_header';
                    //$(activeWidgetHeader).addClass("ui-state-hover");
                    /* to highlight selected widget header - added by Nadu -- end */

                    // Call Accordion
                    $('#accordion').accordion( {clearStyle: true,  header: "h3", active: false, collapsible: true,  animated: 'easeslide'} );
                    changeSizeOfVideo("minivideo");
            }
            else{
                    document.getElementById('layout_container').className = 'noPlatform';
            }

            // WIDGET VIEWS UPDATE!
            // Loop through all the widgets and update their Views!
            for (var i=0; i < widgetList.length; i++){
                    var iframeid = document.getElementById(widgetList[i].name);
                    iframeid.contentWindow.switchView(widgetList[i].view);
                    // added by nadu to draw outline around the current widget
                    if(i==platform.getCurrentWidget() && layouts[currentLayout] == "BasicStatusBar"){
                            addIconOutline();
                    }
            }
        }
}

// not getting called as of now
function OUXReturnSelectedWidgetList(length){
      
        var allW = platform.getAllWidgetList();
        var selectedTopW = []; // 3 is the max number of widgets an array can have
        var selectedTopWCount = 0;

        // loop through all widgets to get selected widget
        for(var i = 0; i < allW.length; i++){
            if(allW[i].selected == "true"){
                selectedTopW[selectedTopWCount] = allW[i];
                //console.log("selectedTopWidgets[selectedTopWidgetsCount] = " + selectedTopW[selectedTopWCount]);
                selectedTopWCount++;
            }
        }

        return selectedTopW;
}


function popPanel(imghandler){
imghandler = imghandler.replace("_t","");
//alert(imghandler);
preloader(imghandler);
$('body').append('<div id="overlay" style="width:1280px; height:720px; position:fixed; top:0px; left:0px; z-index:1000; background:url(blackbg.png); text-align:center"></div>');
//$('body').append('<div id="overlay-panel" style="margin:auto auto auto 100px;height:600px; width:700px; background:black; opacity:1.0"></div>');
$('#overlay').append('<div id="overlay-panel" style="margin:auto auto auto 100px;height:600px; width:700px; background:black; opacity:1.0"></div>');
$('#overlay-panel').append('<p style="color:white"><p>');
//alert(imghandler);
$('#overlay-panel').append('<img style="margin:50px auto auto auto;opacity:1.0" alt="no image" src="' + bigImage.src + '"/>');
//$('#theDiv').prepend('<img id="theImg" src="theImg.png" />')

}

bigImage = new Image();
function preloader(imagehandler){
	
	bigImage.src = imagehandler;
	for(var n=0; n<100; n++){
	}
}

function removePanel(){
	console.log("got called");
	//$('#overlay-panel').remove();
	$('#overlay').remove();
}
