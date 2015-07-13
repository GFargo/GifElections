Feeds.allow({
	insert: function (userId, doc) {
		return Feeds.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Feeds.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Feeds.userCanRemove(userId, doc);
	}
});

Feeds.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.createdBy) doc.createdBy = userId;
});

Feeds.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Feeds.before.remove(function(userId, doc) {

});

Feeds.after.insert(function(userId, doc) {

});

Feeds.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Feeds.after.remove(function(userId, doc) {

});
