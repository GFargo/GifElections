/////////////////////////////////
// Feed
/////////////////////////////////
Template.Feed.onCreated(function () {
  var template = this;

    // Subscribe to the Items collection on Feed Page
    this.subscribe("items");
});


Template.Feed.onRendered(function() {
    var template = this;

    console.log('---------- Feed Rendered ----------');
    console.log('Feed Data:', template);
    console.log('-----------------------------------------');

    // Spinner Config
    Meteor.Spinner.options = {
        lines: 9, // The number of lines to draw
        length: 6, // The length of each line
        width: 4, // The line thickness
        radius: 8, // The radius of the inner circle
        corners: 0.05, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#333', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parei
    };
});

Template.Feed.events({
    // Events
});

Template.Feed.helpers({

    // Log Helper Function
    log: function () {
        var template = Template.instance();
        console.log(template);
    }
});



Template.Feed.onDestroyed(function () {
  let template = this;
  // proceed with whatever i'm going to do here
});


/////////////////////////////////
// FeedHeader
/////////////////////////////////

//This is how I setup my life cycles. We also order our template files in this exact order.
Template.FeedHeader.onCreated(function () {
  var template = this;

    // Subscribe to the Items collection on Feed Page
    this.subscribe("feeds");
});


Template.FeedHeader.onRendered(function() {
    var template = this;

    console.log('---------- FeedHeader Rendered ----------');
    console.log('Feed Data:', template);
    console.log('-----------------------------------------');


});

Template.FeedHeader.events({

});

Template.FeedHeader.helpers({

    // Swap out small 48x48 portrait for original by modifying the URL - https://dev.twitter.com/overview/general/user-profile-images-and-banners
    enlarge_portrait: function (portrait = undefined ) {
        return portrait.replace('_normal.', '_bigger.');
    },

    feed: function() {
        var template = Template.instance();
        console.log('template:', template);

        return Feeds.findOne({handle: template.data.handle});
    },


    // Log Helper Function
    log: function () {
        var template = Template.instance();
        console.log("log: ", template);
    }
});



Template.FeedHeader.onDestroyed(function () {
  let template = this;
  // proceed with whatever i'm going to do here
});