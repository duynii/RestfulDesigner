//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare", "dijit/Dialog",
        "dojo/text!./templates/NewResource.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/parser",
        "dojo/dom-construct",
        "dijit/registry",
        "dijit/form/Select"],

    function(declare, Dialog, template, domStyle, 
                baseFx, lang, on, mouse, parser,
                domConstruct,
                registry,
                SelectWidget)
    {
        return declare( "NewResourceDialog",[ Dialog], 
        {
            avatar: null,
            buildRendering: function()
            {
                this.inherited(arguments);
                this.set("content", domConstruct.toDom(template));
            },
            postCreate: function()
            {
                this.inherited(arguments);
                //this.set("content", template);




                var stack = registry.byId("NRStack");
                //Show different form depending on the select widget
                var sel = new SelectWidget(
                {
                    onChange: function(newValue)
                    {
                        console.log("New select:" + newValue);
                        stack.selectChild("NR" + newValue, true);
                    }
                }, "NRSelect");


                var staticForm = registry.byId("staticForm");
                staticForm.runSubmit = this.onStaticSubmit;
                registry.byId("templatedForm").runSubmit = this.onTemplatedSubmit;
                registry.byId("customForm").runSubmit = this.onCustomSubmit;
                registry.byId("collectionForm").runSubmit = this.onCollectionSubmit;
                registry.byId("conceptForm").runSubmit = this.onConceptSubmit;
                registry.byId("partialForm").runSubmit = this.onPartialSubmit;
                //var staticForm = registry.byId("staticForm");
                //staticForm
                this.on("submit", function(e)
                {
                    e.preventDefault();
                    console.log("NewResourceDialog caught submit: " + e.target.id);
                    var form = registry.getEnclosingWidget(e.target);
                    form.runSubmit();
                });
            },
            onStaticSubmit: function(form)
            {
                console.log("Static submit: ");
            },
            onTemplatedSubmit: function(form)
            {
                console.log("Templated submit: ");
            },
            onCustomSubmit: function(form)
            {
                console.log("Custom submit: ");
            },
            onCollectionSubmit: function(form)
            {
                console.log("Collection submit: ");
            },
            onConceptSubmit: function(form)
            {
                console.log("Concept submit: ");
            },
            onPartialSubmit: function(form)
            {
                console.log("Partial submit: ");
            },
            init: function()
            {
                // To do
                sel.options.push({value: "collection", label: "Collection resource"});
                sel.options.push({value: "concept", label: "Concept resource"});
            },
            func: function() {
                console.log("func called");
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
