Meteor.publish('feeds', function (handle) {

    console.log('Publish This:', this._session);
    var feeds = Feeds.find();

    if (feeds) {
        return feeds;
    }

    return this.ready();
});
