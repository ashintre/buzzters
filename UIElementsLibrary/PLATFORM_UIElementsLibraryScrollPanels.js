/**
@description Boolean variable to check if Scroll Panel is in List mode or Panel mode
*/
var isScrollListOn = true;

/**
@description Current Panel Index
*/
var currentPanelIndex = 0;


/**
@description array of data to be displayed. 
*/
var panels = null;



/* PUBLIC SCROLL PANELS FUNCTIONS */

/**
    @public
    @description Creates scroll panels 
    @param {String[]} p array of panels in forms of panel.id and panel.html
*/
function createScrollPanels(p){
        panels = p;

        // Generate panels inside #panel_container
	for(var i = 0; i < panels.length; i++){
		var div = "<div id='" + panels[i].id + "' elementtype='scrollpanels' class='navigationClass'>" + panels[i].html + "</div>";
		document.getElementById('panel_container').innerHTML = document.getElementById('panel_container').innerHTML + div;
	}

        // Generate navigation menu inside #panel_list
        $("#panel_list").append("<ul class='list'></ul>");
        var html = "";
        for(var j = 0; j < panels.length; j++){
                var li = "<li><div id='div_" + panels[j].id + "' elementtype='scrollButton' class='btnWrapper navigationClass'>" + panels[j].name + "</div></li>";
                html = html + li;
        }
        $("#panel_list ul").append(html);
        activateJqueryUI(); // Activate JQuery UI
        setActiveElementId("div_" + panels[0].id);

        showScrollPanelList();
}

/**
    @public
    @description Switch panels
    @param {integer} index Panel index to be displayed
*/
function switchScrollPanels(index){
        console.log("switchpanels");
        // Reset Element focus inside panels
        currentPanelIndex = index; // set current panel index to new index

        // Hide Panel List
        isScrollListOn = false;
        $("#panel_list").hide();

        // Show Selected Panel based on currentPanelIndex value
        $("#panel_container").show();
        for(var i = 0; i < panels.length; i++){
		if(i == currentPanelIndex){
			$("#" + panels[i].id).show();
		}
		else{
			$("#" + panels[i].id).hide();
		}
	}
}

/**
    @public
    @description Update panel html
    @param {integer} index Panel index to be displayed
    @param {string} html New Html for Panel
*/
function updateScrollPanels(index, html){
	$("#" + panels[index].id).html(html);
}


/**
    @public
    @description Show panel list
*/
function showScrollPanelList(){
	$("#panel_container").hide();
        $("#panel_list").show();
        isScrollListOn = true;
}

/* PRIVATE SCROLL PANELS FUNCTIONS */

/**
    @private
    @description Go to the Active Panel (call switchPanels)
*/
function goToActiveScrollPanel(){
    console.log("goToActivePanel");
    var activePanelListItem = getActiveScrollListItem();
    var activePanelListItemIdDIV = activePanelListItem[0].id;
    for(var i = 0; i < panels.length; i++){
        var panelIdDIV = "div_" + panels[i].id;
        if(panelIdDIV == activePanelListItemIdDIV){
            switchScrollPanels(i);
            break;
        }
    }
}

/**
	@description Activate JQuery UIs
*/
function activateJqueryUI(){
	$(".btnWrapper").button();
	// add more jquery activation stuff here
}

/* KEYHANDLING FUNCTIONS */

/**
    @private
    @description Main Key handling for Scroll Panels
    @param {integer} activeElementId the element that is currently selected
    @param {string} key Key Press
*/
function keyNavigationElementHandler_scrollPanels(activeElementId,key){

	switch(key){
		case "UP":
			return keyNavigationElementHandler_scrollPanels_UP(activeElementId);
		case "DOWN":
			return keyNavigationElementHandler_scrollPanels_DOWN(activeElementId);
		case "LEFT":
			return keyNavigationElementHandler_scrollPanels_LEFT(activeElementId);
		case "RIGHT":
			return keyNavigationElementHandler_scrollPanels_RIGHT(activeElementId);
		case "OK":
			return keyNavigationElementHandler_scrollPanels_OK(activeElementId);
		case "BACK":
			return keyNavigationElementHandler_scrollPanels_BACK(activeElementId);
	}
}

/**
    @private
    @description UP Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_scrollPanels_UP(activeElementId){
        if(isScrollListOn){
            // call scroll list handler
            scrollingListHandler('previous');
        }
	return true;
}

/**
    @private
    @description DOWN Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_scrollPanels_DOWN(activeElementId){
        if(isScrollListOn){
            scrollingListHandler('next');
        }
	return true;	
}

/**
    @private
    @description OK Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_scrollPanels_OK(activeElementId){
        console.log("scroll Panel OK");

        if(isScrollListOn){
            console.log("goToActivePanel from OK");
            goToActiveScrollPanel();
        }

        return true;
}

/**
    @private
    @description BACK Key handling for Scroll Panels
    @param {string} activeElementId the element that is currently selected
    @returns {boolean} True if still widget is still in focus, false if not
*/
function keyNavigationElementHandler_scrollPanels_BACK(activeElementId){
        console.log("scroll Panel BACK");
        if(isScrollListOn){
            console.log("return false isScrollList On");
            return false; //exit widget
        }
        else{
            showScrollPanelList();
            return true; // Show Panel List and do not exit Widget
        }
}


/**
    @private
    @description Scroll Panel List handler
    @param {string} direction direction of the key press
*/
function scrollingListHandler(direction) {
    if(setActiveButton(direction)){ // if true, then scroll, if false, then no scroll
        scrollToButton(direction);
    }
}

/**
    @private
    @description Set Active Button to be hightlighted
    @param {string} direction direction of the key press
    @returns True or False value if Active Button is the First item in the List
*/
function setActiveButton(direction){

    var currentActiveItem = getActiveScrollListItem();
    
    /* Set active button */
    if (currentActiveItem == false) { /* init first item */
            $('#panel_list').find('div.btnWrapper').eq(0).addClass("ui-state-active");
            return false; // init first item, no need to scroll
    } else if (direction == "previous" && currentActiveItem.closest('li').prev('li').length > 0) { /* previous item */
            $('div.btnWrapper').each(function(index) {$(this).removeClass("ui-state-active");});
            currentActiveItem.closest('li').prev('li').find('div.btnWrapper').addClass("ui-state-active");
            return true;
    } else if (direction == "next" && currentActiveItem.closest('li').next('li').length > 0) { /* next item */
            $('div.btnWrapper').each(function(index) {$(this).removeClass("ui-state-active");});
            currentActiveItem.closest('li').next('li').find('div.btnWrapper').addClass("ui-state-active");
            return true;
    }

}

/**
    @private
    @description Scroll Active Button to the next item after Up or Down key press
    @param {string} direction direction of the key press
*/
function scrollToButton(direction){
    
    /* Scroll list as needed */
    var currentActiveItem = getActiveScrollListItem();

    if ((direction == "previous" && currentActiveItem.closest('li').prev('li').length > 0) ||
        (direction == "next" && currentActiveItem.closest('li').next('li').length > 0) ||
        (direction == "stationary" && currentActiveItem.closest('li').prev('li').length > 0)) {

        /* specific to ticker view only, horizontal scrolling*/
        if(views[currentViewIndex] == 'ticker'){
            console.log("horizontal");
            // how much space the button has from the left
            var activeBtnOffsetLeft = currentActiveItem.offset().left;
            // the width of the active button
            var activeBtnWidth = currentActiveItem.width();
            // the width of the current view
            var currentViewWidth = $('#view').width();

            console.log(activeBtnOffsetLeft + activeBtnWidth);
            console.log(currentViewWidth);

            if ((activeBtnOffsetLeft + activeBtnWidth + 10)  > currentViewWidth)
            {
                    /* scroll down */
                    console.log("scroll down");
                    console.log(getScrollList().offset().left);
                    getScrollList().offset({top: getScrollList().offset().top, left: getScrollList().offset().left - activeBtnWidth });
                    console.log(getScrollList().offset().left);
            } else if ((activeBtnOffsetLeft - activeBtnWidth) < 0)
            {
                    /* scroll up */
                    console.log("scroll up");
                    getScrollList().offset({top: getScrollList().offset().top, left: getScrollList().offset().left + activeBtnWidth});
            }
        }
        else{ /* vertical scrolling */
            // how much space the button has above
            console.log("vertical");
            var activeBtnOffsetTop = currentActiveItem.offset().top;
            
            console.log('currentActiveItem offset ' + activeBtnOffsetTop);
            // the height of the active button
            var activeBtnHeight = currentActiveItem.height();
            // the height of the current view
            var currentViewHeight = $('#view').height();

            if ((activeBtnOffsetTop + activeBtnHeight) > currentViewHeight)
            {
                    /* scroll down */
                    console.log("scroll down");
                    getScrollList().offset({top: getScrollList().offset().top - activeBtnHeight, left: getScrollList().offset().left});

            } else if ((activeBtnOffsetTop - activeBtnHeight) < 0)
            {
                    /* scroll up */
                    console.log("scroll up");
                    getScrollList().offset({top: getScrollList().offset().top + activeBtnHeight, left: getScrollList().offset().left});
            }
        }
    }
}

/**
    @private
    @description Get Scroll List object
    @returns {object} Scroll List 
*/
function getScrollList(){
	return $('#panel_list').find('ul.list');
}

/**
    @private
    @description Get Scroll List Item object
    @returns {object} Scroll List Item, returns false if empty
*/
function getActiveScrollListItem() {
        var items = $('div.btnWrapper.ui-state-active', '#panel_list');
	if (items.length > 0) {
		return items.eq(0);
	} else {
		return false;
	}
}

/* SWITCH VIEW FUNCTIONS */

/**
    @description Switch View Related
    @description Current View Index
*/
var currentViewIndex = 0;

/**
    @description Switch View Related
    @description Array of views. View configuration is defined in example.css
*/
var views = new Array('icon', 'regular', 'small', 'ticker', 'full');

/**
    @description Switch View Related
    @description Switch Widget View. Call by Layout Developers. Implement by Widget Developers
    @param {string} newView New widget view
*/
switchView = function(newView){

	// Set view to newView
	document.getElementById('view').className = newView;
        
	switch(newView){
		case "icon":
                        currentViewIndex = 0;
			switchViewIcon();
			break;
		case "regular":
                        currentViewIndex = 1;
			switchViewRegular();
			break;
		case "small":
                        currentViewIndex = 2;
			switchViewSmall();
		 	break;
		case "ticker":
                        currentViewIndex = 3;
			switchViewTicker();
			break;
		case "full":
                        currentViewIndex = 4;
			switchViewFull();
			break;
	}

        if(getActiveScrollListItem()){ // if there is active item
            scrollToButton('stationary');
        }
}

/**
    @description Switch View Related
    @description Switch widget to Icon View
*/
function switchViewIcon(){
    console.log("switchViewIcon");

    // width of btnWrapper is determined by the width of the view
    var btnWidth = $('#view').width();

    // height of the btnWrapper is determined by the height of the view divided by 3
    var btnHeight = $('#view').height() / 3;

    $('.btnWrapper').css({
        'height' : btnHeight + 'px',
        'width' : btnWidth + 'px',
        'font' : '2em'
    });

    // Make ICON LI Veritical
    $('.icon #panel_list li').css({
            'display' : 'block',
            'float' : 'none'
    });

    // Make ICON UL Veritical
    $('.icon #panel_list ul').css({
            'display' : 'block',
            'list-style-type' : 'none',
            'float' : 'none',
            'left' : '0px'
    });

    btnWidth = $("#view").width();
    btnHeight = $("#view").height();

    // Make panel_list width and height
    $('#panel_list').css({
        'width' :  btnWidth,
        'height' : btnHeight
    });
}

/**
    @description Switch View Related
    @description Switch widget to Regular View
*/
function switchViewRegular(){
    
    // width of btnWrapper is determined by the width of the view
    var btnWidth = $('#view').width();

    // height of the btnWrapper is determined by the height of the view divided by 3
    var btnHeight = $('#view').height() / 3;

    console.log("button width here!");
    console.log(btnWidth);

    $('.btnWrapper').css({
        'height' : btnHeight + 'px',
        'width' : btnWidth + 'px',
        'font' : '2em'
    });

    // Make REGULAR LI Veritical
    $('.regular #panel_list li').css({
            'display' : 'block',
            'float' : 'none'
    });

    // Make REGULAR UL Veritical
    $('.regular #panel_list ul').css({
            'display' : 'block',
            'list-style-type' : 'none',
            'float' : 'none',
            'left' : '0px'
    });

    btnWidth = $("#view").width();
    btnHeight = $("#view").height();

    // Make panel_list width and height
    $('#panel_list').css({
        'width' :  btnWidth,
        'height' : btnHeight
    });

}

/**
    @description Switch View Related
    @description Switch widget to Ticker View
*/
function switchViewTicker(){
    console.log("switchViewTicker");

    // width of btnWrapper is determined by the width of the view divided by 3
    var btnWidth = ($('#view').width() / 3) - 2;

    // height of the btnWrapper is determined by the height of the view
    var btnHeight = $('#view').height();

    // Set button width and height
    $(".btnWrapper").css({
        'height' : btnHeight + 'px',
        'width' : btnWidth + 'px',
        'font' : '2em',
        'margin' : '0'
    });

    // Make Ticker LI Horizontal
    $('.ticker #panel_list li').css({
            'display' : 'block',
            'float' : 'left'
    });

    // Make Ticker UL Horizontal
    $('.ticker #panel_list ul').css({
            'display' : 'inline',
            'list-style-type' : 'none',
            'float' : 'left',
            'top' : '0px'
    });

    var btnWidthTotal = $('.btnWrapper', '#panel_list').length * (btnWidth+4);
    btnHeight = $("#view").height();
    
    // Make panel_list width bigger than all the li widths
    $('#panel_list').css({
        'width' :  btnWidthTotal,
        'height' : btnHeight
    });
}

/**
    @description Switch View Related
    @description Switch widget to Small View
*/
function switchViewSmall(){
    console.log("switchViewSmall");

    // width of btnWrapper is determined by the width of the view
    var btnWidth = $('#view').width();

    // height of the btnWrapper is determined by the height of the view divided by 3
    var btnHeight = $('#view').height() / 3;

    console.log("button width here!");
    console.log(btnWidth);

    $('.btnWrapper').css({
        'height' : btnHeight + 'px',
        'width' : btnWidth + 'px',
        'font' : '2em'
    });

    // Make SMALL LI Veritical
    $('.small #panel_list li').css({
            'display' : 'block',
            'float' : 'none'
    });

    // Make SMALL UL Veritical
    $('.small #panel_list ul').css({
            'display' : 'block',
            'list-style-type' : 'none',
            'float' : 'none',
            'left' : '0px'
    });
    
    btnWidth = $("#view").width();
    btnHeight = $("#view").height();

    // Make panel_list width and height
    $('#panel_list').css({
        'width' :  btnWidth,
        'height' : btnHeight
    });
}