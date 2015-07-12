Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	var TwitterConf = JSON.parse(Assets.getText('twitter.json'));

	console.log(TwitterConf);
	console.log(this);

	Meteor.call('importCandidates', TwitterConf);

	Twit = Meteor.npmRequire('twit');

	TwitterApi = new Twit({
		consumer_key: TwitterConf.consumer.key,
		consumer_secret: TwitterConf.consumer.secret,
		access_token: TwitterConf.access_token.key,
		access_token_secret: TwitterConf.access_token.secret
	});

	Meteor.call('getTweets', tweetQuery);


});

Meteor.methods({
	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	},


	"importCandidates": function(twitterConf) {
		const {config} = this.twitterConf


	},


	"getTweets": function(query) {
		const {queryString} = this.query;

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