//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ListItem.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", 
        "dojo/dom-geometry", 
        "dojo/dom-construct", 
        "rfd/model/Branch", 
        "rfd/model/Section", 
        "dojo/_base/fx", 
        "dojo/_base/array",
        "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        baseFx, baseArray, lang)
    {
        return declare([_WidgetBase, _TemplatedMixin], 
        {
            // Some default values for our author
            // These typically map to whatever you're passing to the constructor
            name: "No item",
            url: "/ custom ListItem", // The model item
            branch: null,  
            parentDom: null,
            // Our template - important!
            templateString: template,
            cssButtonMap: new Dictionary(),
 
            // A class to be applied to the root node in our template
            baseClass: "listItem",
 
            // Colors for our background animation
            baseBackgroundColor: "#fff",
            mouseBackgroundColor: "#def",
            initCssButtonMap: function()
            {
                this.cssButtonMap.add("rfd/StaticResource", "staticResource");
                this.cssButtonMap.add("rfd/TemplatedResource", "templatedResource");
                this.cssButtonMap.add("rfd/Custom_R", "customResource");
                this.cssButtonMap.add("rfd/Concept_R", "individualResource");
                this.cssButtonMap.add("rfd/PartialConcept_R", "partialResource");
                this.cssButtonMap.add("rfd/Collection_R", "collectionResource");
            },
            constructor: function()
            {
            },
            _setBranchAttr: function(branch)
            {
                if(branch != null) 
                {
                    this.setBranch(branch);
                    this._set("branch", branch);
                }
            },
            _setUrlAttr: function(urlString) {
                // We only want to set it if it's a non-empty string
                if (urlString != "") 
                {
                    // Save it on our widget instance - note that
                    // we're using _set, to support anyone using
                    // our widget's Watch functionality, to watch values change
                    this._set("url", urlString);
             
                    // Using our avatarNode attach point, set its src value
                    //this.urlLabel.innerHTML = this.url;
                    console.log("set Url is called");
                }
            },


            postCreate: function()
            {
                console.log("ListItem postcreate called");
                this.initCssButtonMap();
            },

            setBranch: function(branch)
            {
                var active_section = branch.active;
                var inactive_section = branch.inactive;

                baseArray.forEach(inactive_section, function(resource, index)
                {
                    // create a dom under self
                    domConstruct.create(
                        "button", 
                        {
                            id: resource.id + '_' + this.id,
                            class: this.cssButtonMap.entry(resource.declaredClass) + " hidden",
                            innerHTML: resource.name
                        }, 
                        this.domNode
                    );
                    domConstruct.create(button,
                    {
                        id: resource.id + '_' + this.id + '_' + "slash",
                        class: "hidden",
                        innerHTML: "  /  "
                    }, this.domNode);
                });
                baseArray.forEach(active_section, function(resource, index)
                {
                    // create a dom under self
                    domConstruct.create("button", 
                    {
                        id: resource.id + '_' + this.id,
                        class: this.cssButtonMap.entry(resource.declaredClass), 
                        innerHTML: resource.name
                    }, 
                    this.domNode
                    );
                    domConstruct.create(
                        "button",
                        {
                            id: resource.id + '_' + this.id + '_' + "slash",
                            innerHTML: "  /  "
                        }, 
                        this.domNode
                    );
                });
            }
    
        });
    }
); // and that's it!
