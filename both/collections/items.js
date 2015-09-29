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

// MEDIA
this.Schemas.MediaSchema = new SimpleSchema({
    content_type: {
        type: String,
        defaultValue: 'video/mp4'
    },
    url: {
        type: String,
    },
    file_ext: {
        type: String,
        defaultValue: 'mp4'
    },
    aspect_ratio: {
        type: [Object],
        minCount: 1,
        maxCount: 2
    },
});

// META
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
});


// TWEET
this.Schemas.TweetSchema = new SimpleSchema({
    id: {
        type: String,
    },
    media: {
        type: this.Schemas.MediaSchema,
    },
    text: {
        type: String,
        max: 160
    },
    author: {
        type: String,
        defaultValue: 'anon',
        optional: true
    },
    meta: {
        type: this.Schemas.MetaSchema,
    },
    date: {
        type: Date
    },
});

// ITEM _ ROOT SCHEMA
this.Schemas.Items = new SimpleSchema({
    feed: {
        type: String
    },
    tweetType: {
        type: String
    },
    tweet: {
        type: this.Schemas.TweetSchema
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