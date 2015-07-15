Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	var TwitterConf = JSON.parse(Assets.getText('twitter.json'));
	// console.log(TwitterConf);


	// Import Feeds into Mongo from Twitter Config File
	Meteor.call('importFeeds', TwitterConf);


	Twit = Meteor.npmRequire('twit');



	// Intialize through User Context

	TwitterApi = new Twit({
		consumer_key: TwitterConf.consumer.key,
		consumer_secret: TwitterConf.consumer.secret,
		access_token: TwitterConf.access_token.key,
		access_token_secret: TwitterConf.access_token.secret
	});

	// Intialize through Application Context
	// TwitterApi = new Twit({
	// 	consumer_key: TwitterConf.consumer.key,
	// 	consumer_secret: TwitterConf.consumer.secret,
	// 	app_only_auth: true
	// });

});


Meteor.methods({

	"sendMail": function (options) {
		this.unblock();

		Email.send(options);
	},


	/////////////////////////////////
	// Startup Functions
	/////////////////////////////////
	importFeeds: function (twitterConfig) {
		const feedData = twitterConfig.feeds
		for (var feed in feedData) {
			if (feedData.hasOwnProperty(feed)) {
				Feeds.upsert(
					{ handle: feedData[feed].handle },
					{ $set: {
							name: feedData[feed].name,
							handle: feedData[feed].handle,
							hashtags: feedData[feed].hashtags,
							feedInfo: {
								latestId: feedData[feed].feedInfo.latestId,
								affiliation: feedData[feed].feedInfo.affiliation,
								portrait: feedData[feed].feedInfo.portrait,
								description: feedData[feed].feedInfo.description
							},
						}
					},
					function (error, result) {
						if (error) { throw error }
						console.log(result);
					}
				);
			}
		}
	},




	/////////////////////////////////
	// Twitter API Calls
	/////////////////////////////////
	getUserInfo: function (params) {
		const handle = params.handle

		if (handle) {
			console.log('<< User Info Handle:', new Date(), handle)

			TwitterApi.get('users/show',
				{
					screen_name: handle,
					include_entities: false,
				},
				function(err, data, response) {
					console.log('getUserInfo:', data);

					return data;
				}
			);
		} else{
			console.log('No Handle Provided');
		}
	},

	getTweetsByHandle: function (params, queryLimit) {
		const 	handle = params.handle,
				date = params.date,
				limit = queryLimit


		if (handle) {
			console.log('<< Query Tweets Handle:', handle)

			TwitterApi.get('statuses/user_timeline',
				{
					screen_name: handle,
					count: limit
				},
				function(err, data, response) {
					console.log('getTweetsByHandle:', data);

					return data;
				}
			);
		} else{
			console.log('No Handle Provided');
		}

	},


	/////////////////////////////////
	// Query Parsing
	/////////////////////////////////

	parseTwitterData: function (data) {
		const response = data

		var testData = JSON.parse(Assets.getText('testTweet.json'));

		console.log("Test Data:", testData);
		/*
			loop thought item in dataset
				- test if tweet text has URL >> check URL if resolves to .gif/.jpg file format
				- test if tweet has emoji >> set category
				-

		*/

	}
});