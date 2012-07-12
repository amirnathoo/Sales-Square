var state = {
	token: ""
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

$(document).bind('pagechange', function() {
	if (map.init) {
		map.refreshMap();
	} else {
		map.loadMap();
	}	
	
	forge.topbar.removeButtons();
	if (location.hash =="#three") {
		forge.topbar.addButton({
			text: "Back",
			position: "left",
			type: "back"
		});
		forge.topbar.addButton({
			text: "Next",
			position: "right"
		}, function() {
			location.hash = "#four";
			forge.topbar.setTitle('Select Opportunity')
		});
	}
	
	if (location.hash =="#four") {
		forge.topbar.addButton({
			text: "Back",
			position: "left",
			type: "back"
		});
		forge.topbar.addButton({
			text: "Next",
			position: "right"
		}, function() {
			location.hash = "#five";
		});
	}
});


