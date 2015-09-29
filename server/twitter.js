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
