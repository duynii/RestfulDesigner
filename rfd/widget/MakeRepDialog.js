define(["dojo/_base/declare", "dijit/Dialog", "dojo/_base/array",
        "dojo/text!./templates/MakeRepDialog.html", 
        "dojo/dom-style", "dojo/_base/fx", "dojo/_base/lang", 
        "dojo/on", "dojo/parser",  "dojo/mouse", "dojo/json", "dojo/query", "dojo/dom-attr",
        "dojo/dom-construct", "dojo/dom", 
        "dijit/registry",
        "dijit/form/Select",
        "dijit/form/Textarea",
        "rfd/PartialConcept_R", "rfd/Concept_R", "rfd/Collection_R", "rfd/Representation",
        "rfd/StaticResource", "rfd/Custom_R", "rfd/TemplatedResource"],

    function(declare, Dialog, baseArray, template, domStyle, 
                baseFx, lang, on, parser, mouse, JSON, query, domAttr,
                domConstruct, dom,
                registry,
                SelectWidget, TextareaWidget,
                Partial_R, Concept_R, Collection_R, Representation, Static_R, Custom_R, Templated_R)
    {
        return declare( "NewResourceDialog",[ Dialog], 
        {
            buildRendering: function()
            {
                this.inherited(arguments);
                this.set('content', template);

                if(typeof this.concept === 'undefined') {
                    console.error("concept must be set in the constructor params - {concept: <concept>}");
                }

            },
            postCreate: function()
            {
                this.inherited(arguments);


                //Set concept name
                dom.byId("conceptName").innerHTML = this.concept.name;

                var fieldNames = baseArray.map(this.concept.properties, function(prop){
                    return prop.name;
                });

                baseArray.forEach(fieldNames, function(field, index)
                {
                    //select.addOption({value: field, label: field}); //Add field names for selection
                    domConstruct.create("option", {value: field, innerHTML: field}, "selectProps");
                });

                //var allFieldsProp = new Representation("Full", fieldNames);
                //this.selectProps.addOption({value: allFieldsProp, label: allFieldsProp.id});
                //this.selectProps.set('value', allFieldsProp);
                this.on("submit", lang.hitch(this, function(e)
                {
                    e.preventDefault();

                    var form = registry.getEnclosingWidget(e.target);
                    
                    if(form.isValid()) {
                        this._processForm(form);
                    }
                }));
            },
            _processForm: function(form)
            {
                var data = form.get('value');
                console.info("formRep: " + JSON.stringify(data));

                if(data.name == "") {
                    alert("Please specify a representation name");
                    return;
                }
                else if(data.fields.length == 0 ) {
                    alert("Please select field or close popup window");
                    return;
                }

                this.onFinish(data); // returns array
            },
            onFinish: function(rep) 
            {
                console.log("default onFinish");
            }   
        });
    }
); // and that's it!
