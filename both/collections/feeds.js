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
    description: {
        type: String,
        optional: true
    },
    url: {
        type: String,
        optional: true
    },
    followers_count: {
        type: String,
        optional: true
    },
    friends_count: {
        type: String,
        optional: true
    },
    statuses_count: {
        type: String,
        optional: true
    },
    profile_banner_url: {
        type: String,
        optional: true
    },
    profile_image_url: {
        type: String,
        optional: true
    },
    profile_background_color: {
        type: String,
        optional: true
    },
    profile_link_color: {
        type: String,
        optional: true
    },
    created_at: {
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