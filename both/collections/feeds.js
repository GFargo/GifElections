this.Feeds = new Mongo.Collection("feeds");

this.Feeds.userCanInsert = function(userId, doc) {
	return true;
}

this.Feeds.userCanUpdate = function(userId, doc) {
	return true;
}

this.Feeds.userCanRemove = function(userId, doc) {
	return true;
}

this.Schemas = this.Schemas || {};

this.Schemas.Feeds = new SimpleSchema({
    "name": {
        type: String
    },
    "handle": {
        type: String
    },
    "hashtags.$.tag": {
        type: String,
        optional: true
    },
});

this.Feeds.attachSchema(this.Schemas.Feeds);




////////////////////////////////
///// HELPERS
////////////////////////////////
this.Feeds.helpers({


});