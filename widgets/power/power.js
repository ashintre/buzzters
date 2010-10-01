//var widgetID = 'power';

var panels = new Array(
    {name: 'day', id: 'panel_day'},
    {name: 'week', id: 'panel_week'},
    {name: 'month', id: 'panel_month'}
);

var created = 0;
var currentActiveElementId = "panel_day";
var currentPanelIndex = 0;

function createDay(){
	if(created == 0)
	{
		var dayPanel = "<div id='f0' class='day'>";
		dayPanel = dayPanel + "<div id='f0_title' class='title'><p>Daily Power Usage</p></div>" // Date
		dayPanel = dayPanel + "<div id='f0_pic' class='pic'><img src='http://wai.cip.gatech.edu/Power/day.png' width='250px' height='90px'></div>"; // Picture
		// dayPanel = dayPanel + "<div id='f0_date' class='date'><p>June 3</p></div>" // Date
		dayPanel = dayPanel + "</div>";

		createPanelContent('day', dayPanel);	
		created = 1;     
	}
}

function updateDay(ar){
}

function createWeek(){
	
	var weekPanel = "<div id='f0' class='week'>";
	weekPanel = weekPanel + "<div id='f0_title' class='title'><p>Weekly Power Usage</p></div>" // Date
	weekPanel = weekPanel + "<div id='f0_pic' class='pic'><img src='http://wai.cip.gatech.edu/Power/week.png' width='250px' height='90px'></div>"; // Picture
	// weekPanel = weekPanel + "<div id='f0_date' class='date'><p>June 1 - June 7</p></div>" // Date
	weekPanel = weekPanel + "</div>";

	createPanelContent('week', weekPanel);	
}

function updateWeek(ar){
    
}

function createMonth(){
	var monthPanel = "<div id='f0' class='month'>";
	monthPanel = monthPanel + "<div id='f0_date' class='title'><p>Monthly Power Usage</p></div>" // Date
	monthPanel = monthPanel + "<div id='f0_pic' class='pic'><img src='http://wai.cip.gatech.edu/Power/month.png' width='250px' height='90px'></div>"; // Picture
	// monthPanel = monthPanel + "<div id='f0_date' class='date'><p>June</p></div>" // Date
	monthPanel = monthPanel + "</div>";

	createPanelContent('month', monthPanel);	
}

function updateMonth(){
}


function getKeyInfo(){
    var y = document.getElementById('key_container');
    if(y.style.display=="none"){
      y.style.display='block';
    }
    else{
        y.style.display="none";
    }
}


$(document).ready(function(){  // everything inside '$document.ready(){}' uses jQuery. See jQuery.com

	// Create tab <ul>links</ul>
	var tab_links = '<ul>';
	var li_link;
	for (var p in panels){
		li_link = '<li><a href="#panel_'+panels[p].name+'">'+panels[p].name+'</a></li>';
		tab_links = tab_links+li_link;
	}
	tab_links = tab_links+'</ul>';
	$('#tabs').append(tab_links);

	// Create Panels based on the panels array
	for (var p in panels) {
		// Create DIVS base on Number of Panels
		$('#tabs').append("<div id='panel_" + panels[p].name + "' class='main'></div>");
		// $('#panels_' +  panels[p].name).show();
	}
});


/**
    @description init is immediately called after document ready which provides default start values.
*/
function init(){

    getOUXTheme(); // Register Widget to receive theme updates

    createDay();
    console.log('init of power.js');
    createWeek();
    createMonth();

    // To Widget Developers, you can try to pass the 'regular' or 'small' view! For more questions, please email ruby or nadu
    switchView('regular'); // Required function that must be implement by Widget Developer

    // NOTE! Should comebine these two functions
    switchPanel('day');
    setWidgetElementInFocus('panel_day');
}

/**
    @description Get power information.
*/
function getPower(){
    
}

  setInterval( "getPower()", 900000 );

// Load Initial Javascripts
//window.onload = init;


function getWidgetElementInFocus(){

        console.log('getWidgetElementInFocus' + currentActiveElementId);
        return currentActiveElementId;

}


function setWidgetElementInFocus(divId){

       $('#'+currentActiveElementId).removeClass('ui-state-active');
       currentActiveElementId = divId;
       $('#'+divId).addClass('ui-state-active'); 
       console.log('setWidgetElementInFocus' + currentActiveElementId);

        //return document.currentActiveElement.id;
}


function setOpeningWidgetView() {
	$('#tabs').tabs({selected: 0});
        setWidgetElementInFocus('panel_today');
        console.log('set opening widget view' +document.currentActiveElement.id);
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
switchPanel = function(newPanelId){
    var currentView = document.getElementById('view').className;
    if(currentView != 'regular'){
	$('.panel_container div').show();
	for (var i=0; i < panels.length; i++){
            if(panels[i].id == newPanelId){
                $('#'+ panels[i].id).show();
                $('#'+ panels[i].id).removeClass('ui-tabs-hide');
            }
            else{
                $('#'+ panels[i].id).hide();
                $('#'+ panels[i].id).addClass('ui-tabs-hide');
            }
        }
	setWidgetElementInFocus(newPanelId);
    }
    else{
	$('.panel_container div').show();
    }
}
/**
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){

	// Set view to newView
	document.getElementById('view').className = newView;

	switch(newView){
		case "icon":
			switchViewIcon();
			break;
		case "regular":
			switchViewRegular();
			break;
		case "small":
			switchViewSmall();
		 	break;
		case "ticker":
			switchViewTicker();
			break;
		case "full":
			switchViewFull();
			break;
	}
}

function switchViewIcon(){
	//console.log("switchViewIcon");
	$('#tabs').tabs('disable'); // Remove jQuery Tabs
        $('#background').show(); // Show background w/ Icon Background
	$('.panel_container').hide(); // Hide everything inside panel_container

}

function switchViewRegular(){
	console.log("switchViewRegular");
	$('#tabs').tabs(); // Use jQuery Tabs
        $('#background').hide(); // Hide background w/ Icon Background
	$('.panel_container').show(); // Show everything inside panel_container
	$('.panel_container ul').show(); // Show everything inside panel_container
	switchPanel(panels[currentPanelIndex].id);
}

function switchViewTicker(){
	console.log("swtchViewTicker");
        $('#background').hide(); // Hide background w/ Icon Background
	$('#tabs').tabs('disable'); // Remove jQuery Tabs
	$('.panel_container ul').hide(); // Hide ul inside panel_container
	switchPanel(panels[currentPanelIndex].id);
}

function switchViewSmall(){
    $('#background').hide(); // Hide background w/ Icon Background
	console.log("switchViewSmall");
	$('#tabs').tabs('disable'); // Remove jQuery Tabs

	$('.panel_container ul').hide(); // Hide ul inside panel_container
	switchPanel(panels[currentPanelIndex].id);
}

/**
    @description wigetKeyLEFT is a callback function that maps to the LEFT Key on the remote controller.
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyLEFT = function(){
    var currentView = document.getElementById('view').className;
    if((currentView == 'ticker') || (currentView =='small')){
        currentPanelIndex = (currentPanelIndex + 1)%3;
        console.log("widgetKeyLeft" + panels[currentPanelIndex].id);
        switchPanel(panels[currentPanelIndex].id);
    }
    else{
        var selected = $( "#tabs" ).tabs( "option", "selected" );
        if(selected>0){

                        if(currentActiveElementId.substring(0,5) == 'panel'){

                            $('#tabs').tabs({selected: selected-1});
                            divId = document.getElementById(currentActiveElementId).previousSibling.id;
                            setWidgetElementInFocus(divId);
                            console.log('activeElement left= '+currentActiveElementId);
                        }
        }
        else{
          $('#tabs').tabs({selected: selected});
        }
    }
    return true;
}

/**
    @description wigetKeyRIGHT is a callback function that maps to the RIGHT Key on the remote controller.
	@description The function is called by the platform and should be implement by the widget developer.
*/

widgetKeyRIGHT = function(){
    console.log("weather widgetKeyRIGHT");
    var currentView = document.getElementById('view').className;
    if((currentView == 'ticker') || (currentView =='small')){
        currentPanelIndex = (currentPanelIndex + 1)%3;
        console.log("widgetKeyRight" + panels[currentPanelIndex].id);
        switchPanel(panels[currentPanelIndex].id);
    }
    else{
        var selected = $( "#tabs" ).tabs( "option", "selected" );
        numTabs = $("#tabs").tabs("length");

        if(selected < (numTabs-1)){

                        if(currentActiveElementId.substring(0,5) == 'panel'){
                            $('#tabs').tabs({selected: selected+1});
                            divId = document.getElementById(currentActiveElementId).nextSibling.id;
                            setWidgetElementInFocus(divId);
                            console.log('activeElement right= '+currentActiveElementId);
                        }

        }
        else{
            $('#tabs').tabs({selected: selected});
        }
    }

    return true;
}

/**
    @description wigetKeyOK is a callback function that maps to the OK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyOK = function(){

     if(currentActiveElementId.substring(0,5) == 'panel'){
         divId = document.getElementById(currentActiveElementId).firstChild.id;
      }

      setWidgetElementInFocus(divId);
      console.log('activeElement = OK'+currentActiveElementId);
      return true;

}

/**
    @description wigetKeyBACK is a callback function that maps to the BACK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyBACK = function(){

     if(document.getElementById(currentActiveElementId).parentNode.id.substring(0,5) == 'panel'){
          divId = document.getElementById(currentActiveElementId).parentNode.id;
          setWidgetElementInFocus(divId);
          return true;
     }
     else{
        // setWidgetElementInFocus('panel_today');
         console.log("i m exiting the widget context");
         return false;
     }

}

/**
    @description wigetKeyDOWN is a callback function that maps to the DOWN Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyDOWN = function(){
    return true;

}

/**
    @description wigetKeyNUMBER is a callback function that maps to the NUMBER Keys on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyNUMBER = function(num){
         // zipCodeEntry = zipCodeEntry + (num).toString();
         // console.log(zipCodeEntry);
         // $('#zipCode').val(zipCodeEntry);
         return true;
 }
