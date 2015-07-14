/////////////////////////////////
// Feeds
/////////////////////////////////
Template.Feeds.rendered = function() {

};

Template.Feeds.events({

});

Template.Feeds.helpers({
    feeds: function() {
        return Feeds.find();
    },

    // Log Helper Function
    log: function () {
        console.log(this);
    }
});



/////////////////////////////////
// Single Feed
/////////////////////////////////
Template.FeedCard.rendered = function() {

};

Template.FeedCard.events({

});

Template.FeedCard.helpers({
    hashtags: function () {
        return this.hashtags;
    }

});
