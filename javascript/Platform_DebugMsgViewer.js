/*
 * The variable debuglevel is set in the file PLATFORM_Configuration.js.
 * debuglevel=1 ; Indicates the presence of the debug window and the use of the log function Tvdebugger(msg).
 * debuglevel=0 ; indicates the absence of this logging functionality.
 * The debug window prints out the contents of any object(array, function,  String, Boolean, function,
 * date, RegExp, Number)
 */
function SetTvDebugger(debuglevel) {
	if(debuglevel===1){
		$('#platform_container').append("<div id='debugmsg' style='z-index:99;width:1200px;height:120px;position:absolute;left:40px;bottom:10px;background:lightblue;overflow:auto'></div>;");
		/*
		var debugdiv = document.createElement('div');
		debugdiv.setAttribute("id","debugmsg");
		debugdiv.setAttribute("style", "z-index:99;width:1280px;height:120px;position:absolute;left:0px;float;bottom:0;background:lightblue;overflow-y:auto;");
		*/
		//var debugdiv = <div id="" "style="z-index:99;width:780px;height:70px;position:absolute;left:0px;bottom:0px;background:lightblue;overflow-y:auto"></div>;
		//var container = document.getElementById(platform_container);
		//document.body.container.appendChild(debugdiv);
		//document.body.appendChild(debugdiv);
	}
}
/*
 * This is the debug message logger. The error/status message is passed as argument to this function.
 *@TODO: The argument passed is currently a string. Support to should be provided to log objects.
 *Make it analogous to firebug, but on the TV screen.  
 */
 
function TvDebugger(msg){
	if(debuglevel===0){
		return 0;
	}
	else {
	var message = msg.toSource();
	var debugdiv = document.getElementById("debugmsg");
	debugdiv.innerHTML = debugdiv.innerHTML+"<p>"+"	"+message+"</p>";
	}
}