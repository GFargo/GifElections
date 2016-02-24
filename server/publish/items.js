Meteor.publish('items', function (feed, limit) {

    var items = Items.find({}, {limit: limit});

    if (items) {
        return items;
    }

    return this.ready();
});
