define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/CollectionWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus", "dijit/form/Button"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil, Button)
    {

        var img = '<img width="20" alt="C" height="20" src="../rfd/widget/images/coll_red.png" />';
        return declare("CollectionWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.resource = templateResource;
                this.spanNode.innerHTML = this.resource + img;
                //Set the identifier for editing.
                this.resource_id.set('value', this.resource.id);
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

                on(this.spanNode, "mouseover", lang.hitch(this, function()
                {
                    popup.open(
                    {
                        popup: this.tooltipdialog,
                        around: this.spanNode
                    });

                    focusUtil.focus(this.resource_id.domNode);
                }));
                this.tooltipdialog.on("mouseLeave", function(e) {
                    //console.log("mouseLeave widget");
                    popup.close(this);
                });

                // Set up identifier editing
                this.resource_id.set("onChange", lang.hitch(this, function(newValue)
                {
                    //console.log("onChange caught");
                    if(newValue != this.resource.id &&
                        this.onCheckResourceIdChange(this.resource) == true) 
                    {
                        this.resource.setId(newValue); // Set it
                        this.spanNode.innerHTML = this.resource + img;
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

                var menu = new Menu({});
                menu.addChild(itemBranchOut);
                menu.bindDomNode(this.branchButton.domNode);
                menu.startup();
                // Set click
                this.branchButton.on("click", lang.hitch(this, this._onBranchOutClick));

                var button = new Button({label: "Add"}, this.addNode);

            },
            _onBranchOutClick: function() {
                this.onBranchOutClick(this.resource);
            },
            //Event branchOutClick
            onBranchOutClick : function(resource) {
                console.info("onBranchOutClick: " + resource);
            },
            // Event function to override
            onCheckResourceIdChange: function(resource) { return true; }
        });
    }
); // and that's it!
