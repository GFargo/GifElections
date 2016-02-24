// Global Helpers for Client Side

// linkify - wrap a url in an <a href> tag
Template.registerHelper( 'linkify', ( string ) => {
    return GifElections.Utils.Html.linkify(string);
});


// formatTextForHTML - Prep and Sanitize HTML output
Template.registerHelper( 'formatTextForHTML', (content) => {
    // Prep content to be HTML
    (typeof content !== undefined ? content : '');
    let safeContent = Blaze._escape(content);
        // Handlify any URLs in the Content
        safeContent = GifElections.Utils.Html.handlify(safeContent);
        // Hashify any URLs in the Content
        safeContent = GifElections.Utils.Html.hashify(safeContent);
        // Linkify any URLs in the Content
        safeContent = GifElections.Utils.Html.linkify(safeContent);
        // Add Support for line breaks
        // safeContent = safeContent.replace(/\n/g, '<br/>');
        // Convert any Emojis
        safeContent = Emojis.parse(safeContent);
        // Flag String as 'Safe'
        safeContent = new Spacebars.SafeString(safeContent);

        return safeContent;
});
