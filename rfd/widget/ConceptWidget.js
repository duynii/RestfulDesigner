define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/ConceptWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", "rfd/widget/MakeRepDialog", "rfd/Representation",
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/Dialog", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus",
        "rfd/widget/ExtendedSelector",
        "rfd/controller/controller_concepts"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, MakeRepDialog, Representation, Branch, Section,
        classStyle,
        Menu, MenuItem, Dialog,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil,
        ExtendedSelector,
        controller)
    {
        return declare("ConceptWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
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


                this.select = new ExtendedSelector(this.selectRep, {
                    singular: true,
                    onNewSelected: lang.hitch(this, function(data)
                    {
                        console.info("have new selected rep: " + data);
                        this.resource.setSelectedRep(data);
                    })
                });
                this.select.insertNodes(true, ["Full"], false, null);
                this.select.hookOnNewSelected(function(data) {
                    console.info("have new selected rep2: " + data);
                });

                this.createButton.on("click", lang.hitch(this, function()
                {
                    var d = new MakeRepDialog({
                        concept: this.resource.concept,
                        onFinish: lang.hitch(this, function(rep)
                        {
                            console.info("New rep: " + rep);

                            //if the representation is not already saved, add it
                            if(true) //TODO
                            {
                                this.resource.addRep(rep);
                                // new selected item 
                                this.select.selectNone();
                                this.select.insertNodes(true, [rep], false, null);
                                d.hide();
                            }
                            else {
                                alert("This representaion exists: " + rep);
                            }
                        }),
                        onHide: function() {
                            d.destroyRecursive();
                        }
                    });
                    d.show();
                }))
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

            },
            _saveForm : function() {

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
