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
        "dojo/dnd/Container", "dojo/dnd/Selector", "dojo/dnd/Moveable", 
        "dojo/on", "dojo/json", "dojo/query", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/registry", "rfd/controller/controller_concepts"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Select, MultiSelect, Button, TextBox, Form, InlineEditBox, DropDownButton, TooltipDialog,
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, Container, Selector, Moveable,
        on, JSON, query, baseFx, baseArray, lang,
        registry, controller)
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
                this._setupBelongsList();
            },
            _onAddingProperty: function(data)
            {
                // property must be uniquely named
                if( data.name == "" || this.concept.hasProperty(data.name)) {
                    this.setErrorMsg("Property already exists: " + name);
                    return;
                }

                //TO DO check enum
                var enumInput = [];
                if(data.type == "enum")
                {
                    data.enumInput = "[ " + data.enumInput + " ]";
                    try {
                        enumArray = JSON.parse(data.enumInput, true);
                        console.log("We got an array: " + JSON.stringify(enumArray));
                    }
                    catch(err) {
                        console.log("Failed to json parse: " + data.enumInput);
                        this.setErrorMsg("Enumeration values are not valid JSON array of strings.\n" +
                            err + ": " + data.enumInput);
                        return;
                    }
                }

                // Success 
                this.resetErrorMsg();
                this.form.reset();

                if(data.type == "enum") {
                    this.concept.addObjProperty({name: data.name, type: 'enum', enum_values: enumInput});
                }
                else {
                    this.concept.addProperty(data.name, data.type);
                }
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
                        //controller.addConcept(this.concept, {overwrite: true});
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
/*
                        var button = new Button({
                            label: '-',
                            class: "delButton",
                            onClick: lang.hitch(this, this._onItemClick)
                        });
                        domStyle.set(button.domNode, "width", "5px");
                        domStyle.set(button.domNode, "height", "5px");
*/
                        var inner = item.name + "-->" + item.type;
                        var span = domConstruct.create("span", {innerHTML: inner });
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                        }, 
                        tr);

                        domConstruct.place(span, td);
                        //domConstruct.place(button.domNode, td, "after");
                        return { node: tr, data: item, type: ["text"] };
                    })
                });

                on(this.containerNode, "dblclick", lang.hitch(this, this._onItemClick));

                Container.prototype.clearAll = function()
                {
                    var nodes = this.getAllNodes();
                    nodes.forEach(function(node)
                    {
                        //console.log("deleting this node: " + node.id);
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

                if(prop.name == "id")  {// Cannot delete id field
                    return; // no action
                }

                this.container.delItem(propertyId);
                domConstruct.destroy(propertyId);
                this.concept.deleteProperty(prop);
                this.container.sync();
            },
            _setupBelongsList: function()
            {
                this.belongs = new Selector( this.belongsList,
                {
                    singular: false,
                    onMouseDown: function(e)
                    {
                        console.log("Mouse is down");
                    }
                });

                this.own(
                    on(this.belongsList, "click", lang.hitch(this, function(e)
                    {
                        console.log("List is click");

                        var belongs_to = []
                        this.belongs.forInSelectedItems(function(obj, id)
                            {
                                //console.log("selected: " + obj.data);
                                belongs_to.push(obj.data);
                            },
                            this
                        );

                        this.concept.belongs_to.splice(0, this.concept.belongs_to.length, belongs_to);
                        //this.concept.belongs_to.length = 0;
                        //this.concept.belongs_to.concat(belongs_to);
                        this._displayBelongs(this.concept.belongs_to);
                    }))
                );

                // Clears existing items
                Selector.prototype.clearAllNodes = function() 
                {
                    var nodes = this.getAllNodes();
                    nodes.forEach(function(node)
                    {
                        //console.log("deleting this node: " + node.id);
                        this.delItem(node.id);
                        domConstruct.destroy(node);
                    },
                    this);
                };
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

                // Display is in the top row - see HTML
                this._displayBelongs(this.concept.belongs_to);

                //clear all existing nodes
                this.belongs.clearAllNodes();
                baseArray.forEach(this.concepts, function(concept)
                {
                    // If the concept is in belongs_to
                    var selected = this.concept.belongs_to.indexOf(concept.id) != -1;
                    // Insert the node
                    this.belongs.insertNodes(selected, [concept.id], false, null);
                },
                this);
            },
            _displayBelongs: function(belongs_to)
            {

                if(belongs_to.length <= 0) {
                    domStyle.set(this.belongsRowNode, "visibility", "collapse");
                    this.belongsNode.innerHTML = "";
                }
                else 
                {
                    var list = "";
                    baseArray.forEach(belongs_to, function(class_id)
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