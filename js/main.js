var state = {
	token: "",
	identity: null,
	opportunities: null,
	position: null,
	location: "",
	mapButton: null
}

function subscribe() {
	forge.partners.parse.push.subscribe('C'+state.identity.organization_id, function() {
		forge.logging.log('Successfully subscribed for push notifications');
	}, function(err) {
		forge.logging.error("Couldn't subscribe for push notifications: "+JSON.stringify(err));
	});
}

$.fx.off = true;
forge.topbar.setTint([10,49,115,255]);
forge.tabbar.setActiveTint([10,49,115,255]);

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
		forge.topbar.setTitle('Confirm Loction');
	} else {
		salesforce.login();
	}
});

$('ul li a').live('tap', function() {
	var opp = $(this).html();
	forge.file.getImage(function(file) {
		var msg = state.identity.display_name + " is at " + state.location + " working on " + opp;
		salesforce.post(msg, file);
		map.addCheckin(opp, state.position.coords.latitude, state.position.coords.longitude, state.identity.display_name);
		forge.logging.log('Creating push notification');
		forge.request.ajax({
			url: "https://api.parse.com/1/push",
			type: "POST",
			headers: {
				"X-Parse-Application-Id": "iMgpKcdRI0ZhgF6WFv0CAecOPVViY3AoZxoBO8Fu",
				"X-Parse-REST-API-Key": "RQXuUnxt94JwIUeV9VX4tbCE5o8gaMnE6nPRvlnT"
			},
			contentType: "application/json",
			dataType: 'json',
			data: JSON.stringify({
				channel: 'C'+state.identity.organization_id,
				data: {
					alert: msg,
					badge: 1,
					opp: opp,
					lat: state.position.coords.latitude,
					lng: state.position.coords.longitude,
					name: state.identity.display_name
				}
			}),
			success: function() {
				forge.logging.log('Successfully created notification!');
			}, 
			error: function(err) {
				forge.logging.log('Error creating notification:');
				forge.logging.log(err);
			}
		});
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

forge.event.messagePushed.addListener(function (msg) {
    forge.logging.log("Received push message:");
	forge.logging.log(msg);
	map.addCheckin(msg.opp, msg.lat, msg.lng, msg.name);
	subscribe();
});







