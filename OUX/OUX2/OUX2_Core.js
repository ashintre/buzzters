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
}

/**
    @description Initiatlizes a set of OUX functions. This is the first function called by the Platform to load and start OUX functions.
*/
OUX.init = function(){
     startOUXLoad();
}
