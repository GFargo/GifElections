Candidates.allow({
	insert: function (userId, doc) {
		return Candidates.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Candidates.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Candidates.userCanRemove(userId, doc);
	}
});

Candidates.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;


	if(!doc.createdBy) doc.createdBy = userId;
});

Candidates.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;


});

Candidates.before.remove(function(userId, doc) {

});

Candidates.after.insert(function(userId, doc) {

});

Candidates.after.update(function(userId, doc, fieldNames, modifier, options) {

});

Candidates.after.remove(function(userId, doc) {

});
