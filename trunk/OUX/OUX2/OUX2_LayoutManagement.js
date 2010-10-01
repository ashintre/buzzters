var layouts;
var currentLayout;
var currentWidget;
var platform;

/**
    @description Initialize OUX Settings
*/
function startOUXLoad(){

	console.log("in start oux load");
	platform = getPlatform();

	/*creating these variables for accessing layouts in this js file, else will need to do platform.layout everytime */
	layouts = platform.OUX.layouts.getLayoutList();
	currentLayout = platform.OUX.layouts.getCurrentLayoutIndex(); // variable for maintaining the currentLayout

        // get list of selected widgets
        var widgetList = platform.getSelectedWidgetList(3);
        
	//determineVideoSource();
        hideAllWidgets();
        
        console.log("WidgetList size " + widgetList.length);
}

function hideAllWidgets(){
    // get list of selected widgets
    var allWidgetList = platform.getAllWidgetList();
    for(var i = 0; i < allWidgetList.length; i++){
       var widget_div = "#widget_" + allWidgetList[i].name;
       $(widget_div).hide();
    }
}

/**
    @description Switch Widgets
    @param {integer} newWidget Index that Access the Widgets Array
*/
function switchWidget(newWidget){
        hideAllWidgets(); // Do this to hide all widgets
        console.log(newWidget);
        // get list of selected widgets
        var widgetList = platform.getSelectedWidgetList(3);
	if((layouts[currentLayout] == 'SingleSmall') 
		|| (layouts[currentLayout] == 'SingleTicker')){ // Want to Show only One Widget at a time!
		// Loop through all the widgets and hide/show them
		for (var i=0; i < widgetList.length; i++){
			var widget_div = "#widget_" + widgetList[i].name;
			if(i == newWidget){
				$(widget_div).show();
				platform.setCurrentWidget(newWidget);
                                $(widget_div + " .widget_header").addClass("ui-state-active");
                                $(widget_div + " .widget_header").removeClass("ui-state-default");
			}
			// Else
			else {
				$(widget_div).hide();
                                $(widget_div + " .widget_header").addClass("ui-state-default");
                                $(widget_div + " .widget_header").removeClass("ui-state-active");
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
        // get list of selected widgets
        var widgetList = platform.getSelectedWidgetList(3);
	console.log("switchLayout");
	// LAYOUT UPDATE!
        if(newLayout == -1){
                console.log("noLayout");
		document.getElementById('layout_container').className = 'noLayout';
		changeSizeOfVideo('fullvideo');
        }
        else{
            // Set current layout to the new Layout if it wasn't done so already.
            currentLayout = newLayout;
            platform.OUX.layouts.setCurrentLayoutIndex(currentLayout); // setting the current layout of the object


            if(layouts[currentLayout] == "SingleSmall"){ // Single Small Layout

                    // Change class of 'layout_container' to SingleSmall
                    document.getElementById('layout_container').className = layouts[currentLayout];

                    // Update widget views to Small
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'small';
                    }

                    // Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    widgetInitialized();
                    changeSizeOfVideo('fullvideo');
            }
            else if(layouts[currentLayout] == "SingleTicker"){ // Single Ticker Layout

                    // Change class of 'layout_container' to SingleTicker
                    document.getElementById('layout_container').className = layouts[currentLayout];

                    // Update widget views to Ticker
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'ticker';
                    }

                    //Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    widgetInitialized();
                    changeSizeOfVideo('fullvideo');
            }
            else if(layouts[currentLayout] == "ThreeSmall"){ // Three Small Layout

                    // Change class of 'layout_container' to ThreeSmall
                    document.getElementById('layout_container').className = layouts[currentLayout];

                    // Update widget views to Small
                    for (var i=0; i < widgetList.length; i++){
                            widgetList[i].view = 'small';
                    }

                    //Loop through all the widgets and hide/show them
                    switchWidget(platform.getCurrentWidget());
                    widgetInitialized();
                    changeSizeOfVideo('minivideo');
            }
            else{
                    document.getElementById('layout_container').className = 'noLayout';

                    changeSizeOfVideo('fullvideo');
            }

            // WIDGET VIEWS UPDATE!
            // Loop through all the widgets and update their Views!
            for (var i=0; i < widgetList.length; i++){
                    //console.log(widgetList[i].name);
                    var iframeid = document.getElementById(widgetList[i].name);
                    iframeid.contentWindow.switchView(widgetList[i].view);
            }
        }
}