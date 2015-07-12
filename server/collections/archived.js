Archived.allow({
	insert: function (userId, doc) {
		return Archived.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Archived.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Archived.userCanRemove(userId, doc);
	}
});

Archived.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Archived.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Archived.before.remove(function(userId, doc) {
	
});

Archived.after.insert(function(userId, doc) {
	
});

Archived.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Archived.after.remove(function(userId, doc) {
	
});
