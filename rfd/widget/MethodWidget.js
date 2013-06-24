define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/MethodWidget.html", 
        "dojox/collections/Dictionary", "dojox/form/Manager","dijit/form/Select", 
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", "dojo/dom-attr",
        "rfd/TemplatedResource", "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dojo/store/Memory", "dojo/store/Observable", "rfd/widget/ExtendedSelector",
        "dijit/Menu", "dijit/MenuItem", "dojo/json",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary, Manager, Select, 
        domStyle, domGeometry, domConstruct, domAttr,
        TemplatedResource, Branch, Section, classStyle,
        Memory, Observable, ExtendedSelector,
        Menu, MenuItem,
        JSON, on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil)
    {
        return declare("MethodWidget",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            resource: null,
            methodStore: null,
            storeMethods: null,
            current_method: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
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
            _hasMethod: function(id) {
                var method = this.methodStore.get(id);
                method = typeof method === 'undefined' ? null : method;
                return method;
            },
            // If method is checked, it is available to add parameters
            // unchecked means unsupported 
            _handleMethodChecking: function(method_id, newValue)
            {
                //console.info("_handleMethodChecking: " + method_id + ":" + newValue);
                if(!newValue) 
                {
                    if(this.current_method == method_id) {
                        this.current_method = null;
                        this.paramList.clearAll();
                        this.methodStore.remove(method_id);
                        // The method select widget will jump to the first 'option' if the current is deleted
                        // So trigger the method change handler
                        if(this.storeMethods.length > 0) {
                            this._selectMethodChanged(this.storeMethods[0].id);
                        }
                    }
                    else {
                        this.methodStore.remove(method_id);
                    }
                }
                else
                {
                    this.methodStore.put({id: method_id});
                    this.select.set('value', method_id);
                }
/*
                baseArray.forEach(this.methods, function(m)
                {
                    console.info("orig method: "  + JSON.stringify(m));
                });  DEBUGGing only*/ 
            },
            _updateCheckBoxes: function()
            {
                this.checkGET.set('value', this._hasMethod('GET'));
                this.checkPOST.set('value', this._hasMethod('POST'));
                this.checkPUT.set('value', this._hasMethod('PUT'));
                this.checkDELETE.set('value', this._hasMethod('DELETE'));

                //domAttr.set(this.checkPUT.domNode, "disabled", !this._hasMethod('PUT'));
                domStyle.set(this.checkGET.domNode, "visibility", this._allowedMethod('GET') ? "visible" : "hidden");
                domStyle.set(this.checkPOST.domNode, "visibility", this._allowedMethod('POST') ? "visible" : "hidden");
                domStyle.set(this.checkPUT.domNode, "visibility", this._allowedMethod('PUT') ? "visible" : "hidden");
                domStyle.set(this.checkDELETE.domNode, "visibility", this._allowedMethod('DELETE') ? "visible" : "hidden");
                //this.checkPUT.set('visibility', this._hasMethod('PUT') ? "visible" : "hidden");
                //this.checkPUT.set('disabled', this._hasMethod('PUT'));
            },
            _allowedMethod: function(method) {
                return (this.allowed.indexOf(method) != -1);
            },
            postCreate: function()
            {
                this.inherited(arguments);

                // Using lang.hitch with lang.partial feature
                this.checkGET.onChange = lang.hitch(this, this._handleMethodChecking, 'GET');
                this.checkPOST.onChange = lang.hitch(this, this._handleMethodChecking, 'POST');
                this.checkPUT.onChange = lang.hitch(this, this._handleMethodChecking, 'PUT');
                this.checkDELETE.onChange = lang.hitch(this, this._handleMethodChecking, 'DELETE');

                this.paramList = new ExtendedSelector(this.paramsNode, {
                    singular: true,
                    isSource: true, // Only acts as dnd target
                    accept: [], // Accept resource objects only
                    creator: this._createParam
                });

                if(typeof this.methods == 'undefined' || this.methods == null) {
                    console.error("'methods' must be set in MethodWidget's constructor");
                }
                if(typeof this.allowed == 'undefined' || this.allowed == null) {
                    console.error("'allowed' methods must be set in MethodWidget's constructor");
                }
                // Create the store
                this.methodStore = new Observable(new Memory({
                    idProperty: 'id',
                    data: this.methods
                }));
                // Get all methods
                this.storeMethods = this.methodStore.query(function(dummy) {return true});

                this._updateCheckBoxes();

                this.select = new Select({ 
                    name: 'methodSelect',
                    labelAttr: 'id',
                    searchAttr: 'id',
                    maxHeight: -1,
                    placeHolder: 'Select a method to add parameters',
                    style: "width: 66px;",
                    store: this.methodStore,
                    onChange: lang.hitch(this, this._selectMethodChanged)
                }, 
                this.selectNode);

                // prog. select works
                //this.select.set('value', 'POST');

                if(this.storeMethods.length > 0) {
                    this.current_method = this.storeMethods[0].id;
                    this._selectMethodChanged(this.current_method);
                }

                //this.addButton.on("click", lang.hitch(this, this._onAddParameter));

                this.paramForm.on("submit", lang.hitch(this, this._onAddParameter));

                var spanNode = this.spanNode;
                var spanLabel = this.spanLabel;
                this.paramSelect.on("change", function(newValue)
                {
                    var visible = newValue == 'string' || newValue == 'options' ? 'visible' : 'hidden';
                    domStyle.set(spanNode, 'visibility', visible);

                    if(visible == 'visible') {
                        spanLabel.innerHTML = newValue == 'string' ? 'regex: ' : 'options: ';
                    }
                });

                this.deleteButton.on('click', lang.hitch(this, function()
                {
                    var node = this.paramList.getFirstSelected();
                    if(node != null)
                    {
                        var data = this.paramList.getItem(node.id).data;
                        this.paramList.deleteNode(node);
                        this.storeParams.remove(data.name);
                    }
                }));
            },
            _createParam: function(param, hint) 
            {
                var li = domConstruct.create("li", {innerHTML: param.name + ': ' + param.type }, null);
                return {node: li, data: param, type: ["param"]};
            },
            _onAddParameter: function(e)
            {
                e.preventDefault();

                var data = this.paramForm.get('value');
                //console.info("Param form submit: " + JSON.stringify(data) );

                //Validate the data
                if(this.paramForm.isValid() != true) {
                    this.setErrorMsg("Form data is invalid");
                    return;
                }

                if(data.name == "") {
                    this.setErrorMsg("Parameter name (aka ID) must not be empty");
                    return;
                }

                //Check that param name is unique
                var find = this.storeParams.get(data.name);
                if(typeof find !== 'undefined') {
                    this.setErrorMsg("Parameter with this ID exists for this HTTP method");
                    return;
                }
                // If it is an options type, check proper JSON array
                if(data.type == 'options') 
                {
                    var options = null;
                    try {
                        options = JSON.parse('[' + data.data + ']');
                    }
                    catch(err) {
                        this.setErrorMsg('Must input list of options e.g. "aaa", "bbb"');
                        return;
                    }
                    if(options.length == 0) {
                        this.setErrorMsg('Must input list of options e.g. "aaa", "bbb"');
                        return;
                    }
                }

                this.resetErrorMsg();
                // Form's data is treated like a param hash
                this.paramList.insertNodes(false, [data], false, null);
                // Now add the parameter to the store.
                this.storeParams.put(data);
                // Clear the form
                this.paramForm.reset();
            },
            _selectMethodChanged: function(newValue)
            {
                console.info("new select method:" + newValue); // This is a string/id only

                var method = this.methodStore.get(newValue);
                if(typeof method.params === 'undefined' || method.params == null) {
                    method.params = [];
                }
                this._setMethodParams(method);
                // Set the current method 
                this.current_method = newValue;
            },
            _setMethodParams : function(method)
            {
                // Clear all for this HTTP method
                this.paramList.clearAll();
                // Populate existing methods
                this.paramList.insertNodes(false, method.params, false, null);
                // Wraps the params in a store, to search by 'name' and adding to store
                // The method.params reference is thus manipulated directly
                this.storeParams = new Observable(new Memory({
                    idProperty: 'name',
                    data: method.params
                }));

                domStyle.set(this.tableNode, "visibility", 
                    method.id == "DELETE" ? "collapse" : "visible");
            }
        });
    }
); // and that's it!
