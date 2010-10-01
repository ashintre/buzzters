/**
	Create new Panels Object
	@constructor
        @description This class object is implement by Widget Developer.
*/
Panels = function(){
    this.KEY_SET = {};

    this.panels = {};
    this.currentPanelIndex = 0;

    this.currentBtn = null;

    this.isPanelListOn = true;
}

/* PANELS FUNCTIONS */

/**
    @description Generates panels based on the provided global panel variables
*/
Panels.prototype.generatePanels = function(panels){

        this.panels = panels;

        // Generate panels inside panel container
	for(var i = 0; i < this.panels.length; i++){
		var div = "<div id='" + this.panels[i].id + "' class='theme-content'>" + panels[i].html + "</div>";
		document.getElementById('panel_container').innerHTML = document.getElementById('panel_container').innerHTML + div;
	}

        // Generate panels list for navigation
        $("#panel_list").append("<ul class='list'></ul>");
        var html = "";
        for(var j = 0; j < this.panels.length; j++){
                var li = "<li><div class='btnWrapper'>" + this.panels[j].id + "</div></li>";
                html = html + li;
        }
        $("#panel_list ul").append(html);

}

/**
    @description Go to the Active Panel (call switchPanels)
*/
Panels.prototype.goToActivePanel =function(){
    var activePanelListItem = getActivePanelListItem();
    var activePanelListItemID = activePanelListItem[0].textContent;
    for(var i = 0; i < this.panels.length; i++){
        if(this.panels[i].id == activePanelListItemID){
            this.switchPanels(i);
            break;
        }
    }
}

/**
    @description Switch panels
    @param {integer} index Panel index to be displayed
*/
Panels.prototype.switchPanels = function(index){
        console.log("switchpanels");
        // Reset Element focus inside panels
        this.currentPanelIndex = index; // set current panel index to new index
        $(this.currentBtn).blur(); // reset current button information for panel switch
	this.currentBtn = null; // reset current button information for panel switch

        // Hide Panel List
        this.isPanelListOn = false;
        $("#panel_list").hide();

        // Show Selected Panel
        $("#panel_container").show();
        for(var i = 0; i < this.panels.length; i++){
		if(i == this.currentPanelIndex){
			$("#" + this.panels[i].id).show();
		}
		else{
			$("#" + this.panels[i].id).hide();
		}
	}
}

/**
    @description Update panel html
    @param {integer} index Panel index to be displayed
    @param {string} html New Html for Panel
*/
Panels.prototype.updatePanels = function(index, html){
	$("#" + this.panels[index].id).html(html);
}

/**
    @description Show panel list
*/
Panels.prototype.showPanelList = function(){
	$("#panel_container").hide();
        $("#panel_list").show();

        this.isPanelListOn = true;
}

/* KEYHANDLING FUNCTIONS */

/**
    @description An array of Keys for Widget Developers to test on the broswer
*/
var KEY_SET = {"OK" : 71, /*g*/
			"BACK" : 86, /*v*/
			"MENU" : 67, /*c*/
			"UP" : 38, /*up*/
			"DOWN" : 40, /*down*/
			"LEFT" : 37, /*left*/
			"RIGHT" : 39, /*right*/
			"ZERO" : 48, /*0*/
			"ONE" : 49, /*1*/
			"TWO" : 50, /*2*/
			"THREE" : 51, /*3*/
			"FOUR" : 52, /*4*/
			"FIVE" : 53, /*5*/
                        "SIX" : 54, /*6*/
			"SEVEN" : 55, /*7*/
			"EIGHT" : 56, /*8*/
			"NINE" : 57, /*9*/
			"SWITCH" : 90 /*z*/
			};


/**
    @description Determine key press event and calls function related to the specific event
    @param {event} e Event
*/
//function keyHandler(e){
Panels.prototype.keyHandler = function(e){
   e.preventDefault();
   console.log("Keyhandler");
   keyId = (window.event) ? event.keyCode : e.keyCode;
   switch(keyId){
	case KEY_SET.OK:
        return this.widgetKeyOK();
        break;
	case KEY_SET.BACK:
        return this.widgetKeyBACK();
        break;
	case KEY_SET.MENU:
        return this.widgetKeyMENU();
        break;
	case KEY_SET.UP:
        return this.widgetKeyUP();
        break;
	case KEY_SET.DOWN:
        return this.widgetKeyDOWN();
        break;
	case KEY_SET.LEFT:
        return this.widgetKeyLEFT();
        break;
	case KEY_SET.RIGHT:
        return this.widgetKeyRIGHT();
        break;
    case KEY_SET.ZERO:
    case KEY_SET.ONE:
    case KEY_SET.TWO:
    case KEY_SET.THREE:
    case KEY_SET.FOUR:
    case KEY_SET.FIVE:
    case KEY_SET.SIX:
    case KEY_SET.SEVEN:
    case KEY_SET.EIGHT:
    case KEY_SET.NINE:
        return this.widgetKeyNUMBER(keyId-48);
        break;
    case KEY_SET.SWITCH: // Back
        return this.widgetKeySWITCH();
        break;
    default:
		console.log("We dont support this these keys");
    }
}

/**
    @description Function for the OK Key
*/
//function widgetKeyOK(){
Panels.prototype.widgetKeyOK = function(){
        // Check if current focus in on Panel List
        if(this.isPanelListOn){
            this.goToActivePanel();
        }
        else{
            // determine what to do depending on current focus element
            if(this.currentBtn != null){
                switch(this.currentBtn[0].id){
                    case "btnProxyDigg":
                            getDiggPopular();
                            break;
                    case "btnCSFNowPlaying":
                            getNowPlayer();
                            break;
                    case "optProxy":
                            if($(this.currentBtn).attr('checked')){
                                $(this.currentBtn).attr('checked', false);
                            }
                            else{
                                $(this.currentBtn).attr('checked', true);
                            }
                            break;
                    case "optCSF":
                            if($(this.currentBtn).attr('checked')){
                                $(this.currentBtn).attr('checked', false);
                            }
                            else{
                                $(this.currentBtn).attr('checked', true);
                            }
                            break;
                    case "btnReset":
                            if($('#optProxy').attr('checked')){
                                updatePanel(0, this.panels[0].html);
                            }
                            if($('#optCSF').attr('checked')){
                                updatePanel(1, this.panels[1].html);
                            }
                            break;
                    default:
                            break;
                }
            }
        }
	return true;
}

/**
    @description Function for the BACK Key
*/
//function widgetKeyBACK(){
Panels.prototype.widgetKeyBACK = function(){
        if(this.isPanelListOn){
            return false; //exit widget
        }
        else{
            this.showPanelList();
            return true; // Show Panel List and do not exit Widget
        }
}

/**
    @description Function for the UP Key
*/
//function widgetKeyUP(){
Panels.prototype.widgetKeyUP = function(){
        if(this.isPanelListOn){
            // call scroll list handler
            scrollingListHandler('up');
        }
        else{
            // traverse through elements
            if((this.currentBtn == null) || (this.currentBtn[0].previousElementSibling == null)){ // check if current button or previous sibling is null
                    var panelId = this.panels[this.currentPanelIndex].id;
                    this.currentBtn = $('#' + panelId + ' .btn1');
                    if(this.currentBtn.length == 0){
                        this.currentBtn = null;
                    }
                    else{
                        $(this.currentBtn).focus();
                    }
            }
            else{ // check if current button has next sibling
                    do{
                            this.currentBtn = $(this.currentBtn).prev();
                            console.log(this.currentBtn[0].tagName);
                            if((this.currentBtn[0].tagName == "BUTTON") || (this.currentBtn[0].tagName == "INPUT")){ // check if element is button if it is then focus
                                    $(this.currentBtn).focus();
                                    break;
                            }
                            if(this.currentBtn[0].previousElementSibling == null) { // if previous element is null then go back to the beginning
                                    var panelId = this.panels[this.currentPanelIndex].id;
                                    this.currentBtn = $('#' + panelId + ' .btn1');
                                    $(this.currentBtn).focus();
                                    break;
                            }
                    } while (this.currentBtn != null)  // check if element is not null
            }
        }
	return true;
}

/**
    @description Function for the DOWN Key
*/
//function widgetKeyDOWN(){
Panels.prototype.widgetKeyDOWN = function(){
        if(this.isPanelListOn){
            scrollingListHandler('down');
        }
        else{
            // traverse through elements
            if((this.currentBtn == null) || (this.currentBtn[0].nextElementSibling == null)){ // check if current button or next sibling is null
                    var panelId = this.panels[this.currentPanelIndex].id;
                    this.currentBtn = $('#' + panelId + ' .btn1');
                    if(this.currentBtn.length == 0){
                        this.currentBtn = null;
                    }
                    else{
                        $(this.currentBtn).focus();
                    }
            }
            else{ // check if current button has next sibling
                    do{
                            this.currentBtn = $(this.currentBtn).next();
                            if((this.currentBtn[0].tagName == "BUTTON") || (this.currentBtn[0].tagName == "INPUT")){ // check if element is button if it is then focus
                                    $(this.currentBtn).focus();
                                    break;
                            }
                            if(this.currentBtn[0].nextElementSibling == null) { // if previous element is null then go back to the beginning
                                    var panelId = this.panels[this.currentPanelIndex].id;
                                    this.currentBtn = $('#' + panelId + ' .btn1');
                                    $(this.currentBtn).focus();
                                    break;
                            }
                    } while (this.currentBtn != null)  // check if element is not null
            }
        }
	return true;
}

/**
    @description Function for the MENU Key
*/
//function widgetKeyMENU(){
Panels.prototype.widgetKeyMENU = function(){
	return false; //exit widget
}

/**
    @description Function for the RIGHT Key
*/
//function widgetKeyRIGHT(){
Panels.prototype.widgetKeyRIGHT = function(){
        if(this.isPanelListOn){

        }
        else{
            // traverse through elements
            if((this.currentBtn == null) || (this.currentBtn[0].previousElementSibling == null)){ // check if current button or previous sibling is null
                    var panelId = this.panels[this.currentPanelIndex].id;
                    this.currentBtn = $('#' + panelId + ' .btn1');
                    if(this.currentBtn.length == 0){
                        this.currentBtn = null;
                    }
                    else{
                        $(this.currentBtn).focus();
                    }
            }
            else{ // check if current button has next sibling
                    do{
                            this.currentBtn = $(this.currentBtn).prev();
                            console.log(this.currentBtn[0].tagName);
                            if((this.currentBtn[0].tagName == "BUTTON") || (this.currentBtn[0].tagName == "INPUT")){ // check if element is button if it is then focus
                                    $(this.currentBtn).focus();
                                    break;
                            }
                            if(this.currentBtn[0].previousElementSibling == null) { // if previous element is null then go back to the beginning
                                    var panelId = this.panels[this.currentPanelIndex].id;
                                    this.currentBtn = $('#' + panelId + ' .btn1');
                                    $(this.currentBtn).focus();
                                    break;
                            }
                    } while (this.currentBtn != null)  // check if element is not null
            }
        }
	return true;
}

/**
    @description Function for the LEFT Key
*/
//function widgetKeyLEFT(){
Panels.prototype.widgetKeyLEFT = function(){
        if(this.isPanelListOn){

        }
        else{
            // traverse through elements
            if((this.currentBtn == null) || (this.currentBtn[0].nextElementSibling == null)){ // check if current button or next sibling is null
                    var panelId = this.panels[this.currentPanelIndex].id;
                    this.currentBtn = $('#' + panelId + ' .btn1');
                    if(this.currentBtn.length == 0){
                        this.currentBtn = null;
                    }
                    else{
                        $(this.currentBtn).focus();
                    }
            }
            else{ // check if current button has next sibling
                    do{
                            this.currentBtn = $(this.currentBtn).next();
                            if((this.currentBtn[0].tagName == "BUTTON") || (this.currentBtn[0].tagName == "INPUT")){ // check if element is button if it is then focus
                                    $(this.currentBtn).focus();
                                    break;
                            }
                            if(this.currentBtn[0].nextElementSibling == null) { // if previous element is null then go back to the beginning
                                    var panelId = this.panels[this.currentPanelIndex].id;
                                    this.currentBtn = $('#' + panelId + ' .btn1');
                                    $(this.currentBtn).focus();
                                    break;
                            }
                    } while (this.currentBtn != null)  // check if element is not null
            }
        }
	return true;
}

/**
    @description Function for the NUMBER Key
*/
//function widgetKeyNUMBER(){
Panels.prototype.widgetKeyNUMBER = function(){

}

/**
    @description Function for the SWITCH Key
*/
//function widgetKeySWITCH(){
Panels.prototype.widgetKeySWITCH = function(){
	currentViewIndex = (currentViewIndex+1)%views.length; // currentViewIndex is defined in switchView.js
	switchView(views[currentViewIndex]); // views[] is defined in switchView.jss
	return true;
}

/* Handles the selecting and scrolling of a unordered list */
function scrollingListHandler(direction) {
	var currentActiveItem = getActivePanelListItem();
	var numItems = $('#panel_list').find('div.btnWrapper').length;
	var btnHeight = $('.btnWrapper').outerHeight() + 10;
    var panelMask = getPanelListMask(); // equivalent to sean's getVideoListMask()
    
    console.log(currentActiveItem);
    console.log(numItems);
    console.log(btnHeight);
    console.log(panelMask);

	/* Set active button */
	if (currentActiveItem == false) { /* init first item */
		$('#panel_list').find('div.btnWrapper').eq(0).addClass("ui-state-hover");

	} else if (direction == "up" && currentActiveItem.closest('li').prev('li').length > 0) { /* previous item */
		$('div.btnWrapper').each(function(index) {$(this).removeClass("ui-state-hover");});
		currentActiveItem.closest('li').prev('li').find('div.btnWrapper').addClass("ui-state-hover");

	} else if (direction == "down" && currentActiveItem.closest('li').next('li').length > 0) { /* next item */
		$('div.btnWrapper').each(function(index) {$(this).removeClass("ui-state-hover");});
		currentActiveItem.closest('li').next('li').find('div.btnWrapper').addClass("ui-state-hover");
	}

	/* Scroll list as needed */
	if (currentActiveItem) {
                // Position of where button's middle is at right now
		var activeBtnMid = currentActiveItem.offset().top + (btnHeight / 2);
                // Position of where Mask's middle is at right now
		var panelListMaskMid = (panelMask.offset().top + (panelMask.innerHeight() / 2));
                // Position of Video list's top
		var panelListTop = getPanelList().offset().top - panelMask.innerHeight() + getPanelList().height();
		
			
		console.log("getPanelList");
        console.log(getPanelList());
        console.log(activeBtnMid);
        console.log(panelListMaskMid);
        console.log(panelListTop);

        // (panelListTop - btnHeight) > 0 :
        // (activeBtnMid - btnHeight) > panelListMaskMid
		if ( (panelListTop - btnHeight) > 0 && (activeBtnMid - btnHeight) > panelListMaskMid )
		{
			/* scroll down */
                        console.log("scroll down");
			getPanelList().offset({top: getPanelList().offset().top - btnHeight, left: getPanelList().offset().left});

		} else if (getPanelList().offset().top < panelMask.offset().top && activeBtnMid + btnHeight < panelListMaskMid )
		{
			/* scroll up */
                        console.log("scroll up");
			getPanelList().offset({top: getPanelList().offset().top + btnHeight, left: getPanelList().offset().left});
		}
	}

	/* Debugging */
	if (getActivePanelListItem()) {
                // (getActivePanelListItem().offset().top + (btnHeight / 2)) : Position of where active button middle
                // (panelMask.offset().top + (panelMask.innerHeight() / 2)) : Position of panel mask middle
		console.log( (getActivePanelListItem().offset().top + (btnHeight / 2)) + ' > ' + (panelMask.offset().top + (panelMask.innerHeight() / 2)) );
	}

}

function getPanelList(){
	return $('#panel_list').find('ul.list');
}


function getPanelListMask() {
	return $('#view');
}

function getActivePanelListItem() {
	var items = $('#panel_list').find('div.btnWrapper.ui-state-hover');
	if (items.length > 0) {
		return items.eq(0);
	} else {
		return false;
	}
}
