/**
 * @description Creates list items with a radio button or checkbox input element
 * @param array
 * @param array.listItemClass css class of the <li> element
 * @param array.listItemId id of the <li> element
 * @param array.id id of the <input> element
 * @param array.type type of the <input> element radio/checkbox
 * @param array.callback function to be called when the input element changes - "change" event is triggered
 * @param appendTo id of the DOM element to which this array of list items will be appended
 */

function createInputListItems(array){
	var htmlStr = "";
	var i;
	for(i=0;i<array.length;i++){
		 htmlStr = "<li class='navigationClass listItem"+array[i].listItemClass+"' id = '"+array[i].listItemId+"' elementtype='inputlistitem'><input type='"+array[i].type+"' id = '"+array[i].id+"'/>"+array[i].html+"</li>";
		 $('#'+array[i].appendElementId).append(htmlStr);
		 $('#'+array[i].id).bind('change',array[i].callback);
	 }
	 
	 console.log(array[0].id);
	 //$('#'+array[0].id).trigger('selected');
}

function keyNavigationElementHandler_inputlistitem(activeElementId, key){
	var inputElement = $('#'+activeElementId).find('input')[0];
	if($('#'+inputElement.id).attr('checked') === true){
		$('#'+inputElement.id).attr('checked', false);
	}
	else{
		$('#'+inputElement.id).attr('checked', true);
	}
	
	$('#'+inputElement.id).trigger('change');
	return true;
}

