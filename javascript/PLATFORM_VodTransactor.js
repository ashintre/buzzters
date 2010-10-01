/**
 * VodTransactor.js
 * matt.defano@motorola.com
 * 
 * This class acts as a communications agent between the VodPlayer class (which
 * handles user-interface events) and the VOD server's session manager (which
 * controls the video stream).
 *
 * Initialization parameters:
 *	p_session_url (String):		URL representation of the VOD session this 
 *								transactor will control
 */

function VodTransactor (p_entry) {
    //log.debug("VodTransactor.js::Constructor()");

    // Self reference
    var me = this;
    var serial = null;//For STB - var serial = toiEnv.createInformationObject("config.macaddress").getValue();

    if (p_entry == null)
        throw ("Session descriptor entry can't be null");

    var entry = p_entry;
    /* removed as now using episodeEntry
	if (!entry.resourceID && !entry.productID)
		throw ("Session descriptor must provide a resource or product id");*/

    var requestor;
	
    // Indication of whether or not the transactor is valid
    var valid = false;
    var open_callback = null;
    var setupReplyJson = null;
	
    /* ***********************************************************************
	 *                           CLASS PROPERTIES                            *
	 * ***********************************************************************/
	
    //	VodPlayer.prototype.SESSION_GATEWAY_URL = "SessionSetupGateway";
    //VodPlayer.prototype.SESSION_GATEWAY_URL = "VodGateway";
		
    /* ***********************************************************************
	 *                           PRIVATE METHODS                             *
	 * ***********************************************************************/
	
    /**
	 * Called whenever the HttpRequestor completes an XMLHttpRequest (ajax) 
	 * operation. 
	 */	 
    function httpCompletionListener (sessionSetupJson) {
        try {
            //log.debug("VodTransactor.js::httpCompletionListener()");
            //log.debug("Response text: " + requestor.getResponseText());
            // Make sure the HTTP request responded with 201 (Created)
            //if (requestor.getStatus() != 201 && requestor.getStatus() != 200)
            //{
             //   alert ("VodTransactor.httpCompletionListener()\nRequest for session control endpoints returned status " + requestor.getStatus());
              //  qs = null;
            //}
			
            // Squirrel away the control URLs
            //else
            //{
            	/*
				qs = new QueryString(requestor.getResponseText());
				if (qs.isAttribute("close") 					&&
					qs.isAttribute("play")						&&
					qs.isAttribute("pause")						&&
					qs.isAttribute("rewind")					&&
					qs.isAttribute("ffwd")						&&
					qs.isAttribute("status") 					&&
					qs.isAttribute("streamIp")					&&
					qs.isAttribute("streamPort")	)		
				{
					valid = true;
				} else {
					new ErrorPanel("VodTransactor.httpCompletionListener()\nGot bogus session control response from Session Manager.");
				}		*/
            
                setupReplyJson = eval('(' + requestor.getResponseText() + ')');
                valid = true;
                sendVodCommand("PLAY");
            }
			
        } catch (e) {
        	alert("Error - httpCompletionListener");
            //new ErrorPanel("VodTransactor.httpCompletionListener()\n" + e);
        }
		
        open_callback();
    }
/*	
    function postToUrl (p_url) {
        var proxied_url = new ProxyUrl(p_url);
				
        var hr = new HttpRequestor(proxied_url.getProxiedUrl());
        hr.setHttpVerb("POST");
        hr.request();
    }
	
    function getFromUrl (p_url) {
        var proxied_url = new ProxyUrl(p_url);
		
        var hr = new HttpRequestor(proxied_url.getProxiedUrl());
        hr.setHttpVerb("GET");
        hr.request();
    }
*/
    function sendVodCommand(command)
    {
        //log.debug("VodTransactor.js::sendVodCommand()");
        if (!valid)
            return;

        //var url = VodPlayer.prototype.SESSION_GATEWAY_URL + "?method=" + command + "&client-id=" + serial;
        var url = "/CSFTest/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FSessionSetupGateway%3Fmethod%3D"+command+"%26client-id%3D"+serial;
        //log.debug("URL of VOD command: " + url);
        var httpRequest = new ajaxRequest();
        
        httpRequest.open("GET", url, true);
        httpRequest.send(null)
        httpRequest.onreadystatechange=function(){

     	   if (httpRequest.readyState==4){
     		   if (httpRequest.status==200){
     			   var jsondata=httpRequest.responseText;
     			   alert("Vod command successful");
     		   }
     		   else{
     			   alert("Error making request - sendVodCommand");
     		   }
     	   }
        }
    }
	
    /* ***********************************************************************
	 *                            PUBLIC METHODS                             *
	 * ***********************************************************************/		
	
    this.open = function (callback)
    {
        //log.debug("VodTransactor.js::open()");
        //open_callback = callback;
        /*
		if (!entry.productID && !entry.resourceID)
			throw ("Must supply either a product id or a resource id");*/
		
        //	var serial = toiEnv.createInformationObject("config.serialnumber").getValue();
        //    var serial = toiEnv.createInformationObject("config.macaddress").getValue();
        var resourceId = entry.getResourceId();
        var url = "/CSFTest/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FSessionSetupGateway%3Fmethod%3DSETUP%26client-id%3D"+serial+"%26resource-id%3D"+resourceId;

        /*var stationId = new Television().getChannelEntry().getTmsChannelId();
		
		if (entry.resourceID)
			url = url + "resource-id=" + entry.resourceID 
			          + "&client-id=" + serial
			          + "&station-id=" + stationId;			
		else
			url = url + "product-id=" + entry.productID 
				+ "&resource-version=" + entry.resourceVer
				+ "&client-id=" + serial
				+ "&station-id=" + stationId;*/
        //url = url + "method=SETUP"
        //+ "&client-id=" + serial
        //+ "&resource-id=" + resourceId;


        //E.g. Final URL: "VodGateway?method=SETUP&client-id=00:1C:11:C9:E2:92&resource-id=xyz"
        //log.debug("URL: " + url);
        var httpRequest = new ajaxRequest();
        
        httpRequest.open("GET", url, true);
        httpRequest.send(null)
        httpRequest.onreadystatechange=function(){

     	   if (httpRequest.readyState==4){
     		   if (httpRequest.status==200){
     			   var jsondata=httpRequest.responseText;
     			   
     			   setupReplyJson = eval('(' + jsondata + ')');
     			   
     			   valid = true;
                   sendVodCommand("PLAY");
                   callback();
     			   //calling httpCompletionListener
     			   //httpCompletionListener(sessionSetupJson);
     		   }
     		   else{
     			   alert("Error while making request - open");
     			   
     		   }
     		}
        }
        
        
        
        //requestor.requestCompletionListener(httpCompletionListener);
       // requestor.setAsync(false);
        //requestor.request();

    }
	 
    this.isOpen = function () {
        return valid;
    }

    this.close = function () {
  
        sendVodCommand("CLOSE");
        valid = false;
    
    // No harm in trying to close a closed transactor
    /*	if (!valid)
			return
	
		//postToUrl(qs.getValue("close"));
         var url = VodPlayer.prototype.SESSION_GATEWAY_URL + "?method=CLOSE&client-id=" + serial
         + "&client-id=" + serial
     + "&resource-id=" + resourceId;
        "/VodGateway?method=CLOSE&client-id=00:1C:11:C9:E2:92"
		valid = false;*/
    }
	 
    this.fastForward = function () {
          sendVodCommand("FFW");
     /*   if (!valid)
            throw ("Transactor is closed or invalid");
	
        postToUrl(qs.getValue("ffwd"));*/
    }
	
    this.rewind = function () {
          sendVodCommand("REWIND");
     /*   if (!valid)
            throw ("Transactor is closed or invalid");
	
        postToUrl(qs.getValue("rewind"));*/
    }

    this.pause = function () {
           sendVodCommand("PAUSE");
      /*  if (!valid)
            throw ("Transactor is closed or invalid");
	
        postToUrl(qs.getValue("pause"));*/
    }

    this.play = function () {
          sendVodCommand("PLAY");
       /* if (!valid)
            throw ("Transactor is closed or invalid");*/
	
    //	postToUrl(qs.getValue("play"));
    }

    this.getStreamAddress = function ()
    {
        //log.debug("VodTransactor.js::getStreamAddress()");
        if (!valid)
            throw("Transactor is closed or invalid");
        /*
		return qs.getValue("streamIp") + ":" + 
				qs.getValue("streamPort");*/
        var streamAddress = setupReplyJson.streamIp + ":" + setupReplyJson.streamPort;
        //   var streamAddress = setupReplyJson.streamIp + ":8208";
        //   var streamAddress = "224.1.1.30:8202";
        //   var streamAddress = "udp://10.224.39.10:10000";
        //     var streamAddress = "10.224.39.10:10000";
        // var streamAddress = "igmp://224.1.1.30:8202";

        //log.debug("Stream address: " + streamAddress);
        return streamAddress;

    }


}