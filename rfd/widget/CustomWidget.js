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
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus", "dojo/json", "dojo/dom-class"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem, RadioButton, CheckedMultiSelect,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil, JSON, domClass)
    {
        return declare("CustomWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments);

                this._initUI();
                this._saveForm();
            },
            postCreate: function()
            {
                this.inherited(arguments);
            },
            _setStyle: function()
            {
                var isTemplate = this.checkTemplateParam.get('value');
                domClass.remove(this.spanNode);
                domClass.add(this.spanNode, "floatLeft");
                if(this.resource.methods.length == 0) {
                    if(!isTemplate) {
                        domClass.add(this.spanNode, "staticResource");
                    }
                    else {
                        domClass.add(this.spanNode, "customResource");
                    }
                }
                else if(this.resource.hasMethod(this.resource.getMethod("POST")) ||
                        this.resource.hasMethod(this.resource.getMethod("DELETE")) || 
                        this.resource.hasMethod(this.resource.getMethod("GET"))) {

                    domClass.add(this.spanNode, "controlResource");
                }
                else if(this.resource.hasMethod(this.resource.getMethod("PUT"))) {
                    domClass.add(this.spanNode, "storeResource");
                }
                else {
                    domClass.add(this.spanNode, "customResource");
                }
            },
            _initUI: function()
            {

                this.checkTemplateParam.set('value', this.resource.isTemplateParam);
                domStyle.set(this.paramNode, "visibility", 
                        this.resource.isTemplateParam ? "visible" : "collapse");

                this.checkTemplateParam.on("change", lang.hitch(this, function(newValue)
                {
                    this.resource.isTemplateParam = newValue;
                    domStyle.set(this.paramNode, "visibility", newValue ? "visible" : "collapse");
                    //this.resource_id.set('value', this.resource.toString());
                    //this.resource_id.innerHTML = this.resource;
                    this.resource_id.domNode.innerHTML = this.resource;
                    this.spanNode.innerHTML = this.resource;
                    this.onResourceIdChanged();

                    this._saveForm();
                    this._setStyle();
                }));

                var regexNode = this.regex.domNode; //widget
                this.paramSelect.on("change", lang.hitch(this, function(newValue)
                {
                    domStyle.set(regexNode, "visibility", newValue == 'string' ? "visible" : "hidden");
                    this._saveForm();
                }));

                this.regex.on("change", lang.hitch(this, this._saveForm));

                // By default just support POST
                this.methodWidget.methods = this.resource.methods;
                this.methodWidget.allowed = ['GET', 'POST', 'PUT', 'DELETE'];
                this.methodWidget.init();

                this.methodWidget.onMethodChange = lang.hitch(this, this._setStyle);

                /*
                var temp_methods = this.temp_methods;
                var methods = this.resource.methods;
                var wid = this.methodWidget;
                this.checkMethod.on('change', function(newValue)
                {
                    wid.set('disabled', newValue);
                    //domStyle.set(methodNode, "visibility", newValue === true ? 'visible' : 'hidden');
                    if(newValue === true) 
                    {
                        methods = temp_methods;
                    }
                    else
                    {
                        methods = []; // no methods
                    }
                });
                */
            },
            _saveForm: function()
            {

                if(!this.form.isValid()) {
                    this.setErrorMsg("Invalid form data");
                    return;
                }

                var data = this.form.get('value');
                console.info("custom form: " + JSON.stringify(data));

                if(data.checkTemplateParam == "templatedParam")
                {
                    var obj = {};
                    obj.type = data.paramSelect;
                    if(obj.type == 'string') {
                        obj.regex = data.regex;
                    }
                    this.resource.param = obj;
                    this.resource.isTemplateParam = true;
                }
                else {
                    this.resource.param = null;
                    this.resource.isTemplateParam = false;
                }

                this.resetErrorMsg();
            },
            _showMutualExUI: function(paramMode) {
                domStyle.set(this.paramNode, "visibility", paramMode ? "visible" : "collapse");
                domStyle.set(this.methodNode, "visibility", paramMode ? "collapse" : "visible");
            }
        });
    }
); // and that's it!
