var themeWidgetsList = new Array();

function updateTheme(themeName){
    console.log("updateTheme: " + themeName);
    $('.widget_header').addClass('theme-header theme-corner-top theme-header-font');
    var customCSS = "./../../jquery/" + themeName + "/css/custom-theme/jquery-ui-1.8.2.custom.css";
    var minJS = "./../../jquery/" + themeName + "/js/jquery-1.4.2.min.js";
    var uiMinJS = "./../../jquery/" + themeName + "/js/jquery-ui-1.8.2.custom.min.js";
    // Update Widget Jquery
    $("#customCSS").attr("href", customCSS);
    $("#minJS").attr("src",  minJS);
    $("#uiMinJS").attr("src", uiMinJS);

    // update new Theme to Widgets that registered for theme
    pushTheme2Widgets();
}

function updateThemeWidgetList(widgetID){
    console.log("registerThemeWidget");
    themeWidgetsList.push(widgetID);
}

function pushTheme2Widgets(){
    for(var i = 0; i < themeWidgetsList.length; i++){
        console.log(themeWidgetsList[i])
        var iframeid = document.getElementById(themeWidgetsList[i]);
        iframeid.contentWindow.updateOUXTheme();
    }          
}