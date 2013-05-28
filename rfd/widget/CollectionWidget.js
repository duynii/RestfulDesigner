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
            init: function(coll) 
            {
                this.resource = coll;
                this.spanNode.innerHTML = this.resource + img;
                //Set the identifier for editing.
                this.resource_id.set('value', this.resource.id);

                this.checkPaging.set('value', coll.has_paging ? 'true' : 'false');
                this.textPagingNo.set('value', coll.paging_size);

            },
            _setupEditing: function()
            {
                this.checkPaging.on("onChange", lang.hitch(this, function(newValue)
                {
                    console.info("checkPaging: " + newValue);
                    this.resource.has_paging = newValue;
                }));

                this.textPagingNo.on("onChange", lang.hitch(this, function(newValue)
                {
                    if(value <=0) {
                        alert("Paging value cannot be 0 or negative, 10 or more recommended");
                    }
                    else {
                        this.resource.paging_size = newValue;
                    }
                }));
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

                var button = new Button({label: "Add"}, this.addNode);

                this._setupEditing();

            },
            _onDeleteResource: function() {
                this.onDeleteResource();
                // TODO emit event if no resource left
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
            // Event function to override
            onCheckResourceIdChange: function(resource) { return true; }
        });
    }
); // and that's it!
