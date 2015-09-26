/////////////////////////////////
// FeedList
/////////////////////////////////
Template.FeedList.rendered = function() {
    console.log('FeedList Rendered', this);

    // Meteor.call('parseTwitterData');
    // Meteor.call('createStream', this.data);
    // Meteor.call('getUserInfo', this.data);
    // Meteor.call('getTweetsByHandle', this.data, 1);
};

Template.FeedList.events({

});

Template.FeedList.helpers({
    getFeedInfo: function() {
        return Feeds.find({handle: this.params.handle}, {sort: {createdAt: -1}});
    },

    // Log Helper Function
    log: function () {
        console.log(this);
    }
});



/////////////////////////////////
// FeedItem
/////////////////////////////////
Template.FeedItem.rendered = function() {
    console.log('FeedItem Rendered', this);

    // Meteor.call('getUserInfo', this.data);
    // Meteor.call('getTweetsByHandle', this.data, 1);
};

Template.FeedItem.events({

});

Template.FeedItem.helpers({

    // Log Helper Function
    log: function () {
        console.log(this);
    }
});
