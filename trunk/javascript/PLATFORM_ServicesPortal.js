function ajaxRequest(){
	 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]; //activeX versions to check for in IE
	 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
	 for (var i=0; i<activexmodes.length; i++){
		 try{
			 return new ActiveXObject(activexmodes[i])
		 }
		 catch(e){
			 /*suppress error*/
		 }
	 }
	 }
	 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
	 {
		 return new XMLHttpRequest()
	 }
	 else
		 return false;
}
/*
 ********************************These are StationList and StationInfo Services*********************************
 */

/* stationList, as the name suggests, returns the list of available stations along with multicast address for video
 * stream and station name. 
 * It also informs about the TOD enabled/disabled status of station. This is necessary because a number of IPTVPortal
 * APIs and meant specifically for TOD enabled stations.  
 */
/**
@description calls the callback function with the list of available stations as a json object
@param the callback function to be called with the available stations list
*/

function getStationList(callBack){
	 //var url = top.getJavaProxyURL()+top.getIptvPortalURL()+"StationList%3Fmethod%3Dstationlist";
	var url = top.getIptvPortalURL()+"StationList%3Fmethod%3Dstationlist";
               $.ajax({
                           url: url,
                           dataType: 'json',
                           success:function(jsondata){
                           var StationListJson = jsondata;
			               if (StationListJson.entryCount != 0)
                           {
				   				callBack(StationListJson);
                           }
                        },
               			async: false});
}


/* 
 * nowPlaying : This function returns information about the currently playing show on a given StaionID 
 */
/**
@description calls the callback function with the information about the currently playing show on a given Station ID
@param stationId - Id of the station
@param handler the callback function which will be called with the json data 
*/
function nowPlaying(stationId, callback){
	
	var url = top.getIptvPortalURL()+"StationInfo%3Fmethod%3DNowPlaying%26stationId%3D"+stationId;
	//console.log(url);
                $.ajax({
                            url: url,
                            dataType: 'json',
                            success:function(jsondata){
                            var nowPlayingJson = jsondata;
                            //console.log("now playing info="+eval(jsondata));
                            if (nowPlayingJson.entryCount != 0)
                            {
				   				var nowPlayingEpisodeEntry = {	summary: nowPlayingJson.description,
				   												icon: nowPlayingJson.icon,
				                								title: nowPlayingJson.title,
				                								stationId: nowPlayingJson.stationId,
				                								startTime: nowPlayingJson.startTime,
				                								isVisible: nowPlayingJson.isVisible
				   												};
				   				//console.log(nowPlayingJson.description);
				   				//console.log("Done creating json package");
                            }
                            callback(nowPlayingJson);
                			},
                			async: false});
}

/*
 * The allShows function list all available shows on a TOD enabled channel.
 * This is a TOD station specific functionality. Before calling this function on a StationId ensure that the Station
 * is TOD enabled by checking the StationList obtained through stationList(..)  
 */
/**
@description calls the callback function with the information about all available shows on a TOD enabled channel
@param stationId - Id of the stationwhich
@param handler the callback function which will be called with the json data 
*/
function allShows(stationId, callBack){
	 var url = top.getIptvPortalURL()+"StationInfo%3Fmethod%3Dallshows%26stationId%3D"+stationId;
               $.ajax({
                           url: url,
                           dataType: 'json',
                           success:function(jsondata){
                           var allShowsJson = jsondata;
			  
                           if (allShowsJson.entryCount != 0)
                           {
				   				callBack(allShowsJson);
                           }
                        },
               			async: false});
}


/*
 * The newlyAvailable function returns the latest TOD assets that have been recorded for a given stationId.
 * Again this is a TOD enabled station ONLY function. 
 */
/**
@description calls the callback function with the latest TOD assets that have been recorded for a given stationId.
@param stationId - Id of the station
@param handler the callback function which will be called with the json data 
*/
function newlyAvailable(stationId, callBack){
	 var url = top.getIptvPortalURL()+"StationInfo%3Fmethod%3DNewlyAvailable%26stationId%3D"+stationId;
              $.ajax({
                          url: url,
                          dataType: 'json',
                          success:function(jsondata){
                          var newlyAvailableJson = jsondata;
			  
                          if (newlyAvailableJson.entryCount != 0)
                          {
				   				callBack(newlyAvailableJson);
                          }
                       },
              			async: false});
}


/*
 * The featureShows function returns the list of featured shows for a given TOD enabled station. 
 */
/**
@description calls the callback function with the list of featured shows for a given TOD enabled station. 
@param stationId - Id of the station
@param handler the callback function which will be called with the json data 
*/
function featuredShows(stationId, callBack){
	 var url = top.getIptvPortalURL()+"StationInfo%3Fmethod%3Dfeaturedshows%26stationId%3D"+stationId;
             $.ajax({
                         url: url,
                         dataType: 'json',
                         success:function(jsondata){
                         var featuredShowsJson = jsondata;
			  
                         if (featuredShowsJson.entryCount != 0)
                         {
				   				callBack(featuredShowsJson);
                         }
                      },
             			async: false});
}

/*
 * pastEpisodes function returns the list of past TOD episodes for a particular series.
 */
/**
@description calls the callback function with the list of past TOD episodes for a particular series.
@param stationId - Id of the station
@param seriesId - Id of the series
@param handler the callback function which will be called with the json data 
*/
function pastEpisodes(stationId, seriesId, callBack){
	 var url = top.getIptvPortalURL()+"StationInfo%3Fmethod%3Dpastepisodes%26stationId%3D"+stationId+"%26seriesId%3D"+seriesId;
            $.ajax({
                        url: url,
                        dataType: 'json',
                        success:function(jsondata){
                        var pastEpisodesJson = jsondata;
			  
                        if (pastEpisodesJson.entryCount != 0)
                        {
				   				callBack(pastEpisodesJson);
                        }
                     },
            			async: false});
}




/*
 * The bookmark function enables creation, retrieval and deletion of bookmarked TOD assets for a given client. 
 * assetId argument must be set to 0 when not relevant as in the case of the "get" all bookmarks action.
 */
/**
@description enables creation, retrieval and deletion of bookmarked TOD assets for a given client. 
@param action String passed as - create, get, delete, isBookmarked
@param clientId MAC address of the user 
@param assetId - Id of the station - 0 for get all bookmarks action
@param handler the callback function which will be called with the json data 
*/

function bookmark(action, clientId, assetId, callBack){
	if(action == undefined || clientId == undefined || assetId == undefined || callBack == undefined){
		//console.log("bookmark() Usage: bookmark(action[create/get/delete/isBookmarked], clientId, assetId[0, is not used], callBack)");
		callBack(undefined);
	}
	var url;
	switch(action){
	case "create":
		url = top.getIptvPortalURL()+"Bookmarks%3Fmethod%3Dcreate%26clientId%3D"+clientId+"%26assetId%3D"+assetId;
		break;
	case "get":
		url = top.getIptvPortalURL()+"Bookmarks%3Fmethod%3Dget%26clientId%3D"+clientId;
		break;
	case "delete":
		url = top.getIptvPortalURL()+"Bookmarks%3Fmethod%3Ddelete%26clientId%3D"+clientId+"%26assetId%3D"+assetId;
		break;
	case "isBookmarked":
		url = top.getIptvPortalURL()+"Bookmarks%3Fmethod%3DisBookmarked%26clientId%3D"+clientId+"%26assetId%3D"+assetId;
		break;
	}

	$.ajax({
        url: url,
        dataType: 'json',
        success:function(jsondata){
        var bookmarkJson = jsondata;

        if (bookmarkJson.entryCount != 0)
        {
   				callBack(bookmarkJson);
        }
     },
		async: false});
}



/*
 * VOD mode
 * clientId must be of the form clientId=00:02:9b:4b:ea:3f
 * The CSF has configuration which specifies a VOD multicast address for every configured IPTV STB client.  
 */

/**
@description VOD Service
@param action String passed as - "setup"
@param trickPlay "play", "pause", "rewind", "forward", "close" 
@param clientId - MAC address of the user
@param resourceId 
@param handler the callback function which will be called with the json data 
*/

function vodService(action, trickPlay, clientId, resourceId, callBack){
	var url;
	
	if (action === undefined){
		//console.log("vodService Usage: vodService(action[setup/control], trickPlay[play/pause/rewind/forward/close], resourceId, callBack");
		callback(undefined);
	}

	if (action === "setup"){
		url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Dsetup%26clientId%3D"+clientId+"%26clientType=iptv%26resourceId%3D"+resourceId;
	}
	else{
		if (trickPlay === undefined){
			//console.log("vodService Usage: vodService(action[setup/control], trickPlay[play/pause/rewind/forward/close], resourceId, callBack");
			callback(undefined);
		}
		switch(trickPlay){
		case "play":
			url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Dplay%26clientId%3D"+clientId;
			break;
		case "pause":
			url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Dpause%26clientId%3D"+clientId;
			break;
		case "rewind":
			url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Drewind%26clientId%3D"+clientId;
			break;
		case "forward":
			url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Dforward%26clientId%3D"+clientId;
			break;
		case "close":
			url = top.getIptvPortalURL()+"VoDService%3Fmethod%3Dclose%26clientId%3D"+clientId;
			break;
		default:
			//console.log("vodService Usage: vodService(action[setup/control], trickPlay[play/pause/rewind/forward/close], resourceId, callBack");
			callback(undefined);
			break;
		}
			
	}
	$.ajax({
        url: url,
        dataType: 'json',
        success:function(jsondata){
        var VODJson = jsondata;

        if (VODJson.entryCount != 0)
        {
   				callBack(VODJson);
        }
     },
		async: false});
	
}



/*
 * TODO The version of Recommender Service that I have access to throws java exceptions. 
 * Will revisit to implement it when the recommender service is functional.
 */




/////////////////////////// RecommenderGateway Service /////////////////////////////////////////////////////////////

function getRecommendation(stationId, recommendationType, assetId, handler)
{
	var httpRequest = new ajaxRequest();
	var recommendationJson = null;
    var serial = null;//For STB - var serial = toiEnv.createInformationObject("config.macaddress").getValue();
    
    var recommendationArray = new Array();
    
    var url;
    
    if(recommendationType == "GENERAL")
    {
    	url = "/Widget_Platform/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FRecommenderGateway%3Fmethod%3DGENERAL%26client-id%3D"+serial+"%26station-id%3D"+stationId; 
    }
    else if(recommendationType == "SIMILAR")
    {
    	url = "/Widget_Platform/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FRecommenderGateway%3Fmethod%3DSIMILAR%26client-id%3D"+serial+"%26station-id%3D"+stationId+"%26asset-id%3D"+assetId;
    }
    else if(recommendationType == "DIFFERENT")
    {
    	url = "/Widget_Platform/MyProxy?query=http://128.61.159.74%2FIptvPortal%2FRecommenderGateway%3Fmethod%3DDIFFERENT%26client-id%3D"+serial+"%26station-id%3D"+stationId+"%26asset-id%3D"+assetId;
    }

    
    httpRequest.open("GET", url, true);
    httpRequest.send(null)
    httpRequest.onreadystatechange=function(){

 	   if (httpRequest.readyState==4){
 		   if (httpRequest.status==200){

 			   var jsondata=httpRequest.responseText; //retrieve result as an XML object


 			   recommendationJson = eval('(' + jsondata + ')');
 			   
 			//Cast Json into EpisodeEntry array
 			  if (recommendationJson != null)
 	            {
 	                for (var index = 0; index < recommendationJson.entryCount; index++)
 	                {
 	                    var startDateObj = new Util().getDateObject(recommendationJson.entries[0].startTime);
 	                    var endDateObj = new Util().getDateObject(recommendationJson.entries[0].endTime);
 	                    var episodeEntry = new EpisodeEntry(
 	                        recommendationJson.entries[index].summary,
 	                        recommendationJson.entries[index].origAirDate,
 	                        recommendationJson.entries[index].title,
 	                        recommendationJson.entries[index].resourceID,
 	                        recommendationJson.entries[index].subtitle,
 	                        recommendationJson.entries[index].rating,
 	                        recommendationJson.entries[index].deleteTime,
 	                        startDateObj,
 	                        endDateObj,
 	                        recommendationJson.entries[index].assetId,
 	                        recommendationJson.entries[index].seriesId,
 	                        recommendationJson.entries[index].extAssetId,
 	                        recommendationJson.entries[index].duration
 	                        );
 	                    recommendationArray.push(episodeEntry);
 	                }
 	            }
 			   handler(recommendationArray);
 		   }
 		   else{
 			   //alert("An error has occured making the request")
 			   handler("An error has occured making the request");
 		   }
 	   }
    }
    
}



////////////////////// Getting Show Information - some issues...not currently used ////////////////////////////

function getShowInfo(display, keyword)
{
	//alert("Creating a new ajax request");
	//document.write(query) 
   var mygetrequest=new ajaxRequest();
   var weatherArray = new Array();
//   var tempurl = encodeURIComponent("http://services.tvrage.com/feeds/search.php?show=CBS+News");
   var url = "/Widget_Platform/MyProxy?query=http://api.nytimes.com%2Fsvc%2Fmovies%2Fv2%2Freviews%2Fsearch%3F&api%2Dkey%3Dcd9a382e11e6d0add45f1176e4e1a38f:18:60312299";
   //var url = "/CSFTest/MyProxy?query=http:%2F%2Fservices.tvrage.com%2Ffeeds%2Fepisode_list.php%3Fsid%3D8511";// + zipcode;
   //For current weather use: http://api.wunderground.com/auto/wui/geo/WXCurrentObXML/index.xml?query=10022
   mygetrequest.open("GET",url, true);
   mygetrequest.send(null)
   mygetrequest.onreadystatechange=function(){

	   if (mygetrequest.readyState==4){
		   if (mygetrequest.status==200){
			   var xmldata=mygetrequest.responseText; //retrieve result as an XML object
			   			   
			   display(xmldata);
			   
		   }
		   else
		   {
			   display("Error while making the request");
			   //console.log("Error");
		   }
	   }
   }
}

