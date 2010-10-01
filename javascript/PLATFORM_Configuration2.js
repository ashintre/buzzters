
/*
 * Remember to set the following configurations:
 * 1. STB mac address in PLATFORM_UserWidgetList.xml
 * 2. Proxy portal
 * 3. IPTVPortal
 */

var debuglevel=0;
var whatPortal = 5;
var ProxyPortal;
var UpdatePreferencesService;
var VM1 = "http://128.61.159.75:8080/";
var VM2 = "http://moto-vm2.cip.gatech.edu:8080/";
var VM3 = "http://moto-vm3.cip.gatech.edu:8080/";
var local = "http://localhost:8080/";
var initialPath = VM3;//local; //VM1, VM2, RNOC_Server; - change it accordingly

var JavaProxyPortalURL = initialPath+"PlatformServlets/MyProxy?query=";
var PhpProxyPortalURL =  initialPath +"/quercus-4.0.3/WidgetProxy.php?query=";
var GetWidgetListURL = initialPath+"PlatformServlets/GetWidgetListServlet?";
var UpdateGlobalValuesURL = initialPath+"PlatformServlets/UpdateGlobalValuesServlet?";
var UpdateWidgetValuesURL = initialPath+"PlatformServlets/UpdateWidgetValuesServlet?";
var CreateWidgetValuesURL = initialPath+"PlatformServlets/CreateWidgetValuesServlet?";
var AddNewWidgetURL = initialPath+"PlatformServlets/AddNewWidgetServlet?";
var IptvPortalURL = initialPath+"PlatformServlets/IPTVProxyServlet?query=";


function getPhpProxyURL(){
	return PhpProxyPortalURL;
}
function getJavaProxyURL(){
	return JavaProxyPortalURL;
}
function getIptvPortalURL(){
	return IptvPortalURL;
}

function getProjectKey(){
	return '789060';

}


