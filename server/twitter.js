// Twitter API Wrapper

var Twit = Meteor.npmRequire('twit');

var TwitterConf = JSON.parse(Assets.getText('twitter.json'));
/*
"feeds": [
    {
        "name": "Bernie Sanders",
        "handle": "BernieSanders",
        "hashtags": [
            { "tag": "GoBernie" },
            { "tag": "NotTheBillionaires" },
            { "tag": "FeelTheBern" }
        ],
        "feedInfo": {
            "latestId": "init",
            "affiliation": "democrats",
            "portrait": "",
            "description": ""
        }
    },
*/
// console.log(TwitterConf);


// Import Feeds into Mongo from Twitter Config File
Meteor.call('importFeeds', TwitterConf.feeds);


// Intialize through User Context
TwitterApi = new Twit({
    consumer_key: TwitterConf.consumer.key,
    consumer_secret: TwitterConf.consumer.secret,
    access_token: TwitterConf.access_token.key,
    access_token_secret: TwitterConf.access_token.secret
});


// Grab First Feed & Create Stream
// Meteor.call('createStream', TwitterConf.feeds[1].handle, 'user');

// TODO: Proper Error Handling
checkTweetForMedia = function (tweet = 'undefined') {
    //tweet.extended_entities.media[0]
    if (typeof tweet == 'undefined') {
        console.log("No tweet to parse");
        return false;
    }
    const t = tweet;

    if (typeof tweet.extended_entities !== 'undefined') {
        if (typeof tweet.extended_entities.media[0].video_info !== 'undefined')
            return true;
    } else {
        return false;
    }

}


// TODO: Proper Error Handling / Create 'undefined' check?
getTweetType = function (tweet_type = 'undefined') {
    const tweetType = tweet_type;

    if (tweetType == 'animated_gif') {
        return 'gif'
    } else {
        return 'video';
    }
}

// TODO: Propper Error Logging / Create 'undefined' check?
getTweetTimestampMs = function (tweet_timestamp = 'undefined') {
    const timestamp = tweet_timestamp;
    if (typeof timestamp !== 'undefined') {
        return timestamp;
    }
    return null;
}

// TODO: Check for Retweet & Return True if Present
checkRetweetPresent = function (retweeted_status = 'undefined') {
    const tweet = retweeted_status
    if (typeof tweet !== 'undefined' && tweet.id !== 'undefined') {
        return true;
    }
    return false;
}



// TODO:
getMediaVariant = function (video_variants = 'undefined') {
    const videoVariants = video_variants;
    if (typeof videoVariants !== ) {
        videoVariants.forEach(function(variant, index){
            if (variant.content_type == 'video/mp4') {
                if (variant.bitrate == 832000) {
                    console.log('Correct Media Variant: ', variant);
                    return variant.url;
                }
            }
        });
    }
    return false;
}