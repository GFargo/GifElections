
/////////////////////////////////
// Item
/////////////////////////////////
Template.Item.onRendered(function() {
    var template = this;

    // console.log('Item Rendered', template);

});

Template.Item.events({

});

Template.Item.helpers({

    // TODO: Return Type Icon i.e.  Gif or Movie
    type: function() {
        var template = Template.instance();
        // template.data.type
    },

    // fromNow: function(time) {
    //     return moment(time, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').fromNow();
    // },

    // calendar: function(time) {
    //     return moment(time, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').calendar();
    // },

    // Log Helper Function
    log: function() {
        var template = Template.instance();
        // console.log(template);
    }
});



/////////////////////////////////
// ItemMedia
/////////////////////////////////
Template.ItemMedia.onRendered(function() {
    let template = this,
        mediaElementConfig;

    console.log('Feed Item Media template:', template.data.media);

    if (template.$('video').hasClass('movie')) {
        mediaElementConfig = {
            loop: true,
            enablePluginSmoothing: true,
            features: ['playpause','loop','current','progress','duration','volume','sourcechooser', 'fontawesome'],
            success: function (mediaElement, domObject) {
                mediaElement.addEventListener('canplay', function(e) {
                // mediaElement.play();
                }, false);
            },
        }
    } else {
        mediaElementConfig = {
            loop: true,
            // force iPad's native controls
            iPadUseNativeControls: false,
            // force iPhone's native controls
            iPhoneUseNativeControls: false,
            // force Android's native controls
            AndroidUseNativeControls: false,
            pauseOtherPlayers: false,
            enablePluginSmoothing: true,
            // videoWidth: template.data.media.size.w,
            // videoHeight: template.data.media.size.h,
            features: ['playpause','loop', 'fontawesome'],
            success: function (mediaElement, domObject) {
                mediaElement.addEventListener('canplay', function(e) {
                    console.log('Canplay Callback', mediaElement, domObject);

                    $(mediaElement).closest('.item-media').on('mouseenter', function(event) {
                        console.log('Mouse Enter');
                        mediaElement.play();
                    }).on('mouseleave', function(event) {
                         console.log('Mouse Leave');
                        mediaElement.pause();
                    });

                }, false);
            },
        }
    }
    template.$('video').mediaelementplayer(mediaElementConfig);

});

Template.ItemMedia.events({



});

Template.ItemMedia.helpers({

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
