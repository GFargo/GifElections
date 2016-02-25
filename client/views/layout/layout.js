/////////////////////////////////
// Global Layout
/////////////////////////////////
Template.layout.rendered = function() {
	// scroll to anchor
	$('body').on('click', 'a', function(e) {
		var href = $(this).attr("href");
		if(!href) {
			return;
		}
		if(href.length > 1 && href.charAt(0) == "#") {
			var hash = href.substring(1);
			if(hash) {
				e.preventDefault();

				var offset = $('*[id="' + hash + '"]').offset();

				if (offset) {
					$('html,body').animate({ scrollTop: offset.top - 60 }, 400);
				}
			}
		} else {
			if(href.indexOf("http://") != 0 && href.indexOf("https://") != 0 && href.indexOf("#") != 0) {
				$('html,body').scrollTop(0);
			}
		}
	});
	/*TEMPLATE_RENDERED_CODE*/
};




/////////////////////////////////
// PublicLayout
/////////////////////////////////
Template.PublicLayout.events({
	'click .slideToggle': function() {
		var clickedElement = event.target;
		// add/remove CSS classes to clicked element
	},


	'click .batch-refresh': function (event, template){
	 // use template here directly or if you need the data of an
	 // iteratee use Blaze.getData(event.currentTarget)
	 console.log('--------------------------------');
	 console.log('...Batch Refresh Started...');
	 console.log('--------------------------------');
	 Meteor.call('batchRefresh', template.data.handle, 200);
	}

});



