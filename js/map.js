var map = {
	init: false,
	checkins: null,

	loadMap: function() {
		forge.logging.log('Loading map');
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAlFSCee70OJOiD7k-fz8e6ywXVVIkWErU&gt&sensor=true&callback=map.mapReady";
		document.body.appendChild(script);
		
		forge.prefs.get('checkins', function(checkins) {
			map.checkins = JSON.parse(checkins) || {};
		})
	},

	mapReady: function() {
		forge.logging.log('Map loaded');
		map.init = true;
		map.initMap();
	},

	initMap: function() {
		forge.geolocation.getCurrentPosition(function(position) {
			forge.logging.log('Position set');
			state.position = position;
			
			map.getLocation(position.coords);
		
			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, true);
			var myOptions = {
				zoom: 12,
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
			
			for (ci in map.checkins) {
				map.addCheckin(map.checkins[ci].opp, map.checkins[ci].lat, map.checkins[ci].lng, map.checkins[ci].name);
			}
		});
	},

	refreshMap: function() {
		forge.geolocation.getCurrentPosition(function(position) {
			forge.logging.log('Position set');
			state.position = position;
		
			var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, true);
		
			google.maps.event.trigger(map.gmap1, 'resize');
			google.maps.event.trigger(map.gmap2, 'resize');
			map.gmap1.setCenter(latLng);
			map.gmap2.setCenter(latLng);
			map.marker.setPosition(latLng);
			map.marker2.setPosition(latLng);
		});
	},
	
	getLocation: function(coords, cb) {
		forge.request.ajax({
			url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+coords.latitude+","+coords.longitude+"&sensor=true",
			dataType: "json",
			success: function(response) {
				if (cb) {
					cb(response.results[0].formatted_address);
				} else {
					state.location = response.results[0].formatted_address;
					forge.logging.log('Location set: '+state.location);
				}
			},
			error: function(response) {
				forge.logging.log('ERROR getting location, response:');
				forge.logging.log(response);
			}
		});
	},
	
	addCheckin: function(opp, lat, lng, name) {
		forge.logging.log('Adding checkin to map');
		
		var latLng = new google.maps.LatLng(lat, lng, true);

		if (map.checkins[name] && map.checkins[name].marker) {
			map.checkins[name].marker.setPosition(latLng);
		} else {
			map.checkins[name] = {};	
			map.checkins[name].marker = new google.maps.Marker({
				position: latLng,
				title: name,
				map: map.gmap2
			});

			google.maps.event.addListener(map.checkins[name].marker, 'click', function() {
				if (map.checkins[name].infowindowopen) {
					map.checkins[name].infowindow.close();
				} else {
					map.checkins[name].infowindow.open(map.gmap2, map.checkins[name].marker);
				}
				map.checkins[name].infowindowopen = !map.checkins[name].infowindowopen;
			});
		}
		
		map.checkins[name].content = name + " is working on "+opp;
		map.checkins[name].infowindow = new google.maps.InfoWindow({
			content: map.checkins[name].content
		});
		map.checkins[name].opp = opp;
		map.checkins[name].lat = lat;
		map.checkins[name].lng = lng;
		map.checkins[name].name = name;
		
		var obj = {};
		for (var ci in map.checkins) {
			obj[ci] = {};
			obj[ci].name = map.checkins[ci].name;
			obj[ci].opp = map.checkins[ci].opp;
			obj[ci].lat = map.checkins[ci].lat;
			obj[ci].lng = map.checkins[ci].lng;
		}
		
		forge.prefs.set('checkins', JSON.stringify(obj));
	}
}

map.loadMap();