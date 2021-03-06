Meteor.subscribe("feeds");


this.App = {};
this.Helpers = {};

Meteor.startup(function() {



});





////////////////////////////////
//// ROUTER
////////////////////////////////

this.menuItemClass = function(routeName) {
	if(!Router.current() || !Router.current().route) {
		return "";
	}

	if(!Router.routes[routeName]) {
		return "";
	}

	var currentPath = Router.routes[Router.current().route.getName()].handler.path;
	var routePath = Router.routes[routeName].handler.path;

	if(routePath === "/") {
		return currentPath == routePath ? "active" : "";
	}

	return currentPath.indexOf(routePath) === 0 ? "active" : "";
};

Helpers.menuItemClass = function(routeName) {
	return menuItemClass(routeName);
};

////////////////////////////////
//// HELPERS
////////////////////////////////


// Time Helpers
Helpers.fromNow = function (time) {
	if(time) {
		return moment(time, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').fromNow();
	}
}
Helpers.calendar = function (time) {
	if(time) {
		return moment(time, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').calendar();
	}
}

// Type Helpers
Helpers.booleanToYesNo = function(b) {
	return b ? "Yes" : "No";
};

Helpers.integerToYesNo = function(i) {
	return i ? "Yes" : "No";
};

Helpers.integerToTrueFalse = function(i) {
	return i ? "True" : "False";
};

_.each(Helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper)
});

