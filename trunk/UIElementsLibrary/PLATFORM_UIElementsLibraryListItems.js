/**
    @description Creates an unordered list with the given properties and adds it to the DOM structure.
    @param {String} listType type of the list to be created-  unordered, ordered
    @param {String} cssClassString class names concatenated in a string
    @param {String} id id of the list to be created
    @param {String} inputType the type of input element element to be used in the list items - not used currently
    @param {String} appendId id of the element to which the list needs to be appended
*/
function createList(listType, cssClassString, id, inputType, appendId){
    // property elementtype is set to list
    var list = "<ul id='"+id+"' class='"+cssClassString+"' listtype='"+listType+"' elementtype='list'></ul>";
    addElementToDOM(list, appendId);
}
/**
    @description Creates a list item with the given properties and adds it to the DOM structure. id of the list item = idParentList+"_li_"+index. An extra class - navigationClass is added for identification that the element is "navigable"
    @param {String} idParentList id of the parent list to which the list item needs to be added
    @param {String} cssClassString class names concatenated in a string
    @param {String} index index of the list item to be created
    @param {String} html the html content in the list item
*/

function createListItem(idParentList, id, cssClassString, index, html){

    var listItemClass = cssClassString+ " "+ id + " navigationClass";
    var indexProperty = idParentList+"_li_"+index;
    // property elementtype is set to listitem
    var listItem = "<li id='"+id+"' class='"+listItemClass+"' index='"+indexProperty+"' elementtype='listitem'>"+html+"</li>";
   
    addElementToDOM(listItem, idParentList);
}

function keyNavigationElementHandler_LI(activeElementId, key){

    var indexStr = $('#'+activeElementId).attr('index');//activeElementId.lastIndexOf("_li_");
    var index = indexStr.lastIndexOf("_li_");
    var listItemIndex = indexStr.substring(index+4);
    listItemIndex = parseInt(listItemIndex);


    switch(key){
        case "UP":

        var x = $("#"+activeElementId);
        if(listItemIndex == 0){
            // remove class from current active element
            // get the first ancestral element that has the navigation class
            // add class to the new active element
            // set the new active element

            $("#"+activeElementId).removeClass(getActiveClass());

            // x is the current active element 
            // find parent of the current active element
            // There might be navigable elements inside the siblings of the parent - if yes then go ahead - search for the navigable element
            // if x's parent has no siblings - then go to parent of the parent of x -
            // if "panel" then go to the "ul" element and then highlight the tab

            var findParent = $(x).parent().get(0);
            var uncles = $(findParent).prevAll();
            var t;
            var elementAbove;
            //$(uncles).each(function(ind){
            for(var j=0;j<uncles.length;j++){
                t = uncles.get(j);
                if($(t).hasClass("navigationClass")){
                    elementAbove = t;
                    break;
                }
                else if($(t).find(".navigationClass").get(-1) != undefined){
                    elementAbove = $(t).find(".navigationClass").get(-1);
                    break;
                }
                else{
                    elementAbove = null;
                }
            }
            if(elementAbove == null){
                // this means that there is no other navigable element above the list
                // so move to the tab
                // uncles ka baap ka id, then based on that search inside tabs_ul_class for a li with class = ui-tabs-selected ui-state-active
                //var tab_id = $(uncles).parent().get(0).id;
                var tab_ul = $(".tabs_ul_class");
                var tab_li = $(tab_ul).children(".ui-tabs-selected");
                elementAbove = tab_li[0];
            }

            if(elementAbove.id != undefined){
                var newActiveElementId = elementAbove.id;
                setActiveElementId(newActiveElementId);
                $("#"+newActiveElementId).addClass(getActiveClass());
            }
            return true;
        }
        else{
            //remove class from current active element
            // add class to the new active element
            // set the new active element
            $("#"+activeElementId).removeClass(getActiveClass());
            //$("li[uniqueid="+activeElementId+"]").removeClass(getActiveClass());

            //var newActiveElementId = activeElementId.slice(0,index+4)+(listItemIndex-1);
            var newActiveElement = $(x).prev();
            var newActiveElementId = newActiveElement[0].id;

            //$("li[uniqueid="+newActiveElementId+"]").addClass(getActiveClass());
            setActiveElementId(newActiveElementId);
            $("#"+newActiveElementId).addClass(getActiveClass());
            
            return true;
        }
        break;

        case "DOWN":
            var newActiveElementId;
            var x = $("#"+activeElementId)[0];
            var length_of_list = $("#"+activeElementId).siblings().length;
            var tmp = $("#"+activeElementId).siblings();
            if(listItemIndex == length_of_list){
                var findParent = $(x).parent().get(0);
                var uncles = $(findParent).nextAll();
                var elementBelow;
                for(var j=0;j<uncles.length;j++){
                    t = uncles.get(j);
                    if($(t).hasClass("navigationClass")){
                        elementBelow = t;
                        break;
                    }
                    else if($(t).find(".navigationClass")[0] != undefined){
                        elementBelow = $(t).find(".navigationClass")[0];
                        break;
                    }
                    else{
                        elementBelow = null;
                    }
                }
                if(elementBelow == null){
                    newActiveElementId = activeElementId;
                }
                else{
                    newActiveElementId = elementBelow.id;
                }
            }
            else{
                //newActiveElementId = activeElementId.slice(0,index+4)+(listItemIndex+1);
                var newActiveElement = $(x).next();
                newActiveElementId = newActiveElement[0].id;
            }

            $("#"+activeElementId).removeClass(getActiveClass());
            //var newActiveElementId = activeElementId.slice(0,index+4)+(listItemIndex+1);
            setActiveElementId(newActiveElementId);
            $("#"+newActiveElementId).addClass(getActiveClass());
            return true;

            break;

        default:
            return true;

    }
}