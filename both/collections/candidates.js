this.Candidates = new Mongo.Collection("candidates");

this.Candidates.userCanInsert = function(userId, doc) {
	return true;
}

this.Candidates.userCanUpdate = function(userId, doc) {
	return true;
}

this.Candidates.userCanRemove = function(userId, doc) {
	return true;
}

this.Schemas = this.Schemas || {};

this.Schemas.Candidates = new SimpleSchema({
});

this.Candidates.attachSchema(this.Schemas.Candidates);
