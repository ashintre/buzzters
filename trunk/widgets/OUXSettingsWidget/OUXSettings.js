/*
 * global variables used here
 * have to find a way so that there is no namespace clashing!
 */

var global_activeElementId = "tabs_li_0"; // first active element's id
var zipCodeEntry = "";
var widget; 

/*
 * Using the iCheckbox plugin, there seems to be a problem where the callback function is called even during the creation of the checkbox list
 * So this led to an error in this code as there was not enough information for the callback function to execute correctly. 
 * As a work around, I use these 2 variables to avoid the error.
 */
var global_checkboxoptioncount = 0;
var global_checkboxoptionlength = 0;

/*
 * panels array - this is the format of the array to be passed to the createTabs function of the Elements Library
 * Each tab has a panel associated with it. This panel is enclosed by a <div> with id specified in the array
 * The name/label of the tab is also specified here 
 */
var panels = new Array(
{id: 'appStore', name: 'App Store'},
{id: 'preferences', name: 'Preferences'},
{id: 'themes', name: 'Themes'}
);
var platform = getPlatform();

var currentZipCode = top.getVal('zipcode','30318');

/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	if(getActiveElementId() == 'zipCode'){
		return "ui-state-active zipCode_active";
	}
	return "ui-state-hover";
}
/**
@description implemented by the Widget Developer to return the id of the element that currently has focus.  
@return {string} the id of the element in focus
*/

function getActiveElementId(){
	return global_activeElementId;
}

/**
@description implemented by the Widget Developer to set the id of the element that currently has focus.  
@param {string} _activeElementId the id of the element in focus
*/

function setActiveElementId(_activeElementId){
	global_activeElementId = _activeElementId;
}
/*
 * This function is injected by the platform. This function is called by the platform with the function reference as parameter
 * The Platform calls this function when it finds that there is a user registered function for an element and a key press. 
 * The corresponding function reference is sent as a parameter. 
 * This is an extra function written since I was unable to call the function reference from the iframe.
 * 
 */

function keyHandler(function_keyPress){
	return function_keyPress();
}

/*
 * the widget developer informs the platform
 * id -keypress- callback function
 * the platform maintains a table widget - id - key - callback_function
 * if this exists in the table and is implemented by the widget then its called
 * else the default functionality is called 
 */ 



switchView = function(newView){
    //console.log("switchView: " + newView);
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
        $('#' + activeElementId).show(); // Show only the active panel
    }
}


/*
 * creating the preferences panel
 */
function createPreferencesPanel(){
        
	  var preferencesPanel = "<div id='preferencesdiv_1'><p id='title'> <b>" + "Edit Preferences for KableTown" + "</b></p></div>"; // City
      preferencesPanel = preferencesPanel + "<div id='widgetsSelected'>Select Widgets to be shown</div>";  
      preferencesPanel = preferencesPanel + "<div id = 'preferencesList'></div>"
      preferencesPanel = preferencesPanel + "<br/><p><b>Zip Code:</b> "+currentZipCode+"</p>";
      
      $('#preferences').append(preferencesPanel);
      
      widget = platform.getAllWidgetList();
      createOptions(widget, 'preferencesList', 0);
        //console.log("widgetString="+widgetString)
        
        var appendElementId = "preferences";
        var max = 10;
		var size = 15;
		var cssClassString = "panelPreferencesText";
		var value = currentZipCode;
		var name ='Update Zip Code:';
		var id = "zipCode";
		var textBox = new Array(
		            {id: 'zipCode', value: currentZipCode, appendElementId:appendElementId, cssClassString:cssClassString, max:max, size:size});
		createTextBoxElement(textBox);
		
        preferencesPanel = "<div id='preferencesdiv_4'><input type='button' id='changeZipcodeSubmit' value='Submit' class='navigationClass'></div>";
        $('#preferences').append(preferencesPanel);
        //$(widgetString).insertAfter('#widgetsSelected');
}
/*
 * this function is for creating the checkbox list 
 * the extra parameter count is a hack so that when a new widget is added, it gets added in the right location of the panel
 * the global variables - used to help avoid the weird iCheckbox error
 */

function createOptions(w, appendTo, count){
	var checkboxdata = new Array();
	var preferencesChangedRef = preferencesChanged;
	
	for(i=0;i<w.length;i++){
	      //widgetString = widgetString + "<div id='"+"widget_"+i+"_"+widget[i].name+"'><input type='checkbox' id='check_"+i+"_"+widget[i].name+"' value='Submit' >&nbsp;&nbsp;&nbsp;" +widget[i].title+"</div>";
	  	tmp_html = "<span id='"+"widget_"+i+"_"+w[i].name+"'>&nbsp;&nbsp;&nbsp;" +w[i].title+"</span>";
	  	tmp_id = "check_"+(i+count)+"_"+w[i].name;
	  	tmp_appendTo = appendTo;
	  	tmp_callback = preferencesChangedRef;
	  	if(w[i].selected == "true"){
	  		tmp_selected = "on";
	  	}
	  	else{
	  		tmp_selected = "off";
	  	}
	  	var tmp = new Array({id:tmp_id, selected:tmp_selected, html:tmp_html, appendTo:tmp_appendTo, callback:tmp_callback});
	  	checkboxdata[i] =  tmp[0];
	  }

	  createSlidingCheckboxes(checkboxdata);
	  global_checkboxoptionlength = checkboxdata.length;
	  global_checkboxoptioncount = 0;
}

/*
 * the callback function when the checkbox option is changed
 * When the widget is deselected - the widget iframe is removed 
 * When the widget is reselected - the widget iframe is added
 */

function preferencesChanged(e){
	
	var activeId = getActiveElementId();
	var count = 0;//console.log(e);
	
	var c = $(e.target)[0];
	console.log(c.id.charAt(6));
	var updateVal = new Array();
	updateVal[0] = new Object();
	updateVal[0].key = 'selected';
	
	global_checkboxoptioncount++;
	if(global_checkboxoptioncount <= global_checkboxoptionlength){
		console.log("returning"+ c.id.charAt(6));
		return;
	}
	if($(e.target).attr('checked')){
		widget[parseInt(c.id.charAt(6))].selected = "true";
	        // add widget to container
	    top.addWidgetToContainer(widget[parseInt(c.id.charAt(6))]);
	    updateVal[0].value = 'true';
	    updateWidgetValues(widget[parseInt(c.id.charAt(6))].name, updateVal);
	}
	else{
		console.log(c.id.charAt(6));
		console.log(c.id);
		console.log(widget[parseInt(c.id.charAt(6))].name);
		 widget[parseInt(c.id.charAt(6))].selected = "false";
         // remove widget from widget container
         top.removeUnselectedWidget(widget[parseInt(c.id.charAt(6))].name);
         updateVal[0].value = 'false';
         updateWidgetValues(widget[parseInt(c.id.charAt(6))].name, updateVal);
	}
	
}


/*
 * creating the themes panel
 */
function createThemesPanel(){
        var  themesPanel = "<div id='themesdiv_noSelect'><p id='title'>" + "Select Theme" + "</p></div>"; 
        themesPanel = themesPanel + "<div  class ='navigationClass' id='themesdiv_1'><p><input type='radio' id='ui-darkness' name='theme'>Theme 1: Darkness</p></div>";
        themesPanel = themesPanel + "<div  class ='navigationClass' id='themesdiv_2'><p><input type='radio' id='ui-lefrog' name='theme'>Theme 2: Le Frog</p></div>";
        themesPanel = themesPanel + "<div  class ='navigationClass' id='themesdiv_3'><p><input type='radio' id='ui-sunny' name='theme'>Theme 3: Sunny</p></div>";
        
        $('#themes').append(themesPanel);

}


function goToApplyTheme(){
    for (var i=0; i < document.selectTheme.theme.length; i++)
       {
       if (document.selectTheme.theme[i].checked)
          {
            top.updateTheme(document.selectTheme.theme[i].value);
          }
       }
}

/*
 * on the load of the Settings widget, it executes an ajax call to get the widgets in the store
 */

//window.onload = getStoreWidgets();


function init(){
	
	getStoreWidgets();
}
function callbackinit(){
	
    getOUXTheme(); // Register Widget to receive theme updates

    currentIndex = 0;   
    createPreferencesPanel();
    createThemesPanel();
   
    $("#"+getActiveElementId()).addClass(getActiveClass());
    //$('input[name= check_'+widget[2].name+']').is(':checked');
}


$(document).ready(function(){  // everything inside '$document.ready(){}' uses jQuery. See jQuery.com
    createTabs(panels);
   // widgetList = getStoreWidgets();

});

/*
 * The only key press function implemented by the widget developer,
 * rest of the navigation is taken care by the Platform
 */

widgetKeyOK = function(){
     activeId = getActiveElementId();
     
     if(activeId == "changeZipcodeSubmit"){
        if(zipCodeEntry){
            currentZipCode = zipCodeEntry;
        }
        console.log(currentZipCode);
        updatePreferences();
        zipCodeEntry = "";
        return true;
     }
     if(activeId.substring(0,4) == 'app_'){
         return appStorePanelKeyOK();
     }

     if(activeId.substring(0,5) == 'theme'){
        switch(activeId){
            case "themesdiv_1":
                $('#ui-darkness').attr('checked',true);
                $('#ui-lefrog').attr('checked',false);
                $('#ui-sunny').attr('checked',false);
                top.updateTheme("ui-darkness");
                break;
            case "themesdiv_2":
                $('#ui-darkness').attr('checked',false);
                $('#ui-lefrog').attr('checked',true);
                $('#ui-sunny').attr('checked',false);
                top.updateTheme("ui-lefrog");
                break;
            case "themesdiv_3":
                $('#ui-darkness').attr('checked',false);
                $('#ui-lefrog').attr('checked',false);
                $('#ui-sunny').attr('checked',true);
                top.updateTheme("ui-sunny");
            break;
        }
     }
     
    console.log('activeElement = OK'+activeId);
    return true;

}


 function updatePreferences(){
     //document.getElementById('zipCode').innerHTML = currentZipCode ;
     $('#zipCode').html(currentZipCode);
     //$('#currentZipCodeField').html(currentZipCode);
     console.log("update preferences" );
     //TODO to update server side XML after this has been changed!
     
}