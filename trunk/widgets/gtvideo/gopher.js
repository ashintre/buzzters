var panels = new Array(
	{id: 'settings', name: 'Settings'}
);

$(document).ready(function(){ 
	var tab_links = '<ul>';
	var li_link;
	for (var p in panels){
		li_link = '<li><a href="#panel_'+panels[p].id+'">'+panels[p].name+'</a></li>';
		tab_links = tab_links+li_link;
	}
	
	tab_links = tab_links+'</ul>';
	$('#tabs').append(tab_links);

	// Create Panels based on the panels array
	for (var p in panels) {
		// Create DIVS base on Number of Panels
		$('#tabs').append("<div id='panel_" + panels[p].id + "' class='main'></div>");
	}	
});


/**
    @description init is immediately called after document ready which provides default start values.
*/
function init(){
	// To Widget Developers, you can try to pass the 'regular' or 'small' view! For more questions, please email ruby or nadu
	//switchView('regular'); // Required function that must be implement by Widget Developer

	// NOTE! Should combine these two functions
	switchPanel('settings');
	setWidgetElementInFocus('panel_settings');
}

// Load Initial Javascripts
window.onload = init;

function getWidgetElementInFocus(){

        console.log('getWidgetElementInFocus' + activePanelId);
        return activePanelId;

}


function setWidgetElementInFocus(divId){

       $('#'+activePanelId).removeClass('ui-state-active');
       activePanelId = divId;
       $('#'+divId).addClass('ui-state-active'); 
       console.log('setWidgetElementInFocus' + activePanelId);

        //return document.activeElement.id;
}


function setOpeningWidgetView() {
	$('#tabs').tabs({selected: 0});
        setWidgetElementInFocus('panel_new');
        console.log('set opening widget view' +document.activeElement.id);
}

/**
    @description Create content for specific panel with given html
    @param {string} panelId Panel id where we want to append given html
	@param {string} html HTML code that makes up the content
*/
createPanelContent = function(panelId, html){
	$('#panel_' + panelId).append(html);
}

/**
    @description Switch to specific panel based on given id
    @param {string} panelId Panel id that the should be switched to
*/
switchPanel = function(panelId){
	$('#panel_container div').hide();
	$('#panel_'+panelId).show();	
	$('#panel_'+ panelId +' div').show();  
}

/**
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){
	console.log("switchView: " + newView);
	document.getElementById('view').className = newView;	
	if(newView == 'icon'){
		$('#tabs').tabs('disable'); // Remove jQuery Tabs
		$('.panel_container').hide(); // Hide everything inside panel_container		
	}
	else if(newView == 'regular'){
		$('#tabs').tabs(); // Use jQuery Tabs
		$('.panel_container').show(); // Show everything inside panel_container
	}
	else{ // ticker, small
		$('#tabs').tabs('disable'); // Remove jQuery Tabs
		$('.panel_container div').hide(); // Hide div inside panel_container
		$('.panel_container ul').hide(); // Hide ul inside panel_container
		$('#' + activePanelId).show(); // Show only the active panel
	}
}

/**
    @description wigetKeyLEFT is a callback function that maps to the LEFT Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyLEFT = function(){
    var selected = $( "#tabs" ).tabs( "option", "selected" );
    if(selected>0){
		
                    if(activePanelId.substring(0,5) == 'panel'){
                        $('#tabs').tabs({selected: selected-1});
                        divId = document.getElementById(activePanelId).previousSibling.id;
                        setWidgetElementInFocus(divId);
                        console.log('activeElement left= '+activePanelId);
                    }
    }
    else{
      $('#tabs').tabs({selected: selected});
    }

    return true;

}

/**
    @description wigetKeyRIGHT is a callback function that maps to the RIGHT Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyRIGHT = function(){ 
    var selected = $( "#tabs" ).tabs( "option", "selected" );
    numTabs = $("#tabs").tabs("length");

    if(selected < (numTabs-1)){

                    if(activePanelId.substring(0,5) == 'panel'){
                        $('#tabs').tabs({selected: selected+1});
                        divId = document.getElementById(activePanelId).nextSibling.id;
                        setWidgetElementInFocus(divId);
                        console.log('activeElement right= '+activePanelId);
                    }

    }
    else{
        $('#tabs').tabs({selected: selected});
    }
    return true;
}

/**
    @description wigetKeyOK is a callback function that maps to the OK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyOK = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyOK triggered");
	return false;
}

/**
    @description wigetKeyBACK is a callback function that maps to the BACK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyBACK = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyBACK triggered");
	return false;
}

/**
    @description wigetKeyUP is a callback function that maps to the DOWN Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyUP = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyUP triggered");
	return true;
}

/**
    @description wigetKeyDOWN is a callback function that maps to the DOWN Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyDOWN = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyDOWN triggered");
	return true;
}