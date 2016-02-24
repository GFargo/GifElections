this.Items = new Mongo.Collection("items");

this.Items.userCanInsert = function(userId, doc) {
	return true;
}

this.Items.userCanUpdate = function(userId, doc) {
	return true;
}

this.Items.userCanRemove = function(userId, doc) {
	return true;
}

this.Schemas = this.Schemas || {};

///////////////
// FIELDS
///////////////

//     X dateCreated: New Date,
//     X tweetContent: String => ‘text’
//     X tweetGif: URL => Function() parse tweet content for URL with `.gif`ending
//     X tweetAuthor: String => ‘user’
//     X tweetDate: Date => ‘created_at’
//     X tweetId: String => ‘id_str’





////////////////////////////////
///// SimpleSchema
////////////////////////////////

// User
this.Schemas.UserSchema = new SimpleSchema({
    handle: {
        type: String,
    },
    name: {
        type: String,
    },
    website_url: {
        type: String,
        optional: true,
    },
    verified: {
        type: String,
    },
    location: {
        type: String,
        optional: true,
    },
    statuses_count: {
        type: String,
    },
    followers_count: {
        type: String,
    },
    profile_background_color: {
        type: String,
    },
    profile_link_color: {
        type: String,
    },
    profile_banner_url: {
        type: String,
    },
    profile_image_url: {
        type: String,
    },
});
// Media Size
this.Schemas.MediaSizeSchema = new SimpleSchema({
    w: {
        type: String,
    },
    h: {
        type: String,
    },
    resize: {
        type: String,
        optional: true,
        defaultValue: 'fit',
    },
    aspect_ratio: {
        type: [String],
        minCount: 1,
        maxCount: 2
    },
});

// Media
this.Schemas.MediaSchema = new SimpleSchema({
    id: {
        type: String,
    },
    type: {
        type: String
    },
    source_tweet_id: {
        type: String,
        optional: true,
    },
    source_user_id: {
        type: String,
        optional: true,
    },
    duration_millis: {
        type: String,
        optional: true,
    },
    size: {
        type: this.Schemas.MediaSizeSchema,
    },
    "variants.$.url": {
        type: String,
    },
    "variants.$.content_type": {
        type: String,
        defaultValue: 'video/mp4'
    },
    "variants.$.bitrate": {
        type: String,
        optional: true,
    },
});

// Meta
this.Schemas.MetaSchema = new SimpleSchema({
    retweet_count: {
        type: String,
        defaultValue: 'video/mp4'
    },
    favorite_count: {
        type: String,
    },
    possibly_sensitive: {
        type: Boolean,
        defaultValue: false
    },
    lang: {
        type: String,
        defaultValue: 'en'
    },
    timestamp_ms: {
        type: String,
        optional: true,
    },
    created_at: {
        type: String
    },
});


// TWEET
this.Schemas.TweetSchema = new SimpleSchema({
    id: {
        type: String,
    },
    text: {
        type: String,
        max: 160
    },
    url: {
        type: String,
    },
    media: {
        type: this.Schemas.MediaSchema,
    },
    meta: {
        type: this.Schemas.MetaSchema,
    },
});

// ITEM _ ROOT SCHEMA
this.Schemas.Items = new SimpleSchema({
    feed: {
        type: String
    },
    affiliation: {
        type: String
    },
    user: {
        type: this.Schemas.UserSchema,
    },
    tweet: {
        type: this.Schemas.TweetSchema
    },
    retweet: {
        type: [this.Schemas.TweetSchema],
        optional: true,
    }
});


this.Items.attachSchema(this.Schemas.Items);





////////////////////////////////
///// COLLECTION HELPERS
////////////////////////////////
this.Items.helpers({
    getLatestTweet: function(feedHandle) {
        const handle = feedHandle

        return Items.find({feed: handle},  {sort: { _id: -1 }}).limit(1);
    }

});