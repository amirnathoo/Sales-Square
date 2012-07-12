var salesforce = {
	consumer_key: "3MVG9y6x0357HledXTja.viKSYW0gEMrDKbD6pf.AoDYMgQdxNAUAMdC6ra2TdamileUqZWSodRyqTdgJIAZH",
	consumer_secret: "1325734187136715755",
	
	login: function() {
		forge.tabs.openWithOptions({
			url: "https://login.salesforce.com/services/oauth2/authorize?client_id=" + salesforce.consumer_key + "&response_type=token&redirect_uri="+encodeURIComponent("https://login.salesforce.com/services/oauth2/success"),
			pattern: "https://login.salesforce.com/services/oauth2/succ*",
			title: "Salesforce Login"	
		}, function(data) {
			state.token = data.url.split('#')[1].split('&')[0];
			forge.prefs.set('token', state.token);
		});
	}
}

forge.prefs.get('token', function(token) {
	if (token) {
		state.token = token;
	} else {
		salesforce.login();
	}
});