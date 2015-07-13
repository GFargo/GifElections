Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	var TwitterConf = JSON.parse(Assets.getText('twitter.json'));

	// console.log(TwitterConf);
	// console.log(this);

	// Import Feeds into Mongo from Twitter Config File
	Meteor.call('importFeeds', TwitterConf);


	Twit = Meteor.npmRequire('twit');

	TwitterApi = new Twit({
		consumer_key: TwitterConf.consumer.key,
		consumer_secret: TwitterConf.consumer.secret,
		access_token: TwitterConf.access_token.key,
		access_token_secret: TwitterConf.access_token.secret
	});

	// Meteor.call('getTweets', params = {query: false} );


});

Meteor.methods({
	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	},


	"importFeeds": function(twitterConfig) {
		const feedData = twitterConfig.feeds
		for (var feed in feedData) {
			if (feedData.hasOwnProperty(feed)) {
				console.log(feedData[feed]);

				if( Feeds.find({handle: feedData[feed].handle}) ) {
					console.log('Dupe Found - No Insert');
				} else {
					// Import Feed
					Feeds.insert(
						{
							name: feedData[feed].name,
							handle: feedData[feed].handle,
							hashtags: feedData[feed].hashtags,
						},
						function (error, result) {
							if (error) { throw error }
							console.log(result);
						}
					);
				}

			}
		}

	},


	"getTweets": function(params) {
		const queryString = params.query

		TwitterApi.get('search/tweets',
		{
			q: 'banana since:2011-11-11',
			count: 100
		},
		function(err, data, response) {
			console.log(data);

			return data;
		}
		);

	}
});