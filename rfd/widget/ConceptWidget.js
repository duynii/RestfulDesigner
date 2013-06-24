define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/ConceptWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", "rfd/widget/MakeRepDialog", "rfd/Representation",
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/Dialog", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus",
        "rfd/controller/controller_concepts"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, MakeRepDialog, Representation, Branch, Section,
        classStyle,
        Menu, MenuItem, Dialog,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil,
        controller)
    {
        return declare("ConceptWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments);

                var fullRep = new Representation("Full", this.resource.concept.getPropertyNames());
                this.selectRep.addOption({value: fullRep, label: fullRep});
                /*
                baseArray.forEach(this.resource.representations, function(rep)
                {
                    this.selectRep.addOption({value: rep, label:rep});
                },
                this);
*/

                var resource = this.resource;
                this.selectRep.on("change", function(newValue)
                {
                    console.info("New selected rep: " + JSON.stringify(newValue));
                    resource.setSelectedRep(newValue);
                });

                this.createButton.on("click", lang.hitch(this, function()
                {
                    var d = new MakeRepDialog({
                        concept: this.resource.concept,
                        onFinish: lang.hitch(this, function(formData)
                        {
                            var rep = new Representation(formData.name, formData.fields);
                            this.selectRep.addOption({value: rep, label: rep});
                            this.selectRep.set('value', rep);

                            this.resource.addRep(rep);
                            //if the representation is not already saved, add it
                            d.hide();
                        }),
                        onHide: function() {
                            d.destroyRecursive();
                        }
                    });
                    d.show();
                }));

                this.methodWidget.methods = this.resource.methods;
                this.methodWidget.allowed = [];
                this.methodWidget.init();

                this.methodWidget.setDisabled(true);
            },
            postCreate: function()
            {
                this.inherited(arguments);


            },
            _saveForm : function() {

            }
        });
    }
); // and that's it!
