Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}



});


Meteor.methods({

	"sendMail": function (options) {
		this.unblock();

		Email.send(options);
	},




	/////////////////////////////////
	// Update Feeds in Mongo
	/////////////////////////////////
	importFeeds: function (feedData = undefined) {
		const feeds = feedData

		if (typeof feeds == undefined)
			throw new Meteor.error('no-data',
				'Please provide feed data for importFeeds() to run properly');


		for (var feed in feeds) {
			if (feeds.hasOwnProperty(feed)) {
				Feeds.upsert(
					{ handle: feeds[feed].handle },
					{ $set: {
							name: feeds[feed].name,
							handle: feeds[feed].handle,
							hashtags: feeds[feed].hashtags,
							feedInfo: {
								// max_id: feeds[feed].feedInfo.max_id,
								// since_id: feeds[feed].feedInfo.since_id,
								affiliation: feeds[feed].feedInfo.affiliation,
								portrait: {
									url: feeds[feed].feedInfo.portrait.url,
									size: feeds[feed].feedInfo.portrait.size,
									caption: feeds[feed].feedInfo.portrait.caption,
								},
								description: feeds[feed].feedInfo.description,
								website: feeds[feed].feedInfo.website
							},
						}
					},
					function (error, result) {
						if (error)
							throw new Meteor.error('upsert-failed', error);

						console.log(result);
					}
				);
			}
		}
	},

	updateFeedId: function (feedData = undefined) {
		const newFeedData = feedData

		if (typeof newFeedData == undefined)
			throw new Meteor.error('no-data',
				'Please provide update data for updateFeedId() to run properly');

		console.log(' --------------- | updateFeedId() | --------------- ');
		console.log('New Data:', newFeedData);
		console.log('------------------------------------------');

	}



});