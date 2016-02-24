//  ______                __    __                                       __    __                  __
// /\__  _\            __/\ \__/\ \__                    /'\_/`\        /\ \__/\ \                /\ \
// \/_/\ \/ __  __  __/\_\ \ ,_\ \ ,_\    __   _ __     /\      \     __\ \ ,_\ \ \___     ___    \_\ \    ____
//    \ \ \/\ \/\ \/\ \/\ \ \ \/\ \ \/  /'__`\/\`'__\   \ \ \__\ \  /'__`\ \ \/\ \  _ `\  / __`\  /'_` \  /',__\
//     \ \ \ \ \_/ \_/ \ \ \ \ \_\ \ \_/\  __/\ \ \/     \ \ \_/\ \/\  __/\ \ \_\ \ \ \ \/\ \L\ \/\ \L\ \/\__, `\
//      \ \_\ \___x___/'\ \_\ \__\\ \__\ \____\\ \_\      \ \_\\ \_\ \____\\ \__\\ \_\ \_\ \____/\ \___,_\/\____/
//       \/_/\/__//__/   \/_/\/__/ \/__/\/____/ \/_/       \/_/ \/_/\/____/ \/__/ \/_/\/_/\/___/  \/__,_ /\/___/

// TODO: PROPER ERROR HANDLING FOR ALL UTIL FUNCTIONS
Meteor.methods({



    /////////////////////////////////
    // Twitter REST - Get Tweets by Handle
    /////////////////////////////////
    batchRefresh: function (feedHandle = 'undefined', chunkSize = 200) {

        if (typeof feedHandle == 'undefined')
            throw new Meteor.Error('no-data',
                "Missing params for batch refresh");

        const   maxQueries = 5;


        // Loop through setting previous return as the value to be used next as query params
        let queryParams = {};
        for(var i = maxQueries; i > 0; i --) {
            (function(ind){
                Meteor.setTimeout(function(){

                    let     feed = Feeds.findOne({handle: feedHandle});
                            // Define query object
                            queryParams.handle = feed.handle,
                            queryParams.affiliation = feed.feedInfo.affiliation,
                            queryParams.chunk_size = chunkSize,
                            queryParams.exclude_replies = true, // TODO FEATURE: Add Replies?!
                            queryParams.first_query = true,
                            queryParams.batch_refresh = true,
                            // queryParams.max_id = (typeof feed.feedInfo.max_id !== 'undefined' ? feed.feedInfo.max_id : undefined);

                    // console.log('---------');
                    // console.log('Fresh Query:', queryParams);
                    // console.log('---------');

                    Meteor.call('fetchTweets', queryParams);
                    console.log('\n-- Current Batch Request: ', ind);

                },  2000 * ind);

            })(i);
        }
    },



    /////////////////////////////////
    // Twitter REST - Get Tweets by Handle
    // query { handle, chunk_size, since_id (optional), max_id (optional), exclude_replies }
    /////////////////////////////////
    fetchTweets: function (query = 'undefined') {

        if (typeof query == 'undefined' || typeof query.handle == 'undefined')
            throw new Meteor.Error('no-data',
                "No Params were passed into fetchTweets()");


        var twitterGetResponseHandler = Meteor.bindEnvironment(function(err, data, response) {
            if (err) {
                console.log(err);
                throw new Meteor.Error('error', err);
            }
            if (data.length < 1) {
                console.log('Malformed Data? ', data.length, data);
                console.log();
            }
            if (( data == null || data == undefined || data.length < 1) && response.statusCode == '200') {
                console.log('NO MORE DATA - EXITING NOW');
                return;
            }

            let parsedTweets = Meteor.call('parseTweets', data);

            if(!_.isEmpty(parsedTweets)) {
                _.each(parsedTweets, function(tweet){
                    Meteor.call('storeTweet', tweet, query);
                });
            }

            query.max_id = data[data.length - 1].id_str; // Set max_id to last tweet id recieved.

            Meteor.call('updateFeedId', query);

            return "THIS IS NOT RETURNING ANYWHERE";

        });

        console.log('QUERY for GET:', query);

        twitterGet = GifElections.Twitter.api.get('statuses/user_timeline',
            {
                screen_name: query.handle,
                count: query.chunk_size ,
                since_id: query.since_id,
                // max_id: query.max_id,
                exclude_replies: query.exclude_replies
            }, twitterGetResponseHandler
        );

        return query;
    },

    parseTweets: function(tweets = 'undefined') {
        // console.log('data:', data);
        const data = tweets;
        if (data.length > 1) {

            // Filter Response
            let goldenTweets = _.filter(data, function(tweet, key, list) {
                // console.log('... maping ... key:', key, ' / id:', data[key].id_str, ' ...');
                return GifElections.Twitter.helpers.checkTweetForMedia(tweet);
            });

            console.log('... PARSE COMPLETE / Last Tweet "max_id": ', data[data.length - 1].id_str, ' ...');
            if (!_.isEmpty(goldenTweets)) {
                return goldenTweets;
            } else{
                console.log('... no golden tweets found ...');
            }

        } else {
            console.log('End of Data?');
            console.log(data);
        }
    },

    /////////////////////////////////
    // Store Tweet
    /////////////////////////////////
    storeTweet: function(tweet_to_store = undefined, query_parameters = undefined) {

        console.log('query_parameters:', query_parameters);

        if (typeof tweet_to_store == 'undefined' || typeof query_parameters == 'undefined')
            throw new Meteor.Error('no-data',
                "Missing either data for tweet or query_parameters");

        const   query       = query_parameters,
                tweet       = tweet_to_store,
                mediaObject = tweet.extended_entities.media[0];

        let     mediaType                           = GifElections.Twitter.helpers.parseTweetType(tweet.extended_entities.media[0].type),
                mediaVariants                       = mediaObject.video_info.variants,
                item                                = {};

                item.feed                           = query.handle,
                item.createdDate                    = new Date,
                item.affiliation                    = query.affiliation,

                // User
                item.user                           = {},
                item.user.handle                    = tweet.user.screen_name,
                item.user.name                      = tweet.user.name,
                item.user.website_url               = tweet.user.url,
                item.user.followers_count           = tweet.user.followers_count,
                item.user.verified                  = tweet.user.verified,
                item.user.statuses_count            = tweet.user.statuses_count,
                item.user.location                  = tweet.user.location,
                item.user.profile_background_color  = tweet.user.profile_background_color,
                item.user.profile_link_color        = tweet.user.profile_link_color,
                item.user.profile_banner_url        = tweet.user.profile_banner_url,
                item.user.profile_image_url         = tweet.user.profile_image_url,

                // Tweet
                item.tweet                          = {},
                item.tweet.id                       = tweet.id_str,
                item.tweet.text                     = tweet.text,
                item.tweet.url                      = mediaObject.expanded_url,

                item.tweet.media                    = {},
                item.tweet.media.id                 = mediaObject.id_str,
                item.tweet.media.type               = mediaType,
                item.tweet.media.source_tweet_id    = mediaObject.source_status_id_str,
                item.tweet.media.source_user_id     = mediaObject.source_user_id_str,
                // item.tweet.media.url                = parsedMedia.file.url,
                item.tweet.media.content_type       = mediaObject.type,
                // item.tweet.media.bitrate            = parsedMedia.file.bitrate,
                // item.tweet.media.duration_millis    = parsedMedia.duration,
                item.tweet.media.variants           = mediaVariants,

                item.tweet.media.size               = {},
                item.tweet.media.size.w             = mediaObject.sizes.medium.w,
                item.tweet.media.size.h             = mediaObject.sizes.medium.h,
                item.tweet.media.size.resize        = mediaObject.sizes.medium.resize,
                item.tweet.media.size.aspect_ratio  = mediaObject.video_info.aspect_ratio,

                // Meta
                item.tweet.meta                     = {},
                item.tweet.meta.retweet_count       = tweet.retweet_count,
                item.tweet.meta.favorite_count      = tweet.favorite_count,
                item.tweet.meta.possibly_sensitive  = tweet.possibly_sensitive,
                item.tweet.meta.lang                = tweet.lang,
                item.tweet.meta.timestamp_ms        = GifElections.Twitter.helpers.getTimestampMs(tweet.timestamp_ms),
                item.tweet.meta.created_at          = tweet.created_at;

        // Retweet Status
        if (GifElections.Twitter.helpers.containsRetweet(tweet.retweeted_status)) {
            console.log('--- Found Retweet Status ---');
        }

        console.log('--- ITEM to STORE ---');
        console.log(item);
        console.log('---------------------');

        // Insert Tweet into Database
        // Items.insert(item, function(error){
        //  // Insert Callback Function
        //  if(error) {
        //          console.log(error);
        //  } else {
        //      console.log('Successful Insert');
        //  }
        // });

        Items.upsert(
            { "feed": item.feed, "tweet.id": item.tweet.id  },
            { $set: item },
            function (error, result) {
                if (error) {
                    // throw new Meteor.error('upsert-failed', error);
                    console.log('failed to update feed:', item.user.handle, item.tweet.id, error );
                } else {
                    console.log('--- STORED ---');
                    console.log(result);
                }

            }
        );

    },





    // TODO: PARSE TWEET TEXT FOR ADDITIONAL URLS

    /////////////////////////////////
    // Parse Tweet Text - Check Tweet Text for URL that Resolves to a media
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
    },


    /////////////////////////////////
    // Twitter - Get User Info
    /////////////////////////////////
    fetchFeedInfo: function (feed = undefined) {
        if (typeof feed == 'undefined' || typeof feed.handle == 'undefined')
            throw new Meteor.Error('no-data',
                "No Params were passed into fetchFeedInfo()");

        var userShowResponseHandler = Meteor.bindEnvironment(function(err, data, response) {
            if (err) {
                console.log(err);
                throw new Meteor.Error('error', err);
            }

            if(!err) {
                Feeds.update (
                    { handle: data.screen_name },
                    { $set: {
                            "feedInfo.description": data.description,
                            "feedInfo.followers_count": data.followers_count,
                            "feedInfo.friends_count": data.friends_count,
                            "feedInfo.statuses_count": data.statuses_count,
                            "feedInfo.profile_banner_url": data.profile_banner_url,
                            "feedInfo.profile_image_url": data.profile_image_url,
                            "feedInfo.profile_background_color": data.profile_background_color,
                            "feedInfo.profile_link_color": data.profile_link_color,
                            "feedInfo.created_at": data.created_at,
                        }
                    },
                    function (error, result) {
                        if (error) {
                            console.log('failed to update feed:', data.handle, error );
                        }
                        console.log("Refreshed Feed: ", feed.handle);
                    }
                );

                return data;
            }
        });

        GifElections.Twitter.api.get('users/show',
            {
                screen_name: feed.handle,
                include_entities: false,
            }, userShowResponseHandler
        );
    },


    /////////////////////////////////
    // Twitter - Create Live Tweet Stream
    /////////////////////////////////
    createStream: function (params = undefined, streamType = 'user') {
        const   feedInfo = params,
                type = streamType;
        let     trackingInfo = [];

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

        var stream = GifElections.Twitter.api.stream(type, { track: trackingInfo });
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



});

