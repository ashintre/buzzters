var panels = new Array(
	{id: 'new',			name: 'New'},
	{id: 'my_courses',	name: 'My Courses'},
	{id: 'gt_videos',	name: 'GT Videos'}
);

/* GT Video Service API URL */
var gtVideoUrl = 'http://oms.media.gatech.edu/services.php';

/* Run Mode for Widget [devel,test,prod] */
var runMode = "devel";

/* The current active panel */
var activePanelId = "panel_new";
/*
function getProxyURL(url) {
	if (runMode == "devel") {
		return url;
	} else {
		return window.ProxyPortalPHP+ encodeURIComponent(url);
	}
	
}
*/
function buildVideoList(parent_obj,filter) {
	var url = getProxyURL(gtVideoUrl);
	console.log(url);
	parent_obj.append('<div class="scroll_wrapper"><ul class="video_list" /></div>');
	$.getJSON(getProxyURL(gtVideoUrl + '/rest/test/filter/'+filter), function(data) {
		$.each(data, function() {
		  $("ul",parent_obj).append('<li><div class="video_wrapper"><a class="thumb_img">' +
				'<img src="' + getProxyURL(gtVideoUrl + '/get/thumb/uuid/'+this.uuid) + '" onerror="noImage(this);" />' +
				'</a><div class="title">' + this.filename + '<br />(' + secondsToTime(this.duration) + ')</div>' +
				'</div></li>');
		  $("ul",parent_obj).find('a').bind('click', function(event, ui) {
			alert('uuid= '+this.uuid);
		  });
		});
		$(".video_wrapper",parent_obj).button();
	});
}

/* To cope with the fact that JS doesn't pass objects by reference, annoying... */
function getVideoList() {
	return $('#'+activePanelId).find('ul.video_list');
}

function getVideoListMask() {
	return $('#'+activePanelId).find('div.scroll_wrapper');
}

function getActiveItem() {
	var items = $('#'+activePanelId).find('div.video_wrapper.ui-state-hover');
	if (items.length > 0) {
		return items.eq(0);
	} else {
		return false;
	}
}

/* Handles the selecting and scrolling of a unordered list */
function scrollingListHandler(direction) {
	var currentActiveItem = getActiveItem();
	var numItems = $('#'+activePanelId).find('div.video_wrapper').length;
	var videoBtnHeight = $('li', getVideoList()).outerHeight() + 2;

	/* Set active button */
	if (getActiveItem() == false) { /* init first item */
		$('#'+activePanelId).find('div.video_wrapper').eq(0).addClass("ui-state-hover");
		
	} else if (direction == "up" && getActiveItem().closest('li').prev('li').length > 0) { /* previous item */
		$('div.video_wrapper', getVideoList()).each(function(index) { $(this).removeClass("ui-state-hover"); });
		currentActiveItem.closest('li').prev('li').find('div.video_wrapper').addClass("ui-state-hover");
		
	} else if (direction == "down" && getActiveItem().closest('li').next('li').length > 0) { /* next item */
		$('div.video_wrapper', getVideoList()).each(function(index) { $(this).removeClass("ui-state-hover"); });
		currentActiveItem.closest('li').next('li').find('div.video_wrapper').addClass("ui-state-hover");	
	}

	/* Scroll list as needed */
	if (getActiveItem()) {
                // Position of where button's middle is at right now
		var activeBtnMid = getActiveItem().offset().top + (videoBtnHeight / 2);
		// Position of where Mask's middle is at right now
                var videoListMaskMid = (getVideoListMask().offset().top + (getVideoListMask().innerHeight() / 2));
		// Position of Video list's top
                var videoListTop = getVideoList().offset().top - getVideoListMask().innerHeight() + getVideoList().height();

                console.log(getVideoList());
                console.log(activeBtnMid)
                console.log(videoListMaskMid);
                console.log(videoListTop);

                // videoListTop - videoBtnHeight) > 0 : If top has enough room for btn
                // activeBtnMid - videoBtnHeight > videoListMaskMid : Current button has not pass Mask middle yet
                if ( (videoListTop - videoBtnHeight) > 0 && activeBtnMid - videoBtnHeight > videoListMaskMid )
		{
			/* scroll down */
			$('#'+activePanelId).find('ul.video_list').offset({ top: getVideoList().offset().top - videoBtnHeight, left: getVideoList().offset().left });
				
		} 
                // getVideoList().offset().top < getVideoListMask().offset().top :
                // activeBtnMid + videoBtnHeight < videoListMaskMid : 
                else if ( getVideoList().offset().top < getVideoListMask().offset().top && activeBtnMid + videoBtnHeight < videoListMaskMid )
		{
			/* scroll up */
			$('#'+activePanelId).find('ul.video_list').offset({ top: getVideoList().offset().top + videoBtnHeight, left: getVideoList().offset().left });
		}	
	}
	
	/* Debugging */
	if (getActiveItem()) {
                // (getActiveItem().offset().top + (videoBtnHeight / 2)) : Position where middle of Active Item is
                // (getVideoListMask().offset().top + (getVideoListMask().innerHeight() / 2)) : Position of where middle of Mask is
		console.log( (getActiveItem().offset().top + (videoBtnHeight / 2)) + ' > ' + (getVideoListMask().offset().top + (getVideoListMask().innerHeight() / 2)) );
	}

}

function noImage(source) {
	source.src = "gtvideo.png";
  	source.onerror = "";
  	return true;
}

function secondsToTime(secs)
{
	var result = '';
	var hours = Math.floor(secs / (60 * 60));
	
	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	
	if (hours > 0) {
		result = result + pad(hours,2) + ':';
	}
	
	return result + pad(minutes,2) + ':' + pad(seconds,2);
}

function pad(number, length) {
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;

}

$(document).ready(function(){ 
	var tab_links = '<ul>';
	var li_link;
	for (var p in panels){
		li_link = '<li><a href="#panel_'+panels[p].id+'">'+panels[p].name+'</a></li>';
		tab_links = tab_links+li_link;
	}
	
	tab_links = tab_links+'</ul>';
	$('#tabs').append(tab_links);

	// Create Panels based on the panels array
	for (var p in panels) {
		// Create DIVS base on Number of Panels
		$('#tabs').append("<div id='panel_" + panels[p].id + "' class='main'></div>");
	}
	
	buildVideoList($('#panel_new'),'');
	buildVideoList($('#panel_my_courses'),'ECE');
	buildVideoList($('#panel_gt_videos'),'GT');
	
});


/**
    @description init is immediately called after document ready which provides default start values.
*/
function init(){
	// To Widget Developers, you can try to pass the 'regular' or 'small' view! For more questions, please email ruby or nadu
	//switchView('regular'); // Required function that must be implement by Widget Developer

	// NOTE! Should combine these two functions
	getOUXTheme();
	switchPanel('new');
	setWidgetElementInFocus('panel_new');
}

// Load Initial Javascripts
//window.onload = init;

function getWidgetElementInFocus(){

        console.log('getWidgetElementInFocus' + activePanelId);
        return activePanelId;

}


function setWidgetElementInFocus(divId){

       $('#'+activePanelId).removeClass('ui-state-active');
       activePanelId = divId;
       $('#'+divId).addClass('ui-state-active'); 
       console.log('setWidgetElementInFocus' + activePanelId);

        //return document.activeElement.id;
}


function setOpeningWidgetView() {
	$('#tabs').tabs({selected: 0});
        setWidgetElementInFocus('panel_new');
        console.log('set opening widget view' +document.activeElement.id);
}

/**
    @description Create content for specific panel with given html
    @param {string} panelId Panel id where we want to append given html
	@param {string} html HTML code that makes up the content
*/
createPanelContent = function(panelId, html){
	$('#panel_' + panelId).append(html);
}

/**
    @description Switch to specific panel based on given id
    @param {string} panelId Panel id that the should be switched to
*/
switchPanel = function(panelId){
	$('#panel_container div').hide();
	$('#panel_'+panelId).show();	
	$('#panel_'+ panelId +' div').show();  
}

/**
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){
	console.log("switchView: " + newView);
	document.getElementById('view').className = newView;	
	if(newView == 'icon'){
		$('#tabs').tabs('disable'); // Remove jQuery Tabs
		$('.panel_container').hide(); // Hide everything inside panel_container		
	}
	else if(newView == 'regular'){
		$('#tabs').tabs(); // Use jQuery Tabs
		$('.panel_container').show(); // Show everything inside panel_container
	}
	else{ // ticker, small
		$('#tabs').tabs('disable'); // Remove jQuery Tabs
		$('.panel_container div').hide(); // Hide div inside panel_container
		$('.panel_container ul').hide(); // Hide ul inside panel_container
		$('#' + activePanelId).show(); // Show only the active panel
	}
}

/**
    @description wigetKeyLEFT is a callback function that maps to the LEFT Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyLEFT = function(){
    var selected = $( "#tabs" ).tabs( "option", "selected" );
    if(selected>0){
		
                    if(activePanelId.substring(0,5) == 'panel'){
                        $('#tabs').tabs({selected: selected-1});
                        divId = document.getElementById(activePanelId).previousSibling.id;
                        setWidgetElementInFocus(divId);
                        console.log('activeElement left= '+activePanelId);
                    }
    }
    else{
      $('#tabs').tabs({selected: selected});
    }

    return true;

}

/**
    @description wigetKeyRIGHT is a callback function that maps to the RIGHT Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyRIGHT = function(){ 
    var selected = $( "#tabs" ).tabs( "option", "selected" );
    numTabs = $("#tabs").tabs("length");

    if(selected < (numTabs-1)){

                    if(activePanelId.substring(0,5) == 'panel'){
                        $('#tabs').tabs({selected: selected+1});
                        divId = document.getElementById(activePanelId).nextSibling.id;
                        setWidgetElementInFocus(divId);
                        console.log('activeElement right= '+activePanelId);
                    }

    }
    else{
        $('#tabs').tabs({selected: selected});
    }
    return true;
}

/**
    @description wigetKeyOK is a callback function that maps to the OK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyOK = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyOK triggered");
	return false;
}

/**
    @description wigetKeyBACK is a callback function that maps to the BACK Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyBACK = function(){
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyBACK triggered");
	return false;
}

/**
    @description wigetKeyUP is a callback function that maps to the DOWN Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyUP = function(){
	scrollingListHandler('up');
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyUP triggered");
	return true;
}

/**
    @description wigetKeyDOWN is a callback function that maps to the DOWN Key on the remote controller. 
	@description The function is called by the platform and should be implement by the widget developer.
*/
widgetKeyDOWN = function(){
	scrollingListHandler('down');
	console.log('activeElement = OK'+activePanelId);
	console.log("widgetKeyDOWN triggered");
	return true;
}