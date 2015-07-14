/////////////////////////////////
// FeedList
/////////////////////////////////
Template.FeedList.rendered = function() {
    console.log('FeedList Rendered', this);

    Meteor.call('getUserInfo', this.data);
    // Meteor.call('getTweetsByHandle', this.data);
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