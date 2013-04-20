//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/CollectionButton.js
define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!./templates/CollectionButton.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse"],

    function(declare, _WidgetBase, _TemplatedMixin, template, domStyle, baseFx, lang, on, mouse)
    {
        return declare([_WidgetBase, _TemplatedMixin], 
        {
            // Some default values for our author
            // These typically map to whatever you're passing to the constructor
            name: "Collection empty",
            concept: null,
 
            // Our template - important!
            templateString: template,
        
            // A class to be applied to the root node in our template
            baseClass: "collectionResource",
 
            // Colors for our background animation
            baseBackgroundColor: "#009",
            mouseBackgroundColor: "#225",

            postCreate: function()
            {
                // Get a DOM node reference for the root of our widget
                var domNode = this.domNode;
             
                // Run any parent postCreate processes - can be done at any point
                this.inherited(arguments);

                // Set the name
                domNode.innerHTML = "{null}";
            },

            _setConceptAttr: function(concept) 
            {
                console.log("Custom setter for concept called");
                if (concept != "") 
                {
                    // Save it on our widget instance - note that
                    // we're using _set, to support anyone using
                    // our widget's Watch functionality, to watch values change
                    this._set("concept", concept);
             
                    // Using our avatarNode attach point, set its src value
                    // this.avatarNode.src = concept;
                    this.domNode.innerHTML = "{" + concept.name + "}";
                }
            }

    
        });
    }
); // and that's it!
