/**
	@description Handles Now Playing information (This is a Callback Function)
*/
function nowPlayingAggregator(info)
{
	var newHtml = "<p>" + info.getTitle() + ": " + info.getSummary() + "</p>";
	updatePanel(currentPanelIndex, newHtml);
}

/**
    @description CSF Call to get currently Now Playing Information
*/
function getNowPlayer(){
	
	try{
		platform = top.getPlatform();
		index = platform.getCurrentChannelIndex();

		// platform.subscribeChannelChangeEvent('programprofile');

		nowPlaying(nowPlayingAggregator, platform.channels[index].stationId); //"19556");
	}
	catch(e){
		console.log("Error executing getNowPlayer()");
	}
}