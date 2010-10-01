//for the days the days represent the days of the week with 0 = Sunday, 1 = Monday ... 6 = Saturday
var courses = new Array (
		{ name: "CS1332", days: [2, 4], start: [19,56], end: [11,55], 
			building_name: "College of Computing", latitude: 33.77741, longitude: -84.397376 },
		{ name: "CS1050", days: [2, 4], start: [16,50], end: [13,55], 
			building_name: "Klaus", latitude: 33.777035, longitude: -84.393911 },
		{ name: "PHYS2211", days: [1, 3, 5], start: [18,05], end: [11,55], 
			building_name: "Howey", latitude: 33.777432, longitude: -84.3981 },
		{ name: "PHYS2211 Lab", days: [5], start: [18,58], end: [18,55],
			building_name: "Howey", latitude: 33.777432, longitude: -84.3981 }
//		{ name: "BIO1520", days: [1, 3, 5], start: [16, 05], end: [19, 35],
//			building_name: "delta_up", latitude: 33.776900049537794, longitude:-84.39257383346558 
//		}
);


var routes_names = new Array ("All Walk", "Red", "Blue", "Trolley");
var temp;
var leaving = false;
var ptag_names = ["walk", "red", "blue", "trolley"];

//Cooked data: (Walking speed @ 5Kph
//Bus Stop near Cherry Emerson
//Walking all way: 14 Minutes
//Blue (North to CoC (BusStop near Cherry)): 8, plus walking: 13
//Red  (North to CoC (BusStop near Cherry)): 17, plus walking: 22 


//Bus Stop: Klaus
//Walking: 12 min
//Blue (North to Klaus (Klaus)): plus walking: 11
//Red (North to Klaus (Klaus)): plus walking: 21

//North Ave Apartments
var startLat = 33.77138;
var startLong = -84.39108;
//startLat = 	33.77672169131819;
//startLong = -84.39692974090576;
var pathinfo = [];
var waitTime = "";
/**
 * Updates the p tags with the updates information for the classes.
 */
function updateClasses() {
	
	var next = nextClass(courses);
	if (next != null) {
		document.getElementById("n_class").innerHTML = next.name + " class time is at " + addZero(next.start[0]) + ":" + addZero(next.start[1]) + " in " + next.building_name + ".";
	} else {
		document.getElementById("n_class").innerHTML = "You have no more classes today, so continue to be lazy";
	}
}


function addZero(num) {
	return (num < 10) ? "0" + num : "" + num;
}

/**
 * Updates the HTML fields for the Bus/Walk paragraphs
 * @param {Array[]} paths A list of tuples that contain path information. Index 0 of the tuple: Path Name; Index 1: Travel+WaitTime 
 */
function updateStatus(paths) {
	if (typeof(paths) == typeof("")) {
		if (paths != "error") {
			document.getElementById("n_class").innerHTML = "No more classes today, continue to be lazy";
			document.getElementById("ticker_text").innerHTML = "You have no more classes today, so continue to be lazy";
			document.getElementById("icon_text").innerHTML = "Don't worry b happy";
			
			//Change the background black + text white;
			$("#iView").each(function() {
				$(this).css("background", "#000000");
				$(this).css("#FFFFFF");
			});
		}
	} else {
		if (paths.length == 0) {
			leaving = true;
			document.getElementById("leave_status").innerHTML = "You are going to late, get up and leave if you want to pass this class";
			document.getElementById("ticker_text").innerHTML = "You are going to late, get up and leave if you want to pass this class";
			document.getElementById("icon_text").innerHTML = "You are late";
			$("#leave_status").show();
			$("#iView").each(function() {
				$(this).css("background", "#000000");
				$(this).css("#FFFFFF");
			});
			
		} else {
			var min_time = paths[0];
			for (var i = 0; i < paths.length; i++) {
				$(".leaving_status").hide();
				leaving = false;
				var temp = "Take the " + readColor(paths[i][0]) + " to go to class, ETA time is: " + paths[i][1] + " minutes";
				var nClass = nextClass(courses);
				var nTime = new Date();
				
				var stemp = "Leave @ " + etaTime(-1 * paths[i][1], nTime).getHours() + ":" + etaTime(-1 * paths[i][1], nTime).getMinutes();
				nTime.setHours(nClass.start[0], nClass.start[1]);
				document.getElementById("trolley_eta").innerHTML = nTime;
				
				if (readColor(paths[i][0]) == "All Walk") {
					document.getElementById("walk_status").innerHTML = temp;
					document.getElementById("walk_eta").innerHTML = stemp;
				}
				if (readColor(paths[i][0]) == "Red") {
					document.getElementById("red_status").innerHTML = temp;
					document.getElementById("red_eta").innerHTML = stemp;
				}
				if (readColor(paths[i][0]) == "Blue") {
					document.getElementById("blue_status").innerHTML = temp;
					document.getElementById("blue_eta").innerHTML = stemp;
				}
				if (readColor(paths[i][0]) == "Trolley") {
					document.getElementById("trolley_status").innerHTML = temp;
					document.getElementById("trolley_eta").innerHTML = stemp;
				}
				
				min_time = (min_time[1] > paths[i][1]) ? paths[i] : min_time;
			}

			document.getElementById("icon_text").innerHTML = "Leave @ " + etaTime(-1 * min_time[1], nTime).getHours() + ":" + etaTime(-1 * min_time[1], nTime).getMinutes();
			//Changes the background color for icon to the min_time + if it is yellow background then change text color to white
			$("#iView").each(function() {
				$(this).css("background-color", min_time[0]);
				$(this).css("color", (min_time[0] == "#FFFF00" || min_time[0] == "#00FF00") ? "black" : "white");
			});
			document.getElementById("ticker_text").innerHTML = document.getElementById("n_class").innerHTML + " " + document.getElementById("leave_status").innerHTML;
		}
	}
}


function init() {
	updateClasses();
	checkClasses(updateStatus);
	switchView('icon');
}

function update() {
	checkClasses(updateStatus);
}

setInterval("update()", 30000); //Updates every ten minutes
setInterval("updateClasses()", 60000); //Updates every five minutes
//setInterval("leaveNow()", 60000); 

//window.onload = init;


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
	$("div[id*=View]").hide();
	$('#iView').show();
}

function switchViewRegular() {
	$("div[id*=View]").hide();
	$('#rView').show();
	if (leaving) 
		$('#leave_status').hide();
	else
		$('#leave_status').show();
	
}

function switchViewTicker() {
	document.getElementById("ticker_text").innerHTML = document.getElementById("n_class").innerHTML + " " + document.getElementById("leave_status").innerHTML;
	$("div[id*=View]").hide();
	$('#tView').show();
}

function switchViewSmall(){
	$("div[id*=View]").hide();
	$('#sView').show();
}

//// this allow u to test the views by hitting 'z'
//
//KEY_SET = {"OK" : 71, "UP" : 38, "DOWN" : 40, "LEFT" : 37, "RIGHT" : 39, "BACK" : 86, "MENU" : 67,
//		"ZERO":48, "ONE":49, "TWO":50, "THREE":51, "FOUR":52, "FIVE":53, "SIX":54, "SEVEN":55,
//		"EIGHT":56, "NINE":57, "SWITCH" : 90};
//
//
// var key = {"SWITCH" : 90 };
// var currentViewIndex = 0;
// var views = new Array("icon", "regular", "ticker", "small");
//
// document.onkeydown = KeyCheck;
//
// function KeyCheck(e){
//     var KeyID = (window.event) ? event.keyCode : e.keyCode;
//     switch(KeyID){
//
//		case KEY_SET.OK:
//                 return widgetKeyOK();
//                 break;
//
//		case KEY_SET.RIGHT:
//                 return true;
//                 break;
//
//		case KEY_SET.LEFT:
//                 return true;
//                 break;
//
//		case KEY_SET.UP:
//                 return true;
//                 break;
//
//		case KEY_SET.DOWN: //
//                 return true;
//                 break;
//
//		case KEY_SET.MENU:
//                 return true;
//                 break;
//
//		case KEY_SET.BACK: // Back
//                 return false;
//                 break;
//
//             case KEY_SET.ZERO:
//
//             case KEY_SET.ONE:
//
//             case KEY_SET.TWO:
//
//             case KEY_SET.THREE:
//
//             case KEY_SET.FOUR:
//
//             case KEY_SET.FIVE:
//
//             case KEY_SET.SIX:
//
//             case KEY_SET.SEVEN:
//
//             case KEY_SET.EIGHT:
//
//             case KEY_SET.NINE:
//
//                 return widgetKeyNUMBER(KeyID-48);
//                 break;
//
//         case key.SWITCH:
//             currentViewIndex = (currentViewIndex + 1)%4;
//             switchView(views[currentViewIndex]);
//             break;
//         default:
//
//        	 //console.log("We dont support this these keys");
//
//     }
// }
// 
widgetKeyOK = function(){
	update();
	waitTime = "";
	$("#waitValue").val("");
	return true;
}

widgetKeyBACK = function(){
    return false;
}

widgetKeyNUMBER = function(num) {
	if (document.getElementById('view').className == "regular") {
		waitTime += num;
		$("#waitValue").val(waitTime);
		return true;
	}
}


/**
 * Checks to see if the current class is in session today
 * @param {dictionary} dict A value from courses array
 * @return {int} 1 if the class is in session today and 0 if not
 */
function isToday(dict) {
	var current = new Date();
	for (var i = 0; i < dict.days.length; i++) {
		if (current.getDay() == dict.days[i]) {
			return 1;
		}
	}
	return -1;
} 

/**
 * Checks to see if the time given is before the current time
 * @param {array} An array of integers, first index is hours and second index is minutes
 * @return {int} 1 if the time is larger than the current time
 */
function isBefore(time) {
	var current = new Date();
	var tempDate = new Date();
	tempDate.setHours(time[0], time[1]);
	
	if (tempDate > current) {
		return 1;
	} else {
		return 0;
	}
}

/**
 * Compares the two times that is given
 * @param min_time {array} An array of integers, first index is hours and second index is minutes
 * @param c_time {array} An array of integers, first index is hours and second index is minutes
 * @return 1 if minTime is larger than c_time and 0 if c_time is larger than min_time
 */
function compareTimes(min_time, c_time) {
	var minTime = new Date();
	minTime.setHours(min_time[0], min_time[1]);
	
	var cTime = new Date();
	cTime.setHours(c_time[0], c_time[1]);
	
	return (minTime > cTime) ? 1 : 0;
}

/**
 * Checks if the for all the classes today that have not yet occured.
 * @param {array} courses An array of dictionaries that contain the course information
 * @return {array} An array of dictionaries that contain course information that have not yet occured today
 */
function checkTimes(courses) {
	var classes = [];
	for (var i = 0; i < courses.length; i++) {
		if (isToday(courses[i]) == 1 && isBefore(courses[i].start) == 1) {
			classes.push(courses[i]);
		}
	}
	return classes;
}


/**
 * If time to travel is greater than 60 minutes
 * @param minutes
 * @return
 */
function etaTime(minutes, ntime) {
	if (ntime == undefined) {
		var etaTime = new Date();
	} else {
		var etaTime = ntime;
	}
	if ((etaTime.getMinutes() + minutes) > 60) {
		etaTime.setHours(etaTime.getHours() + 1, (etaTime.getMinutes() + Math.round(minutes)) - 60);
	} else if ((etaTime.getMinutes() + minutes) < 0) {
		etaTime.setHours(etaTime.getHours() - 1, 60 + (etaTime.getMinutes() + Math.round(minutes)));
	} else {
		etaTime.setMinutes(etaTime.getMinutes() + Math.round(minutes));
	}
	return etaTime;
}

/**
 * 
 * @param {array} time An array of integers, first index is hours and second index is minutes
 * @param {Number} minutes The wait/travel time in order to go to a location.
 * @return 1 if the user can arrive in time for their class
 * makeItInTime
 */
function makeItInTime(time, minutes) {
	var current = etaTime(minutes);
	
	var tempDate = new Date();
	//Changing the classTime date
	tempDate.setHours(time[0], time[1]);

	//Means tempDate is larger (in hours and minutes) compared to the current time
	//This means that the user could arrive in time for the class
	return (tempDate > current) ? 1 : 0;
}

/**
 * Gets the next possible class
 * @param {array} courses An array of dictionaries that contain the course information
 * @return {dictionary} The dictionary containing the information for the next possible class
 */
function nextClass(courses) {
	var classesToday = checkTimes(courses);
	var nextClass = classesToday[0];
	for (var i = 1; i < classesToday.length; i++) {
		nextClass = (compareTimes(nextClass.start, classesToday[i].start) == 1) ? classesToday[i] : nextClass;
	}
	return nextClass;
}


function encodeLatLong(lat, lon) {
	return lat + "," + lon;
}

function getAJAX() {
	var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
	if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
		for (var i=0; i<activexmodes.length; i++) {
			try {
				return new ActiveXObject(activexmodes[i]);
			}
			catch(e) {
			}
		}
	}
	else if (window.XMLHttpRequest) { // if Mozilla, Safari etc
		return new XMLHttpRequest();
	}
	else
		return false;
}


function checkClasses(handler) {
	if (handler == null)
		handler = updateStatus;
	var next = nextClass(courses);
	if (next == null)
		return handler("You have no more classes today, so continue to be lazy");
	var req = getAJAX();
	var pathInfo;
	var waitTemp = (waitTime == "") ? 0 : waitTime;
	var url = "/TestServlet/PathServlet?" + 
		"start=" + encodeLatLong(startLat, startLong) + 
		"&end=" + encodeLatLong(next.latitude, next.longitude) +
		"&speed=5&wait=" + waitTemp;
	
	req.open("GET", url, true);
	req.send(null);
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			if (req.status == 200) {
				var data = req.responseXML;
				var pathslength = data.getElementsByTagName("paths").length;
				var walkTime = 0;
				var paths = [];

				for (var i = 0; i < pathslength; i++) {
					var path = data.getElementsByTagName("paths")[i].childNodes[0].nodeValue;
					var parts = path.split(":");
					var time = parts[1] - 0;
					var color = parts[0];

					//Do not add walkTimes to and from BusStops to the paths list, sum them up 
					if (color == "#336600") {
						walkTime += time;
					} else {
						if (time != 0)
							paths.push([color, time]);
					}
				}

				pathinfo = [];
				
				//Add the walkTimes to the BusPaths
				for (path in paths) {
					if (paths[path][0] != "#00FF00") {
						console.log(readColor(paths[path][0]) + " and still make it in time for your class, ETA time is: " + Math.round(paths[path][1] + walkTime));
						if (makeItInTime(next.start, (paths[path][1] + walkTime)) == 1) {
							pathinfo.push([paths[path][0], Math.round(paths[path][1] + walkTime)]);
							console.log("You can take the " + readColor(paths[path][0]) + " and still make it in time for your class, ETA time is: " + Math.round(paths[path][1] + walkTime) + " minutes");
						}
					} else {
						if (makeItInTime(next.start, paths[path][1]) == 1) {
							pathinfo.push([paths[path][0], Math.round(paths[path][1])]);
							console.log("You can walk the whole way and make it in time, ETA time is " + Math.round(paths[path][1]) + " minutes");
						}
					}
				}
				updateStatus(pathinfo);
				leaveNow(pathinfo);
				return;
			}
		}
		handler("error");
	};
}



/**
 * Checks the nextClass and sees if there is less than five minutes left so that the user should leave within five or so minutes to make it on time to his/her class 
 * 
 * @return
 */
function leaveNow(paths) {
	var next = nextClass(courses);
	if (next == null || paths == null)
		return;
	
	var classTime = new Date();
	classTime.setHours(next.start[0], next.start[1]);
	
	var leavenow = "";
	for (var i = 0; i < paths.length; i++) {
		var eta = etaTime(paths[i][1]);
		//Converting ms to minutes
		var minDiff = (classTime - eta) / (1000 * 60);
		
		//Checks if ETA arrival time is within 1-10 minutes for all the paths
		//Also a sanity check if the hours are the same
		if (minDiff > 0 && minDiff <= 10) {
			leavenow += readColor(paths[i][0]) + ", ";
//			leavenow += "You have to leave now in order to make it in time for class. You have to take the " + paths[i][0] + "<br /> ";
			console.log("You have to leave now in order to make it in time for class. You have to take the " + paths[i][0] + " minDiff is " + minDiff);
		}
	}
	
	console.log("leavenow " + leavenow == null + "<-null + ''->" + leavenow != "");
	if (leavenow != "") {
		leaving = true;
		document.getElementById("leave_status").innerHTML = "Leave now to make it time take these routes: " + leavenow.substring(0, leavenow.lastIndexOf(","));
		$('leaving_status').show();
	} else {
		leaving = false;
		$('leaving_status').hide();
	}
}

/**
 * @description Converts the HTML colors to human readable values
 * @param color
 * @return
 */
function readColor(color) {
	if(color == "#00FF00") { 
		return"All Walk";
	} else if (color == "#336600") {
		return "Walk";
	} else if(color == "#FF0000") {
		return "Red";
	} else if(color == "#0000FF") {
		return "Blue";
	} else if(color == "#FFFF00") {
		return "Trolley";
	}
	return "";
}

function main() {
	var redtime = 17.057221666666667;
}