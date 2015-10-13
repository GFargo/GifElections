// Twitter Wrapper


// Twitter API Wrapper Object

var Twitter = (function () {
    // Private Variables
    var config = JSON.parse(Assets.getText('twitter.json'));
    var Twit = Meteor.npmRequire('twit');
    var api = new Twit({
        consumer_key: config.consumer.key,
        consumer_secret: config.consumer.secret,
        access_token: config.access_token.key,
        access_token_secret: config.access_token.secret
    });

    return {
        config: config,
        api: api,
    }

})();

// var twitConfig = JSON.parse(Assets.getText('twitter.json'));
// var Twit = Meteor.npmRequire('twit');

// Twitter.Twit = Meteor.npmRequire('twit');
// Twitter.config = function () {
//     return JSON.parse(Assets.getText('twitter.json'));
// }

// var TwitterApi = new Twitter.twit({
//     consumer_key: Twitter.config.consumer.key,
//     consumer_secret: Twitter.config.consumer.secret,
//     access_token: Twitter.config.access_token.key,
//     access_token_secret: Twitter.config.access_token.secret
// });

// Import Feeds into Mongo from Twitter Config File
Meteor.call('importFeeds', Twitter.config.feeds);


// Grab First Feed & Create Stream
// Meteor.call('createStream', TwitterConf.feeds[1].handle, 'user');




//  __  __  __         ___
// /\ \/\ \/\ \__  __ /\_ \
// \ \ \ \ \ \ ,_\/\_\\//\ \     ____
//  \ \ \ \ \ \ \/\/\ \ \ \ \   /',__\
//   \ \ \_\ \ \ \_\ \ \ \_\ \_/\__, `\
//    \ \_____\ \__\\ \_\/\____\/\____/
//     \/_____/\/__/ \/_/\/____/\/___/

// TODO: PROPER ERROR HANDLING FOR ALL UTIL FUNCTIONS
Meteor.methods({



    /////////////////////////////////
    // Twitter REST - Get Tweets by Handle
    /////////////////////////////////
    batchRefresh: function (params = 'undefined', chunkSize = 200) {

        if (typeof params == 'undefined' || typeof params.handle == 'undefined')
            throw new Meteor.Error('no-data',
                "Missing params for batch refresh");

        let     queryParams = params;
                queryParams.chunk_size = chunkSize,
                // queryParams.since_id = typeof params.feedInfo.since_id !== 'undefined' ? params.feedInfo.since_id : undefined,
                // queryParams.max_id = typeof params.feedInfo.max_id !== 'undefined' ? params.feedInfo.max_id : undefined,
                queryParams.exclude_replies = true; // TODO FEATURE: Add Replies?!
                queryParams.firstQuery = true;


        console.log('---------');
        console.log('Fresh Params:', params);
        console.log('---------');


        let returnTweetQuery = Meteor.call('fetchTweets', queryParams);

        console.log('-- fetchTweets() return: ', returnTweetQuery);



    },



    /////////////////////////////////
    // Twitter REST - Get Tweets by Handle
    // query { handle, chunk_size, since_id (optional), max_id (optional), exclude_replies }
    /////////////////////////////////
    fetchTweets: function (query = 'undefined') {

        if (typeof query == 'undefined' || typeof query.handle == 'undefined')
            throw new Meteor.Error('no-data',
                "No Params were passed into getTweetsByHandle()");


        var responseHandler = Meteor.bindEnvironment(function(err, data, response) {
                if (err) {
                    console.log(err);
                    throw new Meteor.Error('error', err);
                }

                if (data == null || data == undefined) {
                    console.log('NO MORE DATA');
                }

                let parsedTweets = Meteor.call('parseTweets', data);

                if(!_.isEmpty(parsedTweets)) {
                    _.each(parsedTweets, function(tweet){
                        Meteor.call('storeTweet', tweet, query);
                    });
                }

                query.max_id = data[data.length - 1].id_str; // Set since_id to last tweet id recieved.

                Meteor.call('updateFeedId', query);

                return "THIS IS NOT RETURNING ANYWHERE";

            })

        twitterGet = Twitter.api.get('statuses/user_timeline',
            {
                screen_name: query.handle,
                count: query.chunk_size ,
                since_id: query.since_id,
                max_id: query.max_id,
                exclude_replies: query.exclude_replies
            }, responseHandler
        );

        console.log('~~~~ |||');
        console.log('Get: ', twitterGet);
        console.log('Response Handler: ', responseHandler);
        console.log('~~~~ |||');

        return query;
    },

    parseTweets: function (tweets = 'undefined') {
        // console.log('data:', data);
        const data = tweets;
        // Filter Response
        let goldenTweets = _.filter(data, function(tweet, key, list){
            console.log('... maping ... key:', key, ' / id:', data[key].id_str, ' ...');
            return Twitter.helpers.checkTweetForMedia(tweet);
        });

        console.log('--------- PARSE COMPLETE / Last Tweet "max_id": ', data[data.length - 1].id_str, ' ---------');
        if (!_.isEmpty(goldenTweets))
            return goldenTweets;
    },

    /////////////////////////////////
    // Store Tweet
    /////////////////////////////////
    storeTweet: function (tweet_to_store = undefined, query_parameters = undefined) {

        console.log('query_parameters:', query_parameters);

        if (typeof tweet_to_store == 'undefined' || typeof query_parameters == 'undefined')
            throw new Meteor.Error('no-data',
                "Missing either data for tweet or query_parameters");

        const   query       = query_parameters,
                tweet       = tweet_to_store,
                mediaObject = tweet.extended_entities.media[0];

        let     tweetType                           = Twitter.helpers.parseTweetType(tweet.extended_entities.media[0].type),
                parsedMedia                         = Twitter.helpers.getTweetMedia(tweetType, mediaObject),
                item                                = {};

                item.feed                           = query.handle,
                item.affiliation                    = query.feedInfo.affiliation,
                item.type                           = tweetType,

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
                item.tweet.media.source_tweet_id    = mediaObject.source_status_id_str,
                item.tweet.media.source_user_id     = mediaObject.source_user_id_str,
                item.tweet.media.url                = parsedMedia.file.url,
                item.tweet.media.content_type       = mediaObject.type,
                item.tweet.media.bitrate            = parsedMedia.file.bitrate,
                item.tweet.media.duration_millis    = parsedMedia.duration,

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
                item.tweet.meta.language            = tweet.lang,
                item.tweet.meta.timestamp_ms        = Twitter.helpers.getTimestampMs(tweet.timestamp_ms),
                item.tweet.meta.created_at          = tweet.created_at;

        // Retweet Status
        if (Twitter.helpers.containsRetweet(tweet.retweeted_status)) {
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







//  __  __          ___
// /\ \/\ \        /\_ \
// \ \ \_\ \     __\//\ \    _____      __   _ __   ____
//  \ \  _  \  /'__`\\ \ \  /\ '__`\  /'__`\/\`'__\/',__\
//   \ \ \ \ \/\  __/ \_\ \_\ \ \L\ \/\  __/\ \ \//\__, `\
//    \ \_\ \_\ \____\/\____\\ \ ,__/\ \____\\ \_\\/\____/
//     \/_/\/_/\/____/\/____/ \ \ \/  \/____/ \/_/ \/___/
//                             \ \_\
//                              \/_/

Twitter.helpers = {

    checkTweetForMedia: function (tweetObject = 'undefined') {

        //tweet.extended_entities.media[0]
        if (typeof tweetObject == 'undefined') {
            throw new Meteor.Error('no-data',
                "No Tweet was passed into checkTweetForMedia()");
        }

        const tweet = tweetObject;

        if (typeof tweet.extended_entities !== 'undefined') {
            if (typeof tweet.extended_entities.media[0].video_info !== 'undefined') {

                console.log('========== Tweet Media Found ===============');
                // console.log('Tweet: ', tweet);
                // console.log('-----------------------------------------------------');
                // console.log('Media: ', tweet.extended_entities);
                // console.log('-----------------------------------------------------');
                // console.log('Entire Tweet: ', tweet);
                // console.log('Video Info: ', tweet.extended_entities.media[0].video_info);
                // console.log('-----------------------------------------------------');
                // console.log('Sizes: ', tweet.extended_entities.media[0].sizes);

                return tweet;
            }
        }


    },

    // TODO: PROPER ERROR HANDLING / Create 'undefined' check?
    parseTweetType: function (tweet_type = 'undefined') {
        const tweetType = tweet_type;

        if (tweetType == 'animated_gif') {
            return 'gif'
        } else {
            return 'video';
        }
    },

    // TODO: PROPPER ERROR LOGGING / Create 'undefined' check?
    getTimestampMs: function (tweet_timestamp = 'undefined') {
        const timestamp = tweet_timestamp;
        if (typeof timestamp !== 'undefined') {
            return timestamp;
        }
        return null;
    },

    // TODO: Check for Retweet & Return True if Present
    containsRetweet: function (retweeted_status = 'undefined') {
        const tweet = retweeted_status

        if (typeof tweet !== 'undefined' && tweet.id !== 'undefined')
            return true;


        return false;
    },

    // TODO: PROPPER ERROR LOGGING
    getTweetMedia: function (media_type = 'gif', media_object = 'undefined') {
        if (typeof media_object == 'undefined')
            throw new Meteor.Error('no-data',
                "No media_object data was passed for getTweetMedia()");

        const   variants = media_object.video_info.variants,
                type = media_type;

        let     returnObj = {};

        if (type == 'gif') {
            // Find URL for Gif
            _.each(variants, function(variant, key){
                if (variant.content_type == 'video/mp4') {
                    console.log('Gif Media: ', variant);
                    returnObj = {
                        file: variant
                    };
                }
            });
        } else {
            // Find URL for Video
            _.each(variants, function(variant, key){
                if (variant.content_type == 'video/mp4' && variant.bitrate == 832000) {
                    console.log('Video Media: ', variant);
                    returnObj = {
                        file: variant,
                        duration: media_object.video_info.duration_millis
                    };
                }
            });
        }
        return returnObj;
    }
}