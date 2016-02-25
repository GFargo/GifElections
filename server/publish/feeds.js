Meteor.publish('feeds', function (handle) {

    // console.log('... Feeds Published ... this.session:', this._session);
    var feeds = Feeds.find();

    if (feeds) {
        return feeds;
    }

    return this.ready();
});
