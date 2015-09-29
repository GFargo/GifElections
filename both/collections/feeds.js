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

// Portrait Schema
this.Schemas.PortraitSchema = new SimpleSchema({
    url: {
        type: String,
        optional: true
    },
    size: {
        type: String,
        optional: true
    },
    caption: {
        type: String,
        optional: true
    }
});

// Feed Info Schema
this.Schemas.FeedInfoSchema = new SimpleSchema({
    since_id: {
        type: String,
        optional: true,
        defaultValue: -1
    },
    max_id: {
        type: String,
        optional: true,
        defaultValue: -1
    },
    affiliation: {
        type: String,
        optional: true
    },
    portrait: {
        type: this.Schemas.PortraitSchema,
        optional: true
    },
    description: {
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