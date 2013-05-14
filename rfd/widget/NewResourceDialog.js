//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare", "dijit/Dialog",
        "dojo/text!./templates/NewResource.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse",
        "dojo/dom-construct"],

    function(declare, Dialog, template, domStyle, 
                baseFx, lang, on, mouse, domConstruct)
    {
        return declare( "NewResourceDialog",[ Dialog], 
        {
            avatar: null,
            postCreate: function()
            {
                this.inherited(arguments);

                this.set("content", template);
            },
            _setAvatarAttr: function(imagePath) 
            {
                // We only want to set it if it's a non-empty string
                if (imagePath != "") {
                    // Save it on our widget instance - note that
                    // we're using _set, to support anyone using
                    // our widget's Watch functionality, to watch values change
                    this._set("avatar", imagePath);
             
                    // Using our avatarNode attach point, set its src value
                    this.avatarNode.src = imagePath;
                }
            }

    
        });
    }
); // and that's it!
