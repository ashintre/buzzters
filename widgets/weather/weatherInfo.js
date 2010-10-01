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

function weatherData()
{
	
}

function getWeatherForecast(handler, zipcode)
{
	//alert("Creating a new ajax request");
	//document.write(query) 
   var mygetrequest=new ajaxRequest();
   var jForecast;// = new Array();
   //var weatherArray2 = new Array();
   //var weatherArray3 = new Array();
   //var weatherArray4 = new Array();
   //mano edit
  
  //var url = window.ProxyPortal+"http://api.wunderground.com%2Fauto%2Fwui%2Fgeo%2FForecastXML%2Findex.xml%3Fquery%3D"+zipcode;
   var url = getProxyURL("http://api.wunderground.com/auto/wui/geo/ForecastXML/index.xml?query="+zipcode);
   console.log(url);
   mygetrequest.open("GET",url, true);
   mygetrequest.send(null);
   mygetrequest.onreadystatechange=function(){

	   if (mygetrequest.readyState==4){
		   if (mygetrequest.status==200  && mygetrequest.responseXML != null){
			   //alert("response received");
			   var xmldata=mygetrequest.responseXML; //retrieve result as an XML object
			   
			   var weekday = new Array();
			   var monthname = new Array();
			   var day = new Array();
			   var high_fahrenheit = new Array();
			   var low_fahrenheit = new Array();
			   var short_descr = new Array();
			   var icon = new Array();
			   
			   for(var i = 0; i < 4; i++)
			   {
				   weekday[i] = xmldata.getElementsByTagName("weekday")[i].childNodes[0].nodeValue;
				   
				   monthname[i] = xmldata.getElementsByTagName("month")[i].childNodes[0].nodeValue;
				   day[i] = xmldata.getElementsByTagName("day")[i].childNodes[0].nodeValue;
				   high_fahrenheit[i] = xmldata.getElementsByTagName("fahrenheit")[i*2].childNodes[0].nodeValue;
				   low_fahrenheit[i] = xmldata.getElementsByTagName("fahrenheit")[(i*2)+1].childNodes[0].nodeValue;
				   short_descr[i] = xmldata.getElementsByTagName("conditions")[i].childNodes[0].nodeValue;
				   icon[i] = xmldata.getElementsByTagName("icon_url")[(i+2)*9].childNodes[0].nodeValue;
			   }
			   
			   
			   jForecast = {"forecast": [
			           {"date": monthname[0]+"/"+day[0], "high_temp": high_fahrenheit[0], "low_temp": low_fahrenheit[0], "short_descr": short_descr[0], "icon": icon[0]}, 			                             
			           {"date": monthname[1]+"/"+day[1], "high_temp": high_fahrenheit[1], "low_temp": low_fahrenheit[1], "short_descr": short_descr[1], "icon": icon[1]},
			           {"date": monthname[2]+"/"+day[2], "high_temp": high_fahrenheit[2], "low_temp": low_fahrenheit[2], "short_descr": short_descr[2], "icon": icon[2]},
			           {"date": monthname[3]+"/"+day[3], "high_temp": high_fahrenheit[3], "low_temp": low_fahrenheit[3], "short_descr": short_descr[3], "icon": icon[3]}
			       ]
					   
			   };
			   
			   handler(jForecast);
			   
		   }
		   else
		   {
			   handler("Error while making the request");
		   }
	   }
   }
   
}

function getCurrentWeather(handler, zipcode)
{
     //   console.log(zipcode);
	var mygetrequest=new ajaxRequest();
	var xmldata;
	//mano edit
    //var url = window.ProxyPortal+"http://api.wunderground.com%2Fauto%2Fwui%2Fgeo%2FWXCurrentObXML%2Findex.xml%3Fquery%3D"+zipcode;
	var url = getProxyURL("http://api.wunderground.com/auto/wui/geo/WXCurrentObXML/index.xml?query="+zipcode);
    
    //For current weather use: http://api.wunderground.com/auto/wui/geo/WXCurrentObXML/index.xml?query=10022
	   mygetrequest.open("GET",url, true);
	   mygetrequest.send(null)
	   mygetrequest.onreadystatechange=function(){

		   if (mygetrequest.readyState==4){
			   if (mygetrequest.status==200 && mygetrequest.responseXML != null){
				   xmldata=mygetrequest.responseXML; //retrieve result as an XML object
				   
				  
					   var city = xmldata.getElementsByTagName("full")[0].childNodes[0].nodeValue;  
					   var time = xmldata.getElementsByTagName("local_time")[0].childNodes[0].nodeValue;
					   var temp = xmldata.getElementsByTagName("temperature_string")[0].childNodes[0].nodeValue;
					   var icon = xmldata.getElementsByTagName("icon_url")[0].childNodes[0].nodeValue;
					   var weather = xmldata.getElementsByTagName("weather")[0].childNodes[0].nodeValue;
					   var jWeather = {"current_weather": [
					           {"city": city, "time": time, "temperature": temp, "icon": icon, "short_descr": weather}                                    
					       ]
				     	};
                                 //  console.log('jweather =' + city + zipcode);
				   handler(jWeather);
                                  // console.log('jweather =' + city + zipcode);
				   
			   }
			   else
			   {
				   handler("Data Unavailable");
				   //console.log("Error");
			   }
		   }
	   }
}

