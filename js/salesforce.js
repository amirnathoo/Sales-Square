//TODO Implement refresh token otherwise this will stop working a while after initial oauth
var salesforce = {
	consumer_key: "3MVG9y6x0357HledXTja.viKSYW0gEMrDKbD6pf.AoDYMgQdxNAUAMdC6ra2TdamileUqZWSodRyqTdgJIAZH",
	
	login: function() {
		forge.tabs.openWithOptions({
			url: "https://login.salesforce.com/services/oauth2/authorize?client_id=" + salesforce.consumer_key + "&display=touch&response_type=token&redirect_uri="+encodeURIComponent("https://login.salesforce.com/services/oauth2/success"),
			pattern: "https://login.salesforce.com/services/oauth2/succ*",
			title: "Salesforce Login",
			tint: [10,49,115,255],
			buttonTint: [10,49,115,255]
		}, function(data) {
			state.token = decodeURIComponent(data.url.split('#access_token=')[1].split('&')[0]);
			forge.prefs.set('token', state.token); 
			salesforce.getIdentity(decodeURIComponent(data.url.split('&id=')[1].split('&')[0]));
		});
	},
	
	getIdentity: function(url) {
		forge.request.ajax({
			url: url,
			type: "POST",
			data: {
				"version": "latest",
				"format": "json",
				"oauth_token": state.token
			},
			headers: {
                "Authorization": "OAuth "+ state.token
            },
			success: function (data) {
				if (typeof data == "string") {
					data = JSON.parse(data);
				}
				state.identity = data;
				forge.prefs.set('identity', JSON.stringify(state.identity)); 
				salesforce.getOpportunities();
			},
			error: function(data) {
				forge.logging.log('Error getting identity');
				forge.logging.log(data);
			}
		});
	},
	
	getOpportunities: function() {
		forge.request.ajax({
			url : state.identity.urls.query.replace("{version}", "24.0") + "?q=" + encodeURI("SELECT Name FROM Opportunity where StageName='Prospecting' or StageName='Qualification'"),
			headers : {
				'Authorization' : 'OAuth ' + state.token
			},
			contentType: "application/json",
			success : function(response) {
				if (typeof response == "string") {
					response = JSON.parse(response);
				}
				if(response && response.records) {
					var data = response.records;
				}
				state.opportunities = data;
			},
			error: function(data) {
				forge.logging.log('Error getting opportunities');
				forge.logging.log(data);
				forge.prefs.set('token', '');
				delete state.token;
				delete state.identity;
			}
		});
	},
	
	post: function(msg, file) {
		forge.request.ajax({
			url : state.identity.urls.feeds.replace("{version}", "25.0") + "/news/"+state.identity.user_id+"/feed-items",
			type: "POST",
			headers : {
				'Authorization' : 'OAuth ' + state.token
			},
			data: {
				"type": "Text",
				"text": msg
			},
			success : function(response) {
				forge.logging.log('Success posting: '+msg)
			},
			error: function(data) {
				forge.logging.log('ERROR posting');
				forge.logging.log(data);
			}
		});
	}
}

forge.prefs.get('token', function(token) {
	forge.prefs.get('identity', function(identity) {
		if (token && identity) {
			state.token = token;
			state.identity = JSON.parse(identity);
			salesforce.getOpportunities();
		} else {
			salesforce.login();
		}
	});
});