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
	template: 'SingleFeed',
	data: function(){
		console.log("Route >> Handle >> ", this.params);
		return {
			handle: this.params.handle,
		}
	}
});

// Hashtags
Router.route('/tag/:hashtag', {
	name: "TagList",
	data: function(){
		console.log("Route >> Hashtag >> ", this.params);
	}
});