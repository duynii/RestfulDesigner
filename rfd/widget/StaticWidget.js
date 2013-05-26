define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/StaticWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog)
    {
        return declare("StaticWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource, branch) 
            {
                this.resource = templateResource;
                this.spanNode.innerHTML = this.resource;
                //Set the identifier for editing.
                this.resource_id.set('value', this.resource.toString());
            },
            setErrorMsg: function(msg)
            {
                this.errorNode.innerHTML = msg;
                domStyle.set(this.errorNode, "visibility", "visible");
            },
            resetErrorMsg: function()
            {
                this.errorNode.innerHTML = "";
                domStyle.set(this.errorNode, "visibility", "hidden");
            },
            postCreate: function()
            {
                this.inherited(arguments);

                //this.spanNode.innerHTML = "Blah";

                on(this.domNode, "mouseover", lang.hitch(this, function()
                {
                    popup.open(
                    {
                        popup: this.tooltipdialog,
                        around: this.domNode
                    });
                }));
                this.tooltipdialog.on("mouseLeave", function(e) {
                    //console.log("mouseLeave widget");
                    popup.close(this);
                });

                // Set up identifier editing
                this.resource_id.set("onChange", lang.hitch(this, function(newValue)
                {
                    console.log("onChange caught");
                    if(newValue != this.resource.id &&
                        this.onCheckResourceIdChange(this.branch, this.resource) == true) 
                    {
                        this.resource.setId(newValue); // Set it
                        this.spanNode.innerHTML = this.resource;
                    }
                }));

            },
            // Event function to override
            onCheckResourceIdChange: function(branch, resource) { return true; }
        });
    }
); // and that's it!
