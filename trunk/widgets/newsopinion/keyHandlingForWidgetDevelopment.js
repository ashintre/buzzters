/* The below enum variable represents key board keys */
/* "OK" : g
"UP" : UP arrow
"DOWN" : DOWN arrow
"LEFT" : Left arrow key
"RIGHT" : Right arrow key
"BACK" : v
"MENU" : c
        "Loop through Views" - z
        Number Keys are normal number keys on the keyboard
*/



KEY_SET = {"OK" : 71, "UP" : 38, "DOWN" : 40, "LEFT" : 37, "RIGHT" : 39, "BACK" : 86, "MENU" : 67,"ZERO":48, "ONE":49, "TWO":50, "THREE":51, "FOUR":52, "FIVE":53,
                                "SIX":54, "SEVEN":55, "EIGHT":56, "NINE":57, "SWITCH" : 90};


/**
Start for testing SwitchView Function! Loops through all the views
*/


var currentViewIndex = 0;
var views = new Array("icon", "regular", "ticker", "small");


/**
End for testing SwitchView Function
*/

document.onkeydown = keyHandler;

function keyHandler(e){
   
   
   /*   comment e.preventDefault() this line if you want the browser to do the key handling. This option is not available currently in the Widget platform
        so you will have to handle all the key press events yourself
    * 
    */
   e.preventDefault();
   keyId = (window.event) ? event.keyCode : e.keyCode;
   switch(keyId){


         case KEY_SET.OK:
                    return widgetKeyOK();
                    break;

         case KEY_SET.RIGHT:
                    return widgetKeyRIGHT();
                    break;

          case KEY_SET.LEFT:
                    return widgetKeyLEFT();
                    break;

          case KEY_SET.UP:
                    return widgetKeyUP();
                    break;

          case KEY_SET.DOWN: //
                    return widgetKeyDOWN();
                    break;

          case KEY_SET.MENU:
                    return widgetKeyMENU();
                    break;

          case KEY_SET.BACK: // Back
                    return widgetKeyBACK();
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

                    return widgetKeyNUMBER(keyId-48);
                    break;

            case KEY_SET.SWITCH:
                    currentViewIndex = (currentViewIndex + 1)%4;
                    switchView(views[currentViewIndex]);
                    break;

                default:
                    console.log("We dont support this these keys");

    }
}