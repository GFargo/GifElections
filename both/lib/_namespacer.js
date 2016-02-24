// The only time we ever declare a global variable
GifElections = {};

// Namespacer Utility
// handles adding new objects & variables to the app namespace
GifElections._namespacer = function( namespace, members ) {
    let names = namespace.split("."),
        context = this;

    // Add namespaces if they don’t already exist
    _.each(names, function(name) {
        if (name.length === 0) {
            throw "Invalid namespace: " + namespace;
        }
        if (!context[name]) {
            context[name] = {};
        }
        context = context[name];
    });

    // Add members to namespace
     _.each(members, function(value, key) {
        context[key] = value;
    });
};

