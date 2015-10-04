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
	importFeeds: function (feedData) {
		const feeds = feedData
		for (var feed in feeds) {
			if (feeds.hasOwnProperty(feed)) {
				Feeds.upsert(
					{ handle: feeds[feed].handle },
					{ $set: {
							name: feeds[feed].name,
							handle: feeds[feed].handle,
							hashtags: feeds[feed].hashtags,
							feedInfo: {
								max_id: feeds[feed].feedInfo.max_id,
								since_id: feeds[feed].feedInfo.since_id,
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
						if (error) { throw error }
						console.log(result);
					}
				);
			}
		}
	},




	/////////////////////////////////
	// Twitter - Get User Info
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


	/////////////////////////////////
	// Twitter REST - Get Tweets by Handle
	/////////////////////////////////
	getTweetsByHandle: function (params = 'undefined', tweetLimit = 200, excludeReplies = true) {
		console.log('---------');
		console.log('Params:', params);
		console.log('---------');

		if (typeof params == 'undefined' || typeof params.handle == 'undefined') {
			return false;
		}

		const 	queryParams = new Object();

				queryParams.handle = params.handle,
				queryParams.date = params.date,
				queryParams.limit = tweetLimit,
				queryParams.since_id = typeof params.feedInfo.since_id !== 'undefined' ? params.feedInfo.since_id : undefined,
				queryParams.max_id = typeof params.feedInfo.max_id !== 'undefined' ? params.feedInfo.max_id : undefined,
				queryParams.exclude_replies = excludeReplies;

		if (typeof queryParams.handle !== 'undefined') {
			// console.log('<< Query Tweets Handle:', handle)

			TwitterApi.get('statuses/user_timeline',
				{
					screen_name: queryParams.handle,
					count: queryParams.limit,
					since_id: queryParams.since_id,
					max_id: queryParams.max_id,
					exclude_replies: queryParams.exclude_replies
				},
				function(err, data, response) {
					if (err) {
						console.log(err);
						return false;
					}
					// Filter Response
					data.forEach(function(tweet, index){
						if (checkTweetForMedia(tweet)) {
							console.log('========== ',index,'Tweet Media Found ===============');
							// console.log('Tweet: ', tweet);
							// console.log('-----------------------------------------------------');
							console.log('Media: ', tweet.extended_entities);
							console.log('-----------------------------------------------------');
							console.log('Media: ', tweet);
							// console.log('Video Info: ', tweet.extended_entities.media[0].video_info);
							// console.log('-----------------------------------------------------');
							// console.log('Sizes: ', tweet.extended_entities.media[0].sizes);

							// getMediaVariant(tweet.extended_entities.media[0].video_info.variants);
						}
					});
					// return data;
					console.log('--alldone--');
				}
			);
		} else {
			console.log('No Handle Provided');
		}

	},


	/////////////////////////////////
	// Twitter - Create Live Tweet Stream
	/////////////////////////////////
	createStream: function (params = undefined, streamType = 'user') {
	    const   feedInfo = params,
	            type = streamType;
	    let 	trackingInfo = [];

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
	        //  trackingInfo.push(element.handle);
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


	        // console.log(userScreenName + " (" + userName + ")" + " said " + userTweet + " at " + tweetDate);

	        // var urlPat = new RegExp("^http?://pbs.(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:gif|png)$");

	        if (tweet.extended_entities != undefined) {

	            // streamCount ++;
	            // if (streamCount >= 10) {
	            //     console.log('Count Hit 10:', tweet.extended_entities);
	            //     streamCount = 0;
	            // }

	            if (tweet.extended_entities.media[0].video_info != undefined) {
	            // if (urlPat.test(tweet.entities.media.media_url)) {
	               //  // console.log("Tweet Entities >>> ", tweet.entities.media);
	               //  console.log("=======================================");
	               //  console.log("GIF URL:", tweet.entities.media[0].media_url);
	               //  console.log("=======================================");
	            // } else {
	                // console.log("=======================================");
	                // console.log("Media: ", tweet.extended_entities.media[0]);
	                console.log("\n==================\n Gif Found | Type: ", tweet.extended_entities.media[0].type);
	                console.log(tweet);
	                console.log("\n==================\n");

	                // tweet.extended_entities.media[0].type = 'video'
	                //  vid info:  {
	                //  aspect_ratio: [ 16, 9 ],
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

		        Meteor.call('storeTweet', tweet);

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


	    }))

	},



	/////////////////////////////////
	// Twitter - Store Tweet
	/////////////////////////////////
	storeTweet: function (tweet = undefined, queryParams = undefined) {

		// TODO: Error Handling
		if (tweet || queryParams == undefined) { return false; }

		const 	item 								= new Object();
				item.feed 							= queryParams.feed,
				item.affiliation					= queryParams.affiliation,
				item.type 							= getTweetType(tweet.extended_entities.media[0].type),

				// User
				item.user.handle 					= tweet.user.screen_name,
				item.user.name 						= tweet.user.name,
				item.user.website_url 				= tweet.user.url,
				item.user.followers_count 			= tweet.user.followers_count,
				item.user.verified 					= tweet.user.verified,
				item.user.statuses_count 			= tweet.user.statuses_count,
				item.user.location 					= tweet.user.location,
				item.user.profile_background_color 	= tweet.user.profile_background_color,
				item.user.profile_link_color 		= tweet.user.profile_link_color,
				item.user.profile_banner_url 		= tweet.user.profile_banner_url,
				item.user.profile_image_url 		= tweet.user.profile_image_url,

				// Tweet
				item.tweet.id 						= tweet.id_str,
				item.tweet.text 					= tweet.text,
				item.tweet.url 						= tweet.extended_entities.media[0].expanded_url,
				item.tweet.media.id 				= tweet.extended_entities.media[0].id,
				item.tweet.media.source_tweet_id 	= tweet.extended_entities.media[0].source_status_id_str,
				item.tweet.media.source_user_id 	= tweet.extended_entities.media[0].source_user_id_str,
				item.tweet.media.url 				= getMediaVariant(tweet.extended_entities.media[0].video_info.variants),
				item.tweet.media.content_type 		= tweet.extended_entities.media[0].type,
				item.tweet.media.bitrate 			= tweet.extended_entities.media[0].bitrate,
				item.tweet.media.duration_millis 	= tweet.extended_entities.media[0].video_info.duration_millis,
				item.tweet.media.size.w 			= tweet.extended_entities.media[0].sizes.medium.w,
				item.tweet.media.size.h 			= tweet.extended_entities.media[0].sizes.medium.h,
				item.tweet.media.size.resize 		= tweet.extended_entities.media[0].sizes.medium.resize,
				item.tweet.media.size.aspect_ratio	= tweet.extended_entities.media[0].video_info.aspect_ratio,

				// Meta
				item.tweet.meta.retweet_count		= tweet.retweet_count,
				item.tweet.meta.favorite_count		= tweet.favorite_count,
				item.tweet.meta.possibly_sensitive	= tweet.possibly_sensitive,
				item.tweet.meta.language			= tweet.lang,
				item.tweet.meta.timestamp_ms		= getTweetTimestampMs(tweet.timestamp_ms),
				item.tweet.meta.created_at			= tweet.created_at;

		// Retweet Status
		if (checkRetweetPresent(tweet.retweeted_status)) {
			console.log('--- Found Retweet Status ---');
		}

		console.log('--- ITEM to STORE ---');
		console.log(item);
		console.log('---------------------');

		// Insert Tweet into Database
		// Items.insert(item, function(error){
		// 	// Insert Callback Function
		// 	if(error) {
		//  		console.log(error);
		// 	} else {
		// 		console.log('Successful Insert');
		// 	}
		// });
	},


	/////////////////////////////////
	// Twitter - Check Tweet Text for URL that Resolves to a Gif
	/////////////////////////////////
	parseTweetText: function (data) {
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