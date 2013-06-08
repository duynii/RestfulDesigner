define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/CustomWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/form/RadioButton", "dojox/form/CheckedMultiSelect",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus", "dojo/json"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem, RadioButton, CheckedMultiSelect,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil, JSON)
    {
        return declare("CustomWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments);

                this._saveForm();
            },
            postCreate: function()
            {
                this.inherited(arguments);
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
                this.resource.clearMethods(); // clears it
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
                    this.resource.addMethod(data.method);
                    this.resource.param = null;
                }

                //var json = JSON.stringify(this.resource);
                //this.setErrorMsg(json);
                this.resetErrorMsg();
            },
            _showMutualExUI: function(paramMode) {
                domStyle.set(this.paramNode, "visibility", paramMode ? "visible" : "collapse");
                domStyle.set(this.methodNode, "visibility", paramMode ? "collapse" : "visible");
            }
        });
    }
); // and that's it!
