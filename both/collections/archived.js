this.Archived = new Mongo.Collection("archived");

this.Archived.userCanInsert = function(userId, doc) {
	return true;
}

this.Archived.userCanUpdate = function(userId, doc) {
	return true;
}

this.Archived.userCanRemove = function(userId, doc) {
	return true;
}

this.Schemas = this.Schemas || {};

this.Schemas.Archived = new SimpleSchema({
});

this.Archived.attachSchema(this.Schemas.Archived);
