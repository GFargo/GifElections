Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}



	// Import Feeds
	Meteor.call('importFeeds', GifElections.Twitter.config.feeds);


	// Fetch New Feed Info
	_.each(GifElections.Twitter.config.feeds, function(feed) {
	    Meteor.call('fetchFeedInfo', feed);
	});


});




Meteor.methods({

	"sendMail": function (options) {
		this.unblock();
		Email.send(options);
	},


});