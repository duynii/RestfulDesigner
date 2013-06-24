define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/PartialWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", "rfd/widget/MakeRepDialog", "rfd/Representation",
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, MakeRepDialog, Representation,
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil)
    {
        return declare("PartialWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments);

                // Do not allow modification of method, as defaults are expected                
                this.methodWidget.methods = this.resource.methods;
                this.methodWidget.allowed = [];
                this.methodWidget.init();
                this.methodWidget.hideDetails();
                this.methodWidget.setDisabled(true);
            },
            postCreate: function()
            {
                this.inherited(arguments);

                this.createButton.on("click", lang.hitch(this, function()
                {
                    var d = new MakeRepDialog({
                        concept: this.resource.concept,
                        onFinish: lang.hitch(this, function(formData)
                        {
                            // Override the previous representation
                            var rep = new Representation(formData.name, formData.fields);
                            this.resource.setSelectedRep(rep);
                            //if the representation is not already saved, add it
                            d.hide();
                        }),
                        onHide: function() {
                            d.destroyRecursive();
                        }
                    });
                    d.show();
                }));
            }
        });
    }
); // and that's it!
