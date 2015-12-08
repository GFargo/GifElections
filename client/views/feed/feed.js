/////////////////////////////////
// SingleFeed
/////////////////////////////////

//This is how I setup my life cycles. We also order our template files in this exact order.
Template.SingleFeed.onCreated(function () {
  //in this template, 'this' is the template instance.
  var template = this;
  // proceed with whatever i'm going to do here
});


Template.SingleFeed.onRendered(function() {
    var template = this;

    console.log('---------- SingleFeed Rendered ----------');
    console.log('Feed Data:', template.data);


});

Template.SingleFeed.events({

});

Template.SingleFeed.helpers({

    // Swap out small 48x48 portrait for original by modifying the URL - https://dev.twitter.com/overview/general/user-profile-images-and-banners
    enlarge_portrait: function (portrait = undefined ) {
        return portrait.replace('_normal.', '_bigger.');
    },

    feed: function() {
        return Feeds.findOne({handle: this.handle});
    },

    items: function() {
        console.log('FINDING:', this.handle);
        console.log('Request', Items.find({handle: this.handle}, {sort: {createdAt: -1}}));
        return Items.find({feed: this.handle}, {sort: {createdAt: -1}});
    },

    someHelper() {
     var template = Template.instance();
     //proceed with whatever
    },

    // Log Helper Function
    log: function () {
        var template = Template.instance();
        console.log(template);
    }
});

Template.SingleFeed.events({


    'click .batch-refresh': function (event, template){
     // use template here directly or if you need the data of an
     // iteratee use Blaze.getData(event.currentTarget)
     console.log('--------------------------------');
     console.log('...Batch Refresh Started...');
     console.log('--------------------------------');
     Meteor.call('batchRefresh', template.data.handle, 50);
    }


});


Template.SingleFeed.onDestroyed(function () {
  let template = this;
  // proceed with whatever i'm going to do here
});





/////////////////////////////////
// FeedItem
/////////////////////////////////
Template.FeedItem.onRendered(function() {
    var template = this;

    // console.log('FeedItem Rendered', template);

});

Template.FeedItem.events({

});

Template.FeedItem.helpers({

    // TODO: Return Type Icon i.e.  Gif or Movie ?

    type: function() {
        var template = Template.instance();
        // template.data.type

    },

    // Log Helper Function
    log: function() {
        var template = Template.instance();
        // console.log(template);
    }
});




/////////////////////////////////
// FeedItemMedia
/////////////////////////////////
Template.FeedItemMedia.onRendered(function() {
    let template = this,
        mediaElementConfig;

    if (template.$('video').hasClass('movie')) {
        mediaElementConfig = {
            loop: true,
            enablePluginSmoothing: true,
            features: ['playpause','loop','current','progress','duration','volume','sourcechooser'],
            success: function (mediaElement, domObject) {
                mediaElement.addEventListener('canplay', function(e) {
                // mediaElement.play();
                }, false);
            },
        }
    } else {
        mediaElementConfig = {
            loop: true,
            pauseOtherPlayers: false,
            enablePluginSmoothing: true,
            features: ['playpause','loop'],
            success: function (mediaElement, domObject) {
                mediaElement.addEventListener('canplay', function(e) {
                    mediaElement.play();
                }, false);
            },
        }
    }
    template.$('video').mediaelementplayer(mediaElementConfig);
});

Template.FeedItemMedia.events({



});

Template.FeedItemMedia.helpers({

    variants: function() {
        let template = Template.instance(),
            variants = template.data.media.variants,
            valid_formats = [];

        // Filter out Vars
        _.each(variants, function (variant) {
            if (! _.contains(['application/x-mpegURL', 'application/dash+xml'], variant.content_type)) {
                valid_formats.push(variant);
            }
        });

        return valid_formats;
    },


    isMovie: function() {
        var template = Template.instance();
        if (template.data.media.variants.length > 1) {
            return true;
        }
        return false;
    },

    // Log Helper Function
    log: function() {
        var template = Template.instance();
        console.log(template);
    }
});
