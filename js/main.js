var state = {
	token: "",
	identity: null,
	opportunities: null,
	position: null,
	location: "",
	mapButton: null
}

forge.tabbar.addButton({
	icon: "img/tick.png",
	text: "Check In",
	index: 0
}, function(button) {
	button.setActive();
	button.onPressed.addListener(function () {
		location.hash = "#one";
		forge.topbar.setTitle("Sales Square");
	});
});

forge.tabbar.addButton({
	icon: "img/map.png",
	text: "Map",
	index: 1
}, function(button) {
	state.mapButton = button;
	button.onPressed.addListener(function () {
		location.hash = "#two";
		forge.topbar.setTitle("Team Check Ins");
	});
});

/* init */
$('#checkin').live('tap', function() {
	if (state.token) {
		location.hash = "#three";
		forge.topbar.setTitle('Confirm Location');
	} else {
		salesforce.login();
	}
});

$('ul li a').live('tap', function() {
	var opp = $(this).html();
	forge.file.getImage(function(file) {
		salesforce.post(state.identity.display_name + " is at " + state.location + " working on " + opp, file);
		map.addCheckin($(this).html(), state.position, state.identity.display_name);
		location.hash = "#two";
		state.mapButton.setActive()
	});
});

$(document).bind('pagechange', function() {
	if (map.init) {
		map.refreshMap();
	} else {
		map.loadMap();
	}	
	
	forge.topbar.removeButtons();
	
	if (location.hash == "#three") {
		forge.topbar.addButton({
			text: "Back",
			position: "left"
		}, function() {
			location.hash = "#one";
			forge.topbar.setTitle('Sales Square');
		});
		forge.topbar.addButton({
			text: "Next",
			position: "right"
		}, function() {
			location.hash = "#four";
			forge.topbar.setTitle('Select Opportunity');
		});
	}
	
	if (location.hash =="#four") {
		forge.topbar.addButton({
			text: "Back",
			position: "left"
		}, function() {
			location.hash = "#one";
			forge.topbar.setTitle('Sales Square');
		});
		
		$('ul').listview();
		$('li').remove();
		for (opp in state.opportunities) {
			$('ul').append('<li><a href="#">'+state.opportunities[opp].Name+'</a></li>')
		}
		
		$('ul').listview('refresh');
	}
});




