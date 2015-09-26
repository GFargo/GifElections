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
	getUserInfo: function (params = undefined) {
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
				limit = queryLimit;


		if (handle) {
			console.log('<< Query Tweets Handle:', handle)

			TwitterApi.get('statuses/user_timeline',
				{
					screen_name: handle,
					count: limit,
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

	createStream: function (params = undefined, streamType = 'user') {
		const 	feedInfo = params,
				type = streamType;
		let trackingInfo = [];

		if (typeof feedInfo == 'undefined') { return; } // TODO: Correct Error / Throw logic

		//
		// User Stream - Can only pass in 1 handle - feedInfo must be a string
		//
		if (type == 'user' && typeof feedInfo !== 'string') { return; } // TODO: Correct Error / Throw logic

		//
		// Site Stream - Pull each handle out of the feedInfo to pass into stream variable
		//
		if (type == 'site') {

			// TODO: GET ACCESS TO BETA SITE STREAMING ON API YA DINK
			return;

			// feedInfo.forEach(function(element, index){
			// 	trackingInfo.push(element.handle);
			// });
		} else {
			trackingInfo = feedInfo;
		}

		console.log("type:", type ," | params:", trackingInfo);


		//
		// Setup Twitter Stream
		//

		var stream = TwitterApi.stream(type, { track: trackingInfo });
	    var streamCount = 0;

		stream.on('error', function (err) {
			console.log('Error:', err);
		})
		stream.on('tweet', Meteor.bindEnvironment(function (tweet) {
		    var userName = tweet.user.name;
		    var userScreenName = tweet.user.screen_name;
		    var userTweet = tweet.text;
		    var tweetDate = tweet.created_at;
		    var profileImg = tweet.user.profile_image_url;

		    // console.log(userScreenName + " (" + userName + ")" + " said " + userTweet + " at " + tweetDate);

		    var urlPat = new RegExp("^http?://pbs.(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:gif|png)$");
		    if (tweet.extended_entities != undefined) {
		    	streamCount ++;
		    	if (streamCount >= 10) {
		    		console.log('Count Hit 10:', tweet.extended_entities);
		    		streamCount = 0;
		    	}
			    if (tweet.extended_entities.media[0].video_info != undefined) {
			    // if (urlPat.test(tweet.entities.media.media_url)) {
				   //  // console.log("Tweet Entities >>> ", tweet.entities.media);
				   //  console.log("=======================================");
				   //  console.log("GIF URL:", tweet.entities.media[0].media_url);
				   //  console.log("=======================================");
			    // } else {
			    	// console.log("=======================================");
			    	// console.log("Media: ", tweet.extended_entities.media[0]);
			    	console.log("==================\n Gif Found \n");
			    	console.log(tweet.extended_entities.media[0].video_info, tweet.extended_entities.media[0].type);
			    	console.log("\n==================\n");

			    	// tweet.extended_entities.media[0].type = 'video'
			  		//  vid info:  {
			  		// 	aspect_ratio: [ 16, 9 ],
					//  duration_millis: 26059,
					//  variants:
					//   [ { content_type: 'application/dash+xml',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/pl/jn0h8DXv8Yr5gcmh.mpd' },
					//     { content_type: 'application/x-mpegURL',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/pl/jn0h8DXv8Yr5gcmh.m3u8' },
					//     { bitrate: 2176000,
					//       content_type: 'video/mp4',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/vid/1280x720/aFtgucfIhwQCxWZS.mp4' },
					//     { bitrate: 832000,
					//       content_type: 'video/mp4',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/vid/640x360/bc8kQZCPvNjCauPn.mp4' },
					//     { bitrate: 832000,
					//       content_type: 'video/webm',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/vid/640x360/bc8kQZCPvNjCauPn.webm' },
					//     { bitrate: 320000,
					//       content_type: 'video/mp4',
					//       url: 'https://video.twimg.com/ext_tw_video/647588831202402304/pu/vid/320x180/qo3RpisvOVzt-B86.mp4' } ] }
			    }
			} else {
				// console.log("No Result");
			}


		    // HTTP.call("HEAD", 'http://bit.ly/1adkwWO',{},
            // function (error, result) {
            //     if (!error) {
            //         console.log("result: " + JSON.stringify(result));
            //         console.log("statusCode: " + result.statusCode);
            //         console.log("data: " + result.data);
            //         console.log("headers: " + JSON.stringify(result.headers));
            //         console.log("href: " + result.request.href);

            //     } else {
            //         console.log(error);
            //     }
            // });

		    // Tweets.insert({user: userName, userscreen: userScreenName, tweet: userTweet, picture: profileImg, date: tweetDate}, function(error){
		    //     if(error)
		    //         console.log(error);
		    // });
		}))

	},


	/////////////////////////////////
	// Query Parsing
	/////////////////////////////////

	parseTwitterData: function (data) {
		const response = data

		var testData = JSON.parse(Assets.getText('testTweet.json'));

		console.log("data:", data, "Test Data:", testData);
		/*
			loop thought item in dataset
				- test if tweet text has URL >> check URL if resolves to .gif/.jpg file format
				- test if tweet has emoji >> set category
				-

		*/




	}
});