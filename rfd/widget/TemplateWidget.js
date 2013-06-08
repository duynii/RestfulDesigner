define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/TemplateWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/focus",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem, focusUtil,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog)
    {
        return declare("TemplateWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments)
                //this.resource = templateResource;
                //this.spanNode.innerHTML = this.resource;
                //Set the identifier for editing.
                //this.resource_id.set('value', this.resource.toString());

                //Set the existing JSON doc
                this.json_doc.set('value', this.resource.getJSONStr() );
            },
            /*
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
            */
            postCreate: function()
            {
                this.inherited(arguments);

                //this.spanNode.innerHTML = "Blah";

                /*
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
                    //console.log("mouseleave widget");
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
                        this.spanNode.innerHTML = this.resource;
                    }
                }));
                */

                //Set up JSON doc editing
                this.json_doc.set("onChange", lang.hitch(this, function(newValue)
                {
                    var str = this.json_doc.get('value');

                    try {
                        var json = JSON.parse(str, true);
                        //Success
                        console.log("We got a JSON data: " + JSON.stringify(json));
                        //TODO this must be saved into a specific mongo database
                        this.resource.setJSON(json);
                        this.resetErrorMsg();
                    }
                    catch(err) {
                        console.log("Failed to json parse: '" + str + "'");
                        this.setErrorMsg("Failed to parse JSON data, please fix.\n" +
                            err + ": " + str);
                        return;
                    }
                }));

                /*
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
                */
            },
            /*
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
,
            // Event function to override
            onCheckResourceIdChange: function(resource) { return true; }
            */
            _checkAcceptableJSON: function(str)
            {

            }        });
    }
); // and that's it!
