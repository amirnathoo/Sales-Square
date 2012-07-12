var map = {
	init: false,

	loadMap: function() {
		forge.logging.log('Loading map');
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAlFSCee70OJOiD7k-fz8e6ywXVVIkWErU&gt&sensor=true&callback=map.mapReady";
		document.body.appendChild(script);
	},

	mapReady: function() {
		forge.logging.log('Map loaded');
		map.gmap1Ready = true;
		map.initMap();
	},

	initMap: function() {
		forge.geolocation.getCurrentPosition(function(position) {
			forge.logging.log('Location set');
		
			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, true);
			var myOptions = {
				zoom: 15,
				center: latLng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		
			map.gmap1 = new google.maps.Map($('#three').get(0), myOptions);
			map.gmap2 = new google.maps.Map($('#two').get(0), myOptions);
		
			forge.tools.getURL('img/blue-pin.png', function(src) {
				map.marker = new google.maps.Marker({
					position: latLng,
					title: "Current Position",
					icon: src,
					map: map.gmap1,
					zIndex: -1
				});
				map.marker2 = new google.maps.Marker({
					position: latLng,
					title: "Current Position",
					icon: src,
					map: map.gmap2,
					zIndex: -1
				});
			});
		});
	},

	refreshMap: function() {
		forge.geolocation.getCurrentPosition(function(position) {
			forge.logging.log('Location set');
		
			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, true);
		
			google.maps.event.trigger(map.gmap1, 'resize');
			google.maps.event.trigger(map.gmap2, 'resize');
			map.gmap1.setCenter(latLng);
			map.gmap2.setCenter(latLng);
			map.marker.setPosition(latLng);
			map.marker2.setPosition(latLng);
		});
	}
}

map.loadMap();