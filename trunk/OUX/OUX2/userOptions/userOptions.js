function init(){
	activateJQuery();
	createWidgetPanel();
	createThemePanel();
	createSettingPanel();
}

function activateJQuery(){
	// Tabs
	$('#tabs').tabs();
}
				
function createWidgetPanel(){
	var html = "<div class='widgets_container' id='widgets_active'><div class='widgets_title'>Active</div><div class='widgets_content'></div></div>";
	html = html + "<div class='widgets_container' id='widgets_inactive'><div class='widgets_title'>Inactive</div><div class='widgets_content'></div></div>";
	html = html + "<div class='widgets_container' id='widgets_available'><div class='widgets_title'>Available</div><div class='widgets_content'></div></div>"; 
	$('#widget_panel').html(html);	
	
	getActiveWidgets();
	getInactiveWidgets();
	getAvailableWidgets();
}

function createThemePanel(){
	var html = "<div class='themes_container' id='themes_select'></div>";
	html = html + "<div class='themes_container' id='themes_preview'></div>";
	$('#theme_panel').html(html);	
}

function createSettingPanel(){
	var html = "<div class='setting_container'></div>";
	$('#setting_panel').html(html);
}

function getActiveWidgets(){

}

function getInactiveWidgets(){

}

function getAvailableWidgets(){

}

