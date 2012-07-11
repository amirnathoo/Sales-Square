function checkin() {
	alert('check in');
}

function loadMap() {
	forge.logging.log('Loading map');
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAlFSCee70OJOiD7k-fz8e6ywXVVIkWErU&gt&sensor=true&callback=mapReady";
	document.body.appendChild(script);
}

function mapReady() {
	forge.logging.log('Map loaded');
	state.mapReady = true;
}

function initMap() {
	forge.geolocation.getCurrentPosition(function(position) {
		forge.logging.log('Location set');
		state.position = position;
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, true);
		var myOptions = {
			zoom: 15,
			center: latLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		state.map = new google.maps.Map($('#two').get(0), myOptions);
		google.maps.event.trigger(state.map, 'resize');
		state.map.setCenter(latLng);
		
		//TODO: remove old location market
		forge.tools.getURL('img/blue-pin.png', function(src) {
			new google.maps.Marker({
				position: latLng,
				title: "Current Position",
				icon: src,
				map: state.map,
				zIndex: -1
			});
		});
		
	});
}

var state = {
	position: null,
	map: null,
	mapReady: false
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
	checkin();
});

$(document).bind('pageinit', function() {
	loadMap();
});

$(document).bind('pagechange', function() {
	if (state.mapReady) {
		initMap();
	} else {
		loadMap();
	}
});



