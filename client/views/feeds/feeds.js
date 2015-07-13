// Feeds

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


// Single Feed

Template.SingleFeed.rendered = function() {
    const hashtags = this.data.hashtags;
    console.log(hashtags);
};

Template.SingleFeed.events({

});

Template.SingleFeed.helpers({
    hashtags: function () {
        return this.hashtags;
    }

});
