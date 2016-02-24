// Twitter API Wrapper Object
GifElections.Twitter = (function(){
    let config = JSON.parse(Assets.getText('twitter.json')),
    Twit = Meteor.npmRequire('twit'),
    api = new Twit({
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



// Grab First Feed & Create Stream
// Meteor.call('createStream', TwitterConf.feeds[1].handle, 'user');



//  __  __          ___
// /\ \/\ \        /\_ \
// \ \ \_\ \     __\//\ \    _____      __   _ __   ____
//  \ \  _  \  /'__`\\ \ \  /\ '__`\  /'__`\/\`'__\/',__\
//   \ \ \ \ \/\  __/ \_\ \_\ \ \L\ \/\  __/\ \ \//\__, `\
//    \ \_\ \_\ \____\/\____\\ \ ,__/\ \____\\ \_\\/\____/
//     \/_/\/_/\/____/\/____/ \ \ \/  \/____/ \/_/ \/___/
//                             \ \_\
//                              \/_/
GifElections.Twitter.helpers = {

    checkTweetForMedia: function(tweetObject = 'undefined') {
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
    parseTweetType: function(tweet_type = 'undefined') {
        const tweetType = tweet_type;

        if (tweetType == 'animated_gif') {
            return 'gif'
        } else {
            return 'video';
        }
    },

    // TODO: PROPPER ERROR LOGGING / Create 'undefined' check?
    getTimestampMs: function(tweet_timestamp = 'undefined') {
        const timestamp = tweet_timestamp;
        if (typeof timestamp !== 'undefined') {
            return timestamp;
        }
        return null;
    },

    // TODO: Check for Retweet & Return True if Present
    containsRetweet: function(retweeted_status = 'undefined') {
        const tweet = retweeted_status

        if (typeof tweet !== 'undefined' && tweet.id !== 'undefined')
            return true;


        return false;
    },

}