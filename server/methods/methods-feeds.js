//  ____                  __                               __    __                  __
// /\  _`\               /\ \              /'\_/`\        /\ \__/\ \                /\ \
// \ \ \L\_\ __     __   \_\ \    ____    /\      \     __\ \ ,_\ \ \___     ___    \_\ \    ____
//  \ \  _\/'__`\ /'__`\ /'_` \  /',__\   \ \ \__\ \  /'__`\ \ \/\ \  _ `\  / __`\  /'_` \  /',__\
//   \ \ \/\  __//\  __//\ \L\ \/\__, `\   \ \ \_/\ \/\  __/\ \ \_\ \ \ \ \/\ \L\ \/\ \L\ \/\__, `\
//    \ \_\ \____\ \____\ \___,_\/\____/    \ \_\\ \_\ \____\\ \__\\ \_\ \_\ \____/\ \___,_\/\____/
//     \/_/\/____/\/____/\/__,_ /\/___/      \/_/ \/_/\/____/ \/__/ \/_/\/_/\/___/  \/__,_ /\/___/

Meteor.methods({


    /////////////////////////////////
    // Update Feeds in Mongo
    /////////////////////////////////
    importFeeds: function (feedConfig = undefined) {
        const feeds = feedConfig

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
                            "feedInfo.affiliation": feeds[feed].feedInfo.affiliation,
                            "feedInfo.portrait": {
                                url: feeds[feed].feedInfo.portrait.url,
                                size: feeds[feed].feedInfo.portrait.size,
                                caption: feeds[feed].feedInfo.portrait.caption,
                            },
                            "feedInfo.description": feeds[feed].feedInfo.description,
                            "feedInfo.website": feeds[feed].feedInfo.website
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

    updateFeedId: function (newFeedData = undefined) {
        const feedData = newFeedData

        if (typeof feedData == undefined)
            throw new Meteor.error('no-data',
                'Please provide update data for updateFeedId() to run properly');

        console.log(' --------------- | updateFeedId() | --------------- ');
        console.log('New Data:', feedData);
        console.log('------------------------------------------');

        let max_id = (!_.isEmpty(feedData.max_id) ? feedData.max_id : '');
        let since_id = (!_.isEmpty(feedData.since_id) ? feedData.since_id : '');

        // ToDo: Change to just updating one or two items in Mongo entry i.e. max_id & since_id
        Feeds.update (
            { handle: feedData.handle },
            { $set: {
                    "feedInfo.max_id": max_id,
                    "feedInfo.since_id": since_id,
                }
            },
            function (error, result) {
                if (error) {
                    console.log('failed to update feed:', feedData.handle, error );
                }

                console.log("Update Result: ", result);
            }
        );
    },

    updateFeed: function (data = undefined) {}



});