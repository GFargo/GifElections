/////////////////////////////////
// Items
/////////////////////////////////
Template.Items.onRendered(function() {
    var template = this;

});


Template.Items.onCreated(function() {
    var template = this;

    // initialize the reactive variables
    template.loaded = new ReactiveVar(0);
    template.limit = new ReactiveVar(5);


    template.autorun(function () {

       // get the limit
       var limit = template.limit.get();

       console.log("Asking for "+limit+" posts…")

       // subscribe to the posts publication
       var subscription = template.subscribe('items', limit);

       // if subscription is ready, set limit to newLimit
       if (subscription.ready()) {
         console.log("> Received "+limit+" posts. \n\n")
         template.loaded.set(limit);
       } else {
         console.log("> Subscription is not ready yet. \n\n");
       }
    });


    template.items = function() {
        console.log('querying items');
        return Items.find({feed: template.data.handle}, {limit: template.loaded.get()});
        // return Items.find({}, {limit: template.loaded.get()});
    }

});


Template.Items.events({

    'click .load-more': function(event, template) {
        event.preventDefault();

        console.log('Load More Clicked', template);
        console.log('Current Router Params', Router.current().params);

        // get current value for limit, i.e. how many posts are currently displayed
         var limit = template.limit.get();

         // increase limit by 5 and update it
         limit += 5;
         template.limit.set(limit);


        if (Router.current().params.hash !== null) {

        } else {
            console.log('No Hash Detected', limit+5);
        }

        // Router.add
    },

});

Template.Items.helpers({

    items: function() {
        var template = Template.instance();

        console.log('Filtering By:', this.handle);
        console.log('Request', Items.find({handle: this.handle}, {sort: {createdAt: -1}}));
        // return Items.find({feed: this.handle}, {sort: {createdAt: -1}});
        return template.items();
    },



    // are there more posts to show?
    hasMorePosts: function () {
        return Template.instance().items().count() >= Template.instance().limit.get();
    },

    breakTimeReset: function() {
        Template.Items.doCount = 0;
    },

    breakTime: function () {
        count = Template.Items.doCount + 1;
        console.log(count);
        Template.Items.doCount = count;

        if (count % 2 == 0) {
            console.log("Started break");
            return true;
        } else {
            return false;
        }
    },

    // Log Helper Function
    log: function() {
        var template = Template.instance();
        // console.log(template);
    },
});



