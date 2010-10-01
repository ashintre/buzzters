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
    
    
    var thisT = this;
	/*this.widgetKeyRIGHT = function(){
	    // move between panels
		alert("in hurrah");
		thisT.currentPanelIndex = (thisT.currentPanelIndex+1)%thisT.panels.length;
		thisT.switchPanels(thisT.currentPanelIndex);
	
		return true;
	}*/
    
}

/* PANELS FUNCTIONS */

/**
    @description Generates panels based on the provided global panel variables
*/
Panels.prototype.generatePanels = function(panels){
        this.panels = panels;
	for(var i = 0; i < this.panels.length; i++){
		var div = "<div id='" + this.panels[i].id + "' class='theme-content'>" + panels[i].html + "</div>";
		document.getElementById('panel_container').innerHTML = document.getElementById('panel_container').innerHTML + div;
	}
}

/**
    @description Switch panels
    @param {integer} index Panel index to be displayed
*/
Panels.prototype.switchPanels = function(index){
	this.currentPanelIndex = index; // set current panel index to new index
        $(this.currentBtn).blur(); // reset current button information for panel switch
	this.currentBtn = null; // reset current button information for panel switch
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
    @description Switch panels
    @param {integer} index Panel index to be displayed
    @param {string} html New Html for Panel
*/
Panels.prototype.updatePanels = function(index, html){
	$("#" + this.panels[index].id).html(html);
}

/* KEYHANDLING FUNCTIONS */

/**
    @description An array of Keys for Widget Developers to test on the broswer
*/
var KEY_SET = {	"OK" : 71, /*g*/
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
	return true;;
}

/**
    @description Function for the BACK Key
*/
//function widgetKeyBACK(){
Panels.prototype.widgetKeyBACK = function(){
	return false; //exit widget
}

/**
    @description Function for the UP Key
*/
//function widgetKeyUP(){
Panels.prototype.widgetKeyUP = function(){

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
	return true;
}

/**
    @description Function for the DOWN Key
*/
//function widgetKeyDOWN(){

Panels.prototype.widgetKeyDOWN = function(){

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
	setActiveElementId($(this.currentBtn).attr('id'));
	return true;
}

/**
    @description Function for the MENU Key
*/
//function widgetKeyMENU(){
Panels.prototype.widgetKeyMENU = function(){
	return true;
}

/**
    @description Function for the RIGHT Key
*/
Panels.prototype.widgetKeyRIGHT = function(){
	    // move between panels
		alert("using thisT");
		thisT.currentPanelIndex = (thisT.currentPanelIndex+1)%thisT.panels.length;
		thisT.switchPanels(thisT.currentPanelIndex);
		/*
		myPanel.currentPanelIndex = (myPanel.currentPanelIndex+1)%myPanel.panels.length;
		myPanel.switchPanels(myPanel.currentPanelIndex); 
		*/
		return true;
}

/**
    @description Function for the LEFT Key
*/
//function widgetKeyLEFT(){
Panels.prototype.widgetKeyLEFT = function(){
	// move between panels
	this.currentPanelIndex = (this.currentPanelIndex == 0) ? (this.panels.length-1) : (this.currentPanelIndex-1);
	this.switchPanels(this.currentPanelIndex);
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

Object.prototype.beget = function () {
	function F() {}
	F.prototype = this;
	return new F();
}