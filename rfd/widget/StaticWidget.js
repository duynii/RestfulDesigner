define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/StaticWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil)
    {
        return declare("StaticWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
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

                on(this.spanNode, "mouseover", lang.hitch(this, function()
                {
                    popup.open(
                    {
                        popup: this.tooltipdialog,
                        around: this.spanNode
                    });

                    focusUtil.focus(this.resource_id.domNode);
                }));
                this.tooltipdialog.on("mouseleave", function(e) {
                    if(e.originalTarget.toString().indexOf("HTMLDivElement") != -1) {
                        popup.close(this);
                    }
                });

                // Set up identifier editing
                this.resource_id.set("onChange", lang.hitch(this, function(newValue)
                {
                    //console.log("onChange caught");
                    if(newValue != this.resource.id &&
                        this.onCheckResourceIdChange(this.resource) == true) 
                    {
                        this.resource.setId(newValue); // Set it
                        this.spanNode.innerHTML = this.resource;
                        // Fires handler for parent
                        this.onResourceIdChanged();
                    }
                }));

                //Set branching out event
                //Right click menu
                var itemBranchOut = new MenuItem(
                    {
                        label: "New Branch",
                        onClick: lang.hitch(this, this._onBranchOutClick)
                    }
                );

                var itemDel = new MenuItem ({
                    label: 'Delete',
                    onClick: lang.hitch(this, this._onDeleteResource)
                });

                var menu = new Menu({});
                menu.addChild(itemBranchOut);
                menu.addChild(itemDel);
                menu.bindDomNode(this.branchButton.domNode);
                menu.startup();
                // Set click
                this.branchButton.on("click", lang.hitch(this, this._onBranchOutClick));
                this.on("dblclick", lang.hitch(this, function()
                {
                    if( confirm("Delete this URI element? " + this.resource) ) {
                        this._onDeleteResource();
                    }
                }));
            },
            _onDeleteResource: function() {
                this.onDeleteResource();
            },
            onDeleteResource: function() {
                console.log("onDeleteResource of " + this.id);
            },
            _onBranchOutClick: function() {
                this.onBranchOutClick(this.resource);
            },
            //Event branchOutClick
            onBranchOutClick : function(resource) {
                console.info("onBranchOutClick: " + resource);
            },
            onResourceIdChanged: function() {
                console.info("Default handler for resource id changed");
            },
            // Event function to override
            //TODO check that this renamed branch is unique
            onCheckResourceIdChange: function(resource) { return true; }
        });
    }
); // and that's it!
