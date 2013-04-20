//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!./templates/ListItem.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang"],

    function(declare, _WidgetBase, _TemplatedMixin, template, domStyle, baseFx, lang)
    {
        return declare([_WidgetBase, _TemplatedMixin], 
        {
            // Some default values for our author
            // These typically map to whatever you're passing to the constructor
            name: "No item",
            url: "/ custom ListItem", // The model item
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "listItem",
 
            // Colors for our background animation
            baseBackgroundColor: "#fff",
            mouseBackgroundColor: "#def",

            postCreate: function()
            {
                console.log("ListItem postcreate called");
            },

            _setUrlAttr: function(urlString) 
            {
                // We only want to set it if it's a non-empty string
                if (urlString != "") {
                    // Save it on our widget instance - note that
                    // we're using _set, to support anyone using
                    // our widget's Watch functionality, to watch values change
                    this._set("url", urlString);
             
                    // Using our avatarNode attach point, set its src value
                    this.urlLabel.innerHTML = this.url;
                }
            }

    
        });
    }
); // and that's it!
