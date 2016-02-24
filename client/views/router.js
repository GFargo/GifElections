/////////////////////////////////
// Router Config
/////////////////////////////////
Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var freeRoutes = [
	"home",
	"about"
];

// get a handle for the controller.
// in a template helper this would be
// var controller = Iron.controller();
var controller = this;

// reactive getParams method which will invalidate the comp if any part of the params change
// including the hash.
// var params = controller.getParams();

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});


/////////////////////////////////
// Router Map
/////////////////////////////////
Router.map(function () {
	this.route("home", {path: "/", controller: "HomeController"});
	this.route("about", {path: "/about", controller: "AboutController"});
});


/////////////////////////////////
// Dynamic Routes
/////////////////////////////////

// Handles
Router.route('/feed/:handle', {
	name: "feed",
	template: 'Feed',
	data: function(){
		console.log("Route >> Handle >> ", this.params);
		return {
			handle: this.params.handle,
		}
	}
});

// Hashtags
Router.route('/tag/:hashtag', {
	name: "tags",
	data: function(){
		console.log("Route >> Hashtag >> ", this.params);
	}
});

