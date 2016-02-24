/*
    Global HTML Helpers
    Some inspiration was gleamed from https://gist.github.com/arbales/1654670
*/

// Linkify
GifElections._namespacer('Utils.Html', { linkify : function( string = '') {
    let link_detection_regex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@\/?]*)?)(\s+|$)/gi;
    let result = string.replace(link_detection_regex, function(url) {
        // Check for trailing period
        if ( url.substr( -1) == "." ) {
            url = url.substring(url.length -1, 0);
            return '<a href="' + url + '">' + url + '</a>.';
        } else {
            return '<a href="' + url + '">' + url + '</a>';
        }
    });
    return result;
}});


// Handlify
GifElections._namespacer('Utils.Html', { handlify : function( string = '') {
    let link_detection_regex =/@(\w{1,15})\b/gi;
    let result = string.replace(link_detection_regex, function(handle) {
        return '<a href="http://www.twitter.com/' + handle + '">' + handle + '</a>';
    });
    return result;
}});


// Hashify
GifElections._namespacer('Utils.Html', { hashify : function( string = '') {
    let link_detection_regex =/(#[a-z\d-]+)/ig;
    let result = string.replace(link_detection_regex, function(hashtag) {
        return '<a href="http://www.twitter.com/' + hashtag + '">' + hashtag + '</a>';
    });
    return result;
}});