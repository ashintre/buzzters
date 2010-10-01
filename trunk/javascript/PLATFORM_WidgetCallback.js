function widgetKeystrokeCallback(iframeid, keyId){

    switch(keyId){

        case platform.WIDGET_KEY_SET_REMOTE.OK: // G
        case platform.WIDGET_KEY_SET_KEYBOARD.OK:
            if(iframeid.contentWindow.widgetKeyOK){
                return iframeid.contentWindow.widgetKeyOK();
            }
            // search in the key press registry for the callback function given iframeid, element_id, key
            // each widget will have to implement a function that returns the current active element's id
            var function_OK = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.OK);
            if(function_OK){
                return iframeid.contentWindow.keyHandler(function_OK);
            }
            return    iframeid.contentWindow.PLATFORM_widgetKeyOK();

        case platform.WIDGET_KEY_SET_KEYBOARD.RIGHT:
        case platform.WIDGET_KEY_SET_REMOTE.RIGHT:
            if(iframeid.contentWindow.widgetKeyRIGHT){
                return iframeid.contentWindow.widgetKeyRIGHT();
            }
            var function_RIGHT = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.RIGHT);
            if(function_RIGHT){
                return iframeid.contentWindow.keyHandler(function_RIGHT);
            }
            return    iframeid.contentWindow.PLATFORM_widgetKeyRIGHT();

        case platform.WIDGET_KEY_SET_KEYBOARD.LEFT:
        case platform.WIDGET_KEY_SET_REMOTE.LEFT:
                    if(iframeid.contentWindow.widgetKeyLEFT){
                        return iframeid.contentWindow.widgetKeyLEFT();
                        //$(document).trigger({type:"keypress", key: 'LEFT'});
                        //return true;
                    }
                    var function_LEFT = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.LEFT);
                    if(function_LEFT){
                        return iframeid.contentWindow.keyHandler(function_LEFT);
                    }
                    return    iframeid.contentWindow.PLATFORM_widgetKeyLEFT();
                    //return false;

        case platform.WIDGET_KEY_SET_KEYBOARD.UP: // T
        case platform.WIDGET_KEY_SET_REMOTE.UP:
                    if(iframeid.contentWindow.widgetKeyUP){
                        return iframeid.contentWindow.widgetKeyUP();
                        //$(iframeid).trigger({type:"keypress", key: 'UP'});
                        //return true;
                    }
                    var function_UP = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.UP);
                    if(function_UP){
                        return iframeid.contentWindow.keyHandler(function_UP);
                    }
                    return    iframeid.contentWindow.PLATFORM_widgetKeyUP();
                    //return false;

        case platform.WIDGET_KEY_SET_KEYBOARD.DOWN: //
        case platform.WIDGET_KEY_SET_REMOTE.DOWN:
                    if(iframeid.contentWindow.widgetKeyDOWN){
                        return iframeid.contentWindow.widgetKeyDOWN();
                        //console.log("widget callback document="+document);
                        //$(iframeid).contents().trigger({type:"keypress", key: 'DOWN'});
                        return true;
                    }
                    var function_DOWN = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.DOWN);
                    if(function_DOWN){
                        return iframeid.contentWindow.keyHandler(function_DOWN);
                    }
                    return    iframeid.contentWindow.PLATFORM_widgetKeyDOWN();



        case platform.WIDGET_KEY_SET_KEYBOARD.MENU: // C
        case platform.WIDGET_KEY_SET_REMOTE.MENU:
                    if(iframeid.contentWindow.widgetKeyMENU){
                        return iframeid.contentWindow.widgetKeyMENU();
                    }
                    var function_MENU = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.MENU);
                    if(function_MENU){
                        return iframeid.contentWindow.keyHandler(function_MENU);
                    }
                    return false;

        case platform.WIDGET_KEY_SET_KEYBOARD.BACK: // Back
        case platform.WIDGET_KEY_SET_REMOTE.BACK:
                    if(iframeid.contentWindow.widgetKeyBACK){
                        return iframeid.contentWindow.widgetKeyBACK();
                    }
                    var function_BACK = searchRegistry(iframeid, iframeid.contentWindow.getActiveElementId(), platform.WIDGET_KEY_SET_KEYBOARD.BACK);
                    if(function_BACK){
                        return iframeid.contentWindow.keyHandler(function_BACK);
                    }
                    return iframeid.contentWindow.PLATFORM_widgetKeyBACK();
                    //return false;


                case platform.WIDGET_KEY_SET_REMOTE.ZERO:
                case platform.WIDGET_KEY_SET_KEYBOARD.ZERO:

                case platform.WIDGET_KEY_SET_REMOTE.ONE:
                case platform.WIDGET_KEY_SET_KEYBOARD.ONE:

                case platform.WIDGET_KEY_SET_REMOTE.TWO:
                case platform.WIDGET_KEY_SET_KEYBOARD.TWO:

                case platform.WIDGET_KEY_SET_REMOTE.THREE:
                case platform.WIDGET_KEY_SET_KEYBOARD.THREE:

                case platform.WIDGET_KEY_SET_REMOTE.FOUR:
                case platform.WIDGET_KEY_SET_KEYBOARD.FOUR:

                case platform.WIDGET_KEY_SET_REMOTE.FIVE:
                case platform.WIDGET_KEY_SET_KEYBOARD.FIVE:

                case platform.WIDGET_KEY_SET_REMOTE.SIX:
                case platform.WIDGET_KEY_SET_KEYBOARD.SIX:

                case platform.WIDGET_KEY_SET_REMOTE.SEVEN:
                case platform.WIDGET_KEY_SET_KEYBOARD.SEVEN:

                case platform.WIDGET_KEY_SET_REMOTE.EIGHT:
                case platform.WIDGET_KEY_SET_KEYBOARD.EIGHT:

                case platform.WIDGET_KEY_SET_REMOTE.NINE:
                case platform.WIDGET_KEY_SET_KEYBOARD.NINE:
                    if(iframeid.contentWindow.widgetKeyNUMBER){
                       return iframeid.contentWindow.widgetKeyNUMBER(keyId-48);
                    }
                    else
                         return    iframeid.contentWindow.PLATFORM_widgetKeyNUMBER(keyId-48,getTextKeyFlag());

                    return false;

    }
}
