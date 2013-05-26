//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare", "dijit/Dialog", "dojo/_base/array",
        "dojo/text!./templates/NewResource.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", 
        "dojo/on", "dojo/parser",  "dojo/mouse", "dojo/json", "dojo/query", "dojo/dom-attr",
        "dojo/dom-construct",
        "dijit/registry",
        "dijit/form/Select",
        "dijit/form/Textarea",
        "rfd/PartialConcept_R", "rfd/Concept_R", "rfd/Collection_R",
        "rfd/StaticResource", "rfd/Custom_R", "rfd/TemplatedResource"],

    function(declare, Dialog, baseArray, template, domStyle, 
                baseFx, lang, on, parser, mouse, JSON, query, domAttr,
                domConstruct,
                registry,
                SelectWidget, TextareaWidget,
                Partial_R, Concept_R, Collection_R, Static_R, Custom_R, Templated_R)
    {
        return declare( "NewResourceDialog",[ Dialog], 
        {
            avatar: null,
            select: null,
            branch: null,
            concepts: null,
            buildRendering: function()
            {
                this.inherited(arguments);
                this.set("content", template);
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
                registry.byId("partialForm").runSubmit = lang.hitch(this, this.onPartialSubmit);
                registry.byId("entityForm").runSubmit = lang.hitch(this, this.onConceptSubmit);
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

                var json_doc = registry.byId("json_doc");
                json_doc.set("value", '{ "title": "my document",' + "\n" +
                                        '   "data1": "my data"}');

            },
            init: function(branch, concepts)
            {
                this.branch = branch;
                concepts = typeof concepts !== 'undefined' ? concepts : null;
                this.concepts = concepts;
                // To do
                var last = this.branch.lastResource();
                if(concepts != null && last != null) 
                {
                    if(last.declaredClass == 'Collection_R') {
                        this.select.options.push({value: "entity", label: "Concept resource"});
                    }
                    else if(last.declaredClass == 'Concept_R') {
                        // This resource rely on the parent's Concept_R only
                        this.select.options.push({value: "partial", label: "Partial resource"});
                    }
                    else {
                        // No need to setup collection resource, it can be for any entity
                        this.select.options.push({value: "collection", label: "Collection resource"});
                        // No need to set up concept resource, it can be for any entity too
                        //  But it should by default select the same entity as the parent's if that
                        //   parent is a collection resource
                        this.select.options.push({value: "entity", label: "Concept resource"});
                    }
                }

                this.initWidgets(this.branch, this.concepts);
            },
            initWidgets: function(branch, concepts)
            {

                //There are three labels and three enity selects
                var labelsList = query("label.id_label", this.domNode);
                query("[name='entity_id']", this.domNode).forEach(function(node, index)
                {
                    var label = labelsList[index];
                    var sel = new SelectWidget(
                        {
                            onChange: function(newValue) {
                                label.innerHTML = newValue;
                                //domAttr.set(label, "value", newValue);
                            }
                        }, 
                        node
                    );
                    baseArray.forEach(this.concepts, function(item, index)
                    {
                        if(index == 0) {
                            label.innerHTML = item.id;
                        }
                        sel.options.push({value: item.id, label: item.id});
                    }, 
                    this);
                },
                this);
            },
            onStaticSubmit: function(form)
            {
                var data = form.get('value');
                console.log("Static submit: " + JSON.stringify(data));
                //TBD this is not needed, unnessarily restrictive
                /*
                if( this.branch.hasResourceId(data.name) ) {
                    alert("Branch already has resource with identifier: " + data.name);
                    return;
                }
                */
                
                //this.isAdded = true;
                //this.newResource = new Static_R(data.name, "/");
                var res = new Static_R(data.name, "/");
                this.onFinish(res);
                //this.hide();
            },
            onTemplatedSubmit: function(form)
            {
                var data = form.get('value');
                console.log("Templated submit: " + JSON.stringify(data));

                //TBD this is not needed, unnessarily restrictive
                /*
                if( this.branch.hasResourceId(data.name) ) {
                    alert("Branch already has resource with identifier: " + data.name);
                    return;
                }
                */
                // Checks that only valid JSON are accepted
                var doc = JSON.parse(data.json_doc, true);
                if( typeof doc !== 'undefined' && doc != null)
                {
                    console.log("Parsed json: " + JSON.stringify(doc));
                    var res = new Templated_R(data.name, "/", data.json_doc, null);
                    this.onFinish(res);
                    //this.hide();
                }
                
                if(typeof doc === 'undefined')
                {
                    alert("JSON is invalid, check it again");
                }

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
