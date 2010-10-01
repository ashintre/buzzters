/**
@description Creates a set of checkboxe from a specified array
* @param array
* @param array.html html to be appended with the checkbox
* @param array.selected true if the initial state of checkbox is checked
* @param array.id id of the checkbox element
* @param array.callback function to be called when the input element changes - "change" event is triggered
* @param array.appendTo id of the DOM element to which this array of sliding checkbox items will be appended
*/

function createSlidingCheckboxes(array){
	
	var initial_state = "off";
	var options, spanElement;
	var checkboxhtml;  
    for(var i in array){
    	options = {
        		switch_container_src: 'images/bpm-frame.gif',
        		class_container: 'iCheckbox_two_container',
        		class_switch: 'iCheckbox_two_switch',
        		class_checkbox: 'iCheckbox_two_checkbox',
        		switch_speed: 450,
        		switch_swing: -18,
        		checkbox_hide: true
    	};
    	initial_state = array[i].selected;
    	checkboxhtml = "<input type='checkbox' id='"+array[i].id+"' style='display: none; '/>";
    	addElementToDOM(checkboxhtml, array[i].appendTo);
    	$('#'+array[i].id).iCheckbox( initial_state, options );
    	console.log(array[i].html);
    	spanElement = $('#'+array[i].id).parents('.iCheckbox_two_container')[0];
    	//spanElement = $('.iCheckbox_two_container').get(i);
    	$(spanElement).append(array[i].html + "<br/>");
    	$(spanElement).addClass("navigationClass");
    	spanElement.id = "span_"+array[i].id;
    	$(spanElement).attr('elementtype','checkboxoptions');
    	
    	$('#'+array[i].id).bind('change',array[i].callback);
    	
    	/*$('#'+array[i].id).change(function(e){
			//callOptionsChanged(array[i].callback,e);
    		array[i].callback(e);
			});*/
}
}


function keyNavigationElementHandler_checkboxoptions(activeElementId, key){
	/*
	 * activeElementId is the span's id
	 * find the image child of this id
	 * trigger the click event of this image
	 */

	var childImage = $("#"+activeElementId).children('.iCheckbox_two_switch')[0];
	$(childImage).trigger('click');
	
	var index = activeElementId.lastIndexOf("span_");
	var checkBoxId = activeElementId.substring(index+5);
	//$('#'+checkBoxId).change();
	
	return true;
}
