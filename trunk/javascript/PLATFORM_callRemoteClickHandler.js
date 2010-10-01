// for passing demo remote clicks to the handler
function clickedRemoteKey(keyCode){
	
	$(document).trigger({type:"keydown", dummyCode: keyCode});	
	
}

function rollOver(img_name, img_src){
			document[img_name].src = img_src;
}