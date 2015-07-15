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



////////////////////////////////
///// SimpleSchema
////////////////////////////////

this.Schemas = this.Schemas || {};

// Feed Info Schema
this.Schemas.FeedInfoSchema = new SimpleSchema({
    latestId: {
        type: String,
    },
    "affiliation": {
        type: String,
        optional: true
    },
    "portrait": {
        type: String,
        optional: true
    },
    "description": {
        type: String,
        optional: true
    },
});

// Feed Schema
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
    "feedInfo": {
        type: this.Schemas.FeedInfoSchema
    }
});


this.Feeds.attachSchema(this.Schemas.Feeds);




////////////////////////////////
///// COLLECTION HELPERS
////////////////////////////////
this.Feeds.helpers({


});