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


this.Schemas.TweetSchema = new SimpleSchema({
    tweetId: {
        type: String,
        min: 18,
        max: 20
    },
    tweetGif: {
        type: String,
    },
    tweetContent: {
        type: String,
        max: 160
    },
    tweetAuthor: {
        type: String,
        defaultValue: 'anon',
        optional: true
    },
    tweetDate: {
        type: Date
    },

});

this.Schemas.Items = new SimpleSchema({
    dateCreated: {
        type: Date,
    },
    tweet: {
        type: this.Schemas.TweetSchema
    }
});


this.Items.attachSchema(this.Schemas.Items);


