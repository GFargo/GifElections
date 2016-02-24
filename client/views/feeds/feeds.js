/////////////////////////////////
// Feeds
/////////////////////////////////
Template.Feeds.onRendered(function() {
    var template = this;

    console.log('Feeds Rendered');
});

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



    // Swap out small 48x48 portrait for original by modifying the URL - https://dev.twitter.com/overview/general/user-profile-images-and-banners
    profile_image: function () {
        var template = Template.instance();
        return template.data.feedInfo.profile_image_url.replace('_normal.', '_bigger.');
    },


    hashtags: function () {
        var template = Template.instance();
        return template.data.hashtags;
    }

});
