//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/Entity.html", 
        "dijit/form/Select",
        "dijit/form/MultiSelect",
        "dijit/form/Button",
        "dijit/form/TextBox",
        "dijit/form/Form",
        "dijit/InlineEditBox",
        "dijit/form/DropDownButton",
        "dijit/TooltipDialog",
        "dojox/collections/Dictionary",
        "dojo/dom-style", 
        "dojo/dom-geometry", 
        "dojo/dom-construct", 
        "rfd/model/Branch", 
        "rfd/model/Section", 
        "rfd/module/ClassStyle", 
        "dijit/Menu", 
        "dijit/MenuItem", 
        "rfd/Concept", 
        "dojo/dnd/Container", "dojo/dnd/Moveable", 
        "dojo/on", "dojo/json", "dojo/query", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/registry"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Select, MultiSelect, Button, TextBox, Form, InlineEditBox, DropDownButton, TooltipDialog,
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, Container, Moveable,
        on, JSON, query, baseFx, baseArray, lang,
        registry)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("Entity",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            widgetInTemplate: true,
            concept: null,
            concepts: null,
            names: [],
            baseClass: "classTable",
            templateString: template,
            container: null,
            moveable: null,

            buildRendering: function()
            {
                this.inherited(arguments);
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

                // Change nodes into widgets
                //Instantiate the dijit widgets

                this._setupContainer();

                this.moveable = new Moveable(this.domNode, {handle: this.header});


                this.form.on("submit", lang.hitch(this, function(e)
                {
                    e.preventDefault();

                    if(!this.form.isValid()) {
                        this.setErrorMsg("Invalid form input");
                        return;
                    }

                    var data = this.form.get('value');
                    console.log("submit bub: " + JSON.stringify(data));
                    this._onAddingProperty(data);
                }));

                this.typeSelect.set("onChange", lang.hitch(this, function(newValue)
                {
                    //show enum inputs if Enumeration type selected
                    domStyle.set(this.spanNode, "visibility", newValue == "enum" ? "visible" : "hidden");
                }));

                this._hookClassnameEdit();
            },
            _onAddingProperty: function(data)
            {
                // property must be uniquely named
                if( data.name == "" || this.concept.hasProperty(data.name)) {
                    this.setErrorMsg("Property already exists: " + name);
                    return;
                }
                //TO DO check enum

                // Success 
                this.resetErrorMsg();
                this.form.reset();

                this.concept.addProperty(data.name, data.type);
                this.container.insertNodes([this.concept.lastProp()], false, null);
            },
            _hookClassnameEdit: function()
            {
               this.classname.set("onChange", lang.hitch(this, function(newValue)
               {
                    console.log("class id onChange");
                    if(!this.isClassnameOK(newValue)) {
                        // reset to old value
                        //this.classname.set("value", this.concept.id);
                        this.classname.domNode.innerHTML = this.concept.id;
                        this.setErrorMsg("Class name cannot clash with each other");
                    }
                    else {
                        this.concept.setId(newValue);
                        this.titleNode.innerHTML = newValue;
                        this.resetErrorMsg();
                    }
               })) 
            },
            // Class name id cannot be the same as another one
            isClassnameOK: function(id) {
                if(id != this.concept.id && this.names.indexOf(id) != -1) {
                    return false;
                }

                return true;
            },
            _setupContainer: function()
            {
                this.container = new Container(this.containerNode,
                {
                    creator: lang.hitch(this, function(item, hint)
                    {
                        var button = new Button({
                            label: '-',
                            class: "addButton",
                            onClick: lang.hitch(this, this._onItemClick)
                        });
                        var inner = item.name + "-->" + item.type;
                        var span = domConstruct.create("span", {innerHTML: inner });
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                        }, 
                        tr);

                        domConstruct.place(span, td);
                        domConstruct.place(button.domNode, td);
                        return { node: tr, data: item, type: ["text"] };
                    })
                });

                on(this.containerNode, "dblclick", lang.hitch(this, this._onItemClick));

                Container.prototype.clearAll = function()
                {
                    var nodes = this.getAllNodes();
                    nodes.forEach(function(node)
                    {
                        console.log("deleting this node: " + node.id);
                        this.delItem(node.id);
                        domConstruct.destroy(node);
                    },
                    this);
                };
            },
            _onItemClick: function(e)
            {
                if(this.container.current == null) {
                    return;
                }
                var propertyId = this.container.current.id;
                var prop = this.container.getItem(propertyId).data;
                console.log("onItem Hitch: " + propertyId + ", " + JSON.stringify(prop));

                this.container.delItem(propertyId);
                domConstruct.destroy(propertyId);
                this.concept.deleteProperty(prop);
                this.container.sync();
            },
            // Clear everything and repopulate
            _resetConcept: function()
            {
                console.log("Set name for: " + this.concept.id);
                this.titleNode.innerHTML = this.concept.id;
                this.classname.set("value", this.concept.id);

                //TODO clear everything
                this.container.clearAll();
                this.container.insertNodes(this.concept.properties, false, null);

                if(this.concept.belongs_to.length <= 0) {
                    domStyle.set(this.belongsRowNode, "visibility", "collapse");
                    this.belongsNode.innerHTML = "";
                }
                else 
                {
                    var list = "";
                    baseArray.forEach(this.concept.belongs_to, function(class_id)
                    {
                        list += class_id + " ";
                    });
                    this.belongsNode.innerHTML = list;
                    domStyle.set(this.belongsRowNode, "visibility", "visible");
                }
            },
            _validNewProperty: function(form)
            {

            },
            _setConceptsAttr: function(concepts)
            {
                if(concepts == null) { console.error("'concepts' set is null"); }
                this.concepts = concepts;
                // Set convenient list of class namess
                this.names = []; //clears it and new reference for array
                baseArray.forEach(concepts, function(c)
                {
                    console.log("pushing " + c.id);
                    this.names.push(c.id);
                }, this);
            }, 
            _setConceptAttr: function(concept) 
            {
                if(concept.declaredClass != "Concept") {
                    console.error("param is not a Concept type");
                    return;
                }

                this.concept = concept;
                this._resetConcept();
            },
            _onPropertyButtonClick: function( /*Event*/ e)
            {
            },
            _onBelongsButtonClick: function( /*Event*/ e)
            {
            },
            onPropertyClick: function(e) { // nothing here: the extension point!

            },
            onBelongsClick: function(e) { // nothing here: the extension point!

            }
        });
    }
);