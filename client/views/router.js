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
Router.route('/feed/:handle', {
	name: "feed",
	template: 'FeedList',
	data: function(){
		console.log("Handle Query", this.params);
		return Feeds.findOne({handle: this.params.handle});
	}
});

Router.route('/tag/:hashtag', {
	name: "TagList",
	data: function(){
		console.log("Hashtag Query", this.params);
	}
});