/////////////////////////////////
// MainMenu
/////////////////////////////////
Template.MainMenu.rendered = function() {
    $(".menu-item-collapse .dropdown-toggle").each(function() {
        if($(this).find("li.active")) {
            $(this).removeClass("collapsed");
        }
        $(this).parent().find(".collapse").each(function() {
            if($(this).find("li.active").length) {
                $(this).addClass("in");
            }
        });
    });


};

Template.MainMenu.events({

});

Template.MainMenu.helpers({

});


