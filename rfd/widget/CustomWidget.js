define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/CustomWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/form/RadioButton", "dojox/form/CheckedMultiSelect",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus", "dojo/json"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem, RadioButton, CheckedMultiSelect,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil, JSON)
    {
        return declare("CustomWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.resource = templateResource;
                this.spanNode.innerHTML = this.resource;
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
                this.tooltipdialog.on("dojo/mouse#leave", function(e) {
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

                this._initUI();
            },
            _initUI: function()
            {
                this.paramButton.on("change", lang.hitch(this, function(isChecked)
                {
                    this._showMutualExUI(isChecked);
                    this._saveForm();
                }));

                var regexNode = this.regex.domNode; //widget
                this.paramSelect.on("change", lang.hitch(this, function(newValue)
                {
                    domStyle.set(regexNode, "visibility", newValue == 'string' ? "visible" : "hidden");
                    this._saveForm();
                }));

                this.methodSelect.on("change", lang.hitch(this, this._saveForm));
                this.regex.on("change", lang.hitch(this, this._saveForm));
            },
            _saveForm: function()
            {

                if(!this.form.isValid()) {
                    this.setErrorMsg("Invalid form data");
                    return;
                }

                var data = this.form.get('value');

                var obj = null;
                this.resource.methods.length = 0; // clears it
                if(data.type == 'param')
                {
                    obj = {};
                    obj.type = data.paramSelect;
                    if(obj.type == 'string') {
                        obj.regex = data.regex;
                    }
                    this.resource.param = obj;
                }
                else
                {
                    this.resource.methods.push(data.method);
                    this.resource.param = null;
                }

                i//var json = JSON.stringify(this.resource);
                //this.setErrorMsg(json);
                this.resetErrorMsg();
            },
            _showMutualExUI: function(paramMode) {
                domStyle.set(this.paramNode, "visibility", paramMode ? "visible" : "collapse");
                domStyle.set(this.methodNode, "visibility", paramMode ? "collapse" : "visible");
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
