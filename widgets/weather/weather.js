/*
 * panels array - this is the format of the array to be passed to the createTabs function of the Elements Library
 * Each tab has a panel associated with it. This panel is enclosed by a <div> with id specified in the array
 * The name/label of the tab is also specified here 
 */

var panels = new Array(
{id: 'panel_today', name: 'Today'},
{id: 'panel_forecast', name: 'Forecast'},
{id: 'panel_location', name: 'Location'}
);

var global_activeElementId = "tabs_li_0"; // first active element's id

var zipCode =  top.getVal('zipcode');

var created = 0;
var zipCodeEntry = "";

/**
@description implemented by the Widget Developer to return the class that will be associated with the active element. The widget developer can have if-else or switch-case statements for associating different classes with different elements
@return {string} the class string
*/
function getActiveClass(){
	if(getActiveElementId() == 'zipCode'){
		return "zipCode_active";
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
 * The Platform calls this function when it finds that there is a user registered function for an element and a key press. 
 * The corresponding function reference is sent as a parameter. 
 * This is an extra function written since I was unable to call the function reference from the iframe.
 * 
 */
function keyHandler(function_keyPress){
	return function_keyPress();
}

/**
    @description Create Weather's Today Panel
*/
function createToday(){
	if(created == 0)
	{
		var todayPanel =  "<p id='t_date' >5/20</p>"; // Date
		todayPanel = todayPanel + "<p id='t_city'>Atlanta, GA</p>"; // City
		todayPanel = todayPanel + "<p id='t_img'><img src='sun.png' width='30px' height='30px'></p>"; //icon
		todayPanel = todayPanel + "<p id='t_temp'>90</p>"; // Temp
		todayPanel = todayPanel + "<p id='t_desc'>Sunny</p>"; // Description 
		todayPanel = todayPanel + "<p id='t_navi'><< Location --- Forecast >></p>"; // Go to Forecast
		
		$('#panel_today').append(todayPanel);
		
		created = 1;     
	}
}

/**
    @description Update Weather's Today Panel
    @param {array} ar Information for update
*/
function updateToday(ar){
    
        if(ar != "Data Unavailable"){
            document.getElementById('t_img').innerHTML = "<img src="+ar.current_weather[0].icon+" />";//icon
            document.getElementById('t_date').innerHTML = ar.current_weather[0].time; // Date
            document.getElementById('t_city').innerHTML = ar.current_weather[0].city; // City
            document.getElementById('t_temp').innerHTML = ar.current_weather[0].temperature.substring(0,4);
            document.getElementById('t_desc').innerHTML = ar.current_weather[0].short_descr; // Description

            var bkImage = document.getElementById("background");
            $(bkImage).addClass("textClass");
            bkImage.innerHTML = document.getElementById('t_temp').innerHTML.substring(0,4);
            $(bkImage).append("<img src="+ar.current_weather[0].icon+" />");
        }
}

/**
    @description Create Weather's Forecast Panel
*/
function createForecast(){
    
    var forecastPanel = "<div id='f0' class='forecast navigationClass'>";
    forecastPanel = forecastPanel + "<div id='f0_date' class='date'><p>4/20</p></div>" // Date
    forecastPanel = forecastPanel + "<div id='f0_pic' class='pic'><img src='sun.png' width='30px' height='30px'></div>"; // Picture
    forecastPanel = forecastPanel + "<div id='f0_temp' class='temp'><p>High: 30</p><p>Low: 40</p></div>"; // High, Low, and Cond
    forecastPanel = forecastPanel + "</div>";

    forecastPanel = forecastPanel + "<div id='f1' class='forecast navigationClass'>";
    forecastPanel = forecastPanel + "<div id='f1_date' class='date'><p>4/20</p></div>" // Date
    forecastPanel = forecastPanel + "<div id='f1_pic' class='pic'><img src='sun.png' width='30px' height='30px'></div>"; // Picture
    forecastPanel = forecastPanel + "<div id='f1_temp' class='temp'><p>High: 30</p><p>Low: 40</p></div>"; // High, Low, and Cond
    forecastPanel = forecastPanel + "</div>";

    forecastPanel = forecastPanel + "<div id='f2' class='forecast navigationClass'>";
    forecastPanel = forecastPanel + "<div id='f2_date' class='date'><p>4/20</p></div>" // Date
    forecastPanel = forecastPanel + "<div id='f2_pic' class='pic'><img src='sun.png' width='30px' height='30px'></div>"; // Picture
    forecastPanel = forecastPanel + "<div id='f2_temp' class='temp'><p>High: 30</p><p>Low: 40</p></div>"; // High, Low, and Cond
    forecastPanel = forecastPanel + "</div>";

    forecastPanel = forecastPanel + "<div id='f3' class='forecast navigationClass'>";
    forecastPanel = forecastPanel + "<div id='f3_date' class='date'><p>4/20</p></div>" // Date
    forecastPanel = forecastPanel + "<div id='f3_pic' class='pic'><img src='sun.png' width='30px' height='30px'></div>"; // Picture
    forecastPanel = forecastPanel + "<div id='f3_temp' class='temp'><p>High: 30</p><p>Low: 40</p></div>"; // High, Low, and Cond
    forecastPanel = forecastPanel + "</div>";

    forecastPanel = forecastPanel + "<p id='f_navi'><< Today --- Location >></p>"; // Location

    $('#panel_forecast').append(forecastPanel);
}

/**
    @description Update Weather's Forecast Panel
    @param {array} ar Information for update
*/
function updateForecast(ar){
    for ( var i in ar.forecast )
    {
            var id_part = 'f' + i + '_';
            //console.log(id_part + ':' + i);
            document.getElementById(id_part+'date').innerHTML = "<p>" + ar.forecast[i].date + "</p>";
            document.getElementById(id_part+'pic').innerHTML = "<img src='" + ar.forecast[i].icon + "' width='30px' height='30px'>"
            document.getElementById(id_part+'temp').innerHTML = "<p>High: " + ar.forecast[i].high_temp + "</p><p>Low: " + ar.forecast[i].low_temp + "</p>"; // City
    }
}

/**
    @description Create Weather's Location Panel
*/
function createLocation(){
    var locationPanel = "<div id='locationdiv'><p id='l_city'>" + zipCode + "</p>"; // City
    locationPanel = locationPanel + "<p id='l_zip'>Update Zip Code:<br></p>"; // Zip

    $('#panel_location').append(locationPanel);

    var appendElementId = "panel_location";
    var max = 10;
    var size = 15;
    var cssClassString = "";
    var value = zipCode;
    var name ='Enter ZipCode:';
    var id = "zipCode";
    var textBox = new Array(
            {id: 'zipCode', value: zipCode, appendElementId:appendElementId, cssClassString:"", max:max, size:size});
    createTextBoxElement(textBox);
    
    var callbackFunction = updateLocation;
    var htmlStr = "<p>Change Location</p>";
    var buttonArray = new Array(
                {id: 'changeLocationSubmit', value: 'Change Location', html:htmlStr, appendTo:'panel_location', callback:callbackFunction, type:'button',
                        cssClassString:""});
    createButton(buttonArray);

    locationPanel = "<p id='l_navi'></p>"; // Go to today
    $('#panel_location').append(locationPanel);

    registerKeyPressCallback('zipCode', "KEY_OK", callbackFunction);
    registerKeyPressCallback('changeLocationSubmit', "KEY_OK", callbackFunction);
	
}

/**
    @description Update Weather's Location Panel
*/
function updateLocation(){

    zipCode = document.getElementById('zipCode').value;//Form1.zipCode.value;
    document.getElementById('l_city').innerHTML = zipCode;
    //console.log("entered"+zipCode);

    top.setVal('zipcode', zipCode);

    getCurrentWeather(updateToday, zipCode);
    getWeatherForecast(updateForecast, zipCode);

    switchToTab(1);

    //return true;
}

/**
    @description Update Weather's Preferences Panel
*/
function updatePreferences(){
    var auto = getVal('autoupdates');//Preferences(widgetID);
    console.log("value of autoupdates="+ auto);

    var updates = new Array();
    updates[0] = new Object;
    updates[0].key = 'version';
    updates[0].value = '2';
    updates[1] = new Object;
    updates[1].key = "abcd1";
    updates[1].value = "letters1";

    var updates2 = new Array();
    updates2[0] = new Object;
    updates2[0].key = 'color';
    updates2[0].value = 'pink';

    var updates3 = new Array();
    updates3[0] = new Object;
    updates3[0].key = 'address1';
    updates3[0].value = 'TSRB';

    // remove
    var removes = new Array();
    removes[0] = 'abcd';
    removes[1] = 'which_lab';
}

/**
    @description init is immediately called after document ready which provides default start values.
*/
function init(){

    getOUXTheme(); // Theme related function
    createTabs(panels);
    console.log('init of weather.js');
    createToday();
    getCurrentWeather(updateToday, zipCode);

    createForecast();
    getWeatherForecast(updateForecast, zipCode);
    createLocation("d");

    $("#"+getActiveElementId()).addClass(getActiveClass());

    updatePreferences();
}

/**
    @description Get weather information.
*/
function getWeather(){
    getCurrentWeather(updateToday, zipCode);
    getWeatherForecast(updateForecast, zipCode);
}

setInterval( "getWeather()", 900000 );

