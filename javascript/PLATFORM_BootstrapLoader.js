
/* Starting point - And so it began */

window.onload = init;
function init(){
     // implemented by the Widget Platform
     // sets up the videoplane - TODO: Can it take parameters?
	  // fetch config infor and instantiate oux
   
	OUX.init();     /* In OUX1_Core.js */
}

$(document).ready(function(){  // everything inside '$document.ready(){}' uses jQuery. See jQuery.com

        platformObject = new Platform();
        console.log("in bootstrap"+platformObject);
        bootStrapLoad();
        buildWidgetsAsIframes();
        console.log("in bootstraploader")

});

function allWidgetsInit(iframe){
    console.log("in allWidgetsinit"+iframe.id);    	
	iframe.contentWindow.init_all(iframe);
	//$(document).trigger({type:"keydown", dummyCode: 67});	
}




