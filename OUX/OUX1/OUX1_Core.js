/**
	Creates a new OUX object
	@constructor
    @description This class object is implement by OUX Developer. 
	@property {array} layouts The layouts of this OUX object.
	@property {array} themes The themes of this OUX object.
*/
OUX = function(){
    this.layouts = new Layout();
    this.themes = {};
    // added by nadu
    //this.channels = getChannelList();//{}
    //this.currentChannelIndex = 0;
}

/**
    @description Initiatlizes a set of OUX functions. This is the first function called by the Platform to load and start OUX functions.
*/
OUX.init = function(){
     startOUXLoad();  /* In OUX_LayoutManagement.js */
}
/*
OUX.prototype.getCurrentChannelIndex = function() {
  return this.currentChannelIndex;
}

OUX.prototype.setCurrentChannelIndex = function(index) {
  this.currentChannelIndex = index;
}
 */