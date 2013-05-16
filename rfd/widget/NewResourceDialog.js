//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare", "dijit/Dialog",
        "dojo/text!./templates/NewResource.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", "dojo/on", "dojo/mouse", "dojo/json",
        "dojo/dom-construct",
        "dijit/registry",
        "dijit/form/Select",
        "rfd/PartialConcept_R", "rfd/Concept_R", "rfd/Collection_R",
        "rfd/StaticResource", "rfd/Custom_R", "rfd/TemplatedResource"],

    function(declare, Dialog, template, domStyle, 
                baseFx, lang, on, mouse, JSON,
                domConstruct,
                registry,
                SelectWidget,
                Partial_R, Concept_R, Collection_R, Static_R, Custom_R, Templated_R)
    {
        return declare( "NewResourceDialog",[ Dialog], 
        {
            avatar: null,
            select: null,
            branch: null,
            isAdded: false,
            //On success, the dialog will hide and set this attribute 
            // with new resource
            newResource: null,
            buildRendering: function()
            {
                this.inherited(arguments);
                this.set("content", domConstruct.toDom(template));
            },
            onFinish: function(res) {},
            postCreate: function()
            {
                this.inherited(arguments);
                //this.set("content", template);
                var stack = registry.byId("NRStack");
                //Show different form depending on the select widget
                this.select = new SelectWidget(
                {
                    onChange: function(newValue)
                    {
                        console.log("New select:" + newValue);
                        stack.selectChild("NR" + newValue, true);
                    }
                }, "NRSelect");


                var staticForm = registry.byId("staticForm");
                staticForm.runSubmit = lang.hitch(this, this.onStaticSubmit);
                registry.byId("templatedForm").runSubmit = lang.hitch(this, this.onTemplatedSubmit);
                registry.byId("customForm").runSubmit = lang.hitch(this, this.onCustomSubmit);
                registry.byId("collectionForm").runSubmit = lang.hitch(this, this.onCollectionSubmit);
                registry.byId("conceptForm").runSubmit = lang.hitch(this, this.onConceptSubmit);
                registry.byId("partialForm").runSubmit = lang.hitch(this, this.onPartialSubmit);
                this.execute = function(form)
                {
                    console.log("onexecute " + form);
                };
                this.on("submit", function(e)
                {
                    e.preventDefault();
                    console.log("NewResourceDialog caught submit: " + e.target.id);
                    var form = registry.getEnclosingWidget(e.target);
                    form.runSubmit(form);
                });
            },
            init: function(branch)
            {
                this.branch = branch;
                // To do
                this.select.options.push({value: "collection", label: "Collection resource"});
                this.select.options.push({value: "concept", label: "Concept resource"});
            },
            onStaticSubmit: function(form)
            {
                var data = form.getValues();
                console.log("Static submit: " + JSON.stringify(data));
                if( this.branch.hasResourceId(data.name) ) {
                    alert("Branch already has resource with identifier: " + data.name);
                    return;
                }
                this.isAdded = true;
                this.newResource = new Static_R(data.name, "/");
                this.hide();
                this.onFinish(this.newResource);
            },
            onTemplatedSubmit: function(form)
            {
                var data = form.getValues();
                console.log("Templated submit: ");

                // test to see if example data is correct

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
