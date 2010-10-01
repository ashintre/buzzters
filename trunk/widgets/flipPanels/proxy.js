/**
    @description Proxy Call Example using DIGG API
*/
/**
	@description Get Popular Digg News
*/
function getDiggPopular(){

	var proxyUrl = "/quercus-4.0.3/WidgetProxy.php?query=";
	var diggAPI = "http://services.digg.com/1.0/endpoint?method=story.getPopular&count=3&type=json";

	var req = ProxyPortal + encodeURIComponent(diggAPI);
	
	$.getJSON(req, function(data){
		if ((data !== null) &&
	        (data !== undefined)){
			var newHtml = "";
			for(var i = 0; i < data.count; i++){
				newHtml = newHtml 
                                    + "<p>"
                                    + data.stories[i].title
                                    + "</p>";
			}
			updatePanelCallback(newHtml);
		}				
	});
}
