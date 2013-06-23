define(["dojo/_base/declare", "dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/MethodWidget.html", 
        "dojox/collections/Dictionary", "dojox/form/Manager","dijit/form/Select", 
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dojo/store/Memory", "dojo/store/Observable", "rfd/widget/ExtendedSelector",
        "dijit/Menu", "dijit/MenuItem", "dojo/json",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Dictionary, Manager, Select, 
        domStyle, domGeometry, domConstruct, 
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
            _updateCheckBoxes: function()
            {
                this.checkGET.set('value', this._hasMethod('GET'));
                this.checkPOST.set('value', this._hasMethod('POST'));
                this.checkPUT.set('value', this._hasMethod('PUT'));
                this.checkDELETE.set('value', this._hasMethod('DELETE'));
            },
            postCreate: function()
            {
                this.inherited(arguments);

                this.params = new ExtendedSelector(this.paramsNode, {
                    singular: true,
                    isSource: true, // Only acts as dnd target
                    accept: [], // Accept resource objects only
                    creator: this._createParam
                });

                this.params.hookOnNewSelected(function(d){
                    console.info("hooked: " + JSON.stringify(d));
                });



                if(typeof this.methods == 'undefined' || this.methods == null) {
                    console.error("'methods' must be set in MethodWidget's constructor");
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
                    style: "width: 100px;",
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
                    var node = this.params.getFirstSelected();
                    if(node != null)
                    {
                        //var data = this.params.getItem(node.id).data;
                        this.params.deleteNode(node);
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
                //e.stopPropogation();

                //this.methodStore.put({id: "PATCH"});

                var data = this.paramForm.get('value');
                console.info("Param form submit: " + JSON.stringify(data) );

                //Validate the data
                if(this.paramForm.isValid() != true) {
                    this.setErrorMsg("Form data is invalid");
                    return;
                }

                if(data.name == "") {
                    this.setErrorMsg("Parameter name (aka ID) must not be empty");
                    return;
                }

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

                this.params.insertNodes(false, [data], false, null);
                // Now add the parameter to the store.
                this.storeParams.put(data);

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
                // Saves to prev method
                var nodes = this.params.getAllNodes();
                if(nodes.length > 0 && this.current_method != null) // Some existing nodes 
                {
                    console.info("current method inside onCHange: " + this.current_method);

                    var prev_method = this.methodStore.get(this.current_method);
                    prev_method.params = this.params.getAllData();
                }

                // Clear all for this HTTP method
                this.params.clearAll();
                // Populate existing methods
                this.params.insertNodes(false, method.params, false, null);
            }
        });
    }
); // and that's it!
