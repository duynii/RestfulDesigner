//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
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
        "dojo/on", "dojo/query", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Select, MultiSelect, Button, TextBox, Form, InlineEditBox, DropDownButton, TooltipDialog,
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, Container, Moveable,
        on, query, baseFx, baseArray, lang)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("Entity",[_WidgetBase, _TemplatedMixin], 
        {
            concept: null,
            concepts: null,
            names: [],
            baseClass: "classTable",
            templateString: template,
            container: null,
            moveable: null,
            dropdown: null,
            tooltip: null,
            belongs: null,
            classname: null,

            buildRendering: function()
            {
                this.inherited(arguments);
            },
            setErrorMsg: function(msg)
            {
                this.errorNode.innerHTML = msg;
                domStyle.set(this.errorNode, "visibility", "hidden");
            },
            resetErrorMsg: function()
            {
                this.errorNode.innerHTML = "";
                domStyle.set(this.errorNode, "visibility", "visible");
            },
            postCreate: function()
            {
                this.inherited(arguments);

                // Change nodes into widgets

                query("label.inputbox", this.domNode).forEach(function(node)
                {
                    this.own( new TextBox({trim: true}, node));
                },
                this);
                var addProp = new Button(
                    {
                        onClick: lang.hitch(this, this._onPropertyButtonClick)
                    },
                    this.propertyNode
                );

                var typeSel = new Select({}, this.typeSelect);
                this.belongs = new MultiSelect({
                    onChange: function(newValue)
                    {
                        console.log("new value is of " + typeof newValue + ", value: " + newValue);
                    }
                }, this.belongsSelect); 

                var form = new Form({}, this.formNode);
                this.own(form);

                form.on("submit", function(e)
                {
                    console.log("Submit caught");
                });

                this.classname = new InlineEditBox(
                    {
                        editor: TextBox, 
                        autoSave: true,
                        onChange: lang.hitch(this, function(newValue)
                        {
                            console.log("class id onChange");
                            if(!this.isClassnameOK(newValue)) {
                                // reset to old value
                                this.classname.set("value", this.concept.id);
                                this.setErrorMsg("Class name cannot clash with each other");
                            }
                            else {
                                this.concept.setId(newValue);
                                this.titleNode.innerHTML = newValue;
                                this.resetErrorMsg();
                            }
                        })
                    },
                    this.classnameNode
                );


                //Instantiate the dijit widgets
                this.tooltip = new TooltipDialog({}, this.tooltipNode);
                this.dropdown = new DropDownButton({}, this.dropdownNode);
                this.own(
                    this.tooltip, this.dropdown
                );

                this._setupContainer();

                this.moveable = new Moveable(this.domNode, {handle: this.header});
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
                    creator: function(item, hint)
                    {
                        var inner = item.name + "-->" + item.type;
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                          innerHTML: inner 
                        }, 
                        tr);
                        return { node: tr, data: item, type: ["text"] };
                    }
                });

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
                //var sels = [];
                baseArray.forEach(concepts, function(c)
                {
                    console.log("pushing " + c.id);
                    this.names.push(c.id);
                    //sels.push({value: c.id, label: c.id});
                }, this);

                //this.belongs.set("value", sels);
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
              // Trust me, _onClick calls this._onClick
              console.log("Property add clicked");

              //Valid the fields
              
            },
            _onBelongsButtonClick: function( /*Event*/ e)
            {
              console.log("Belongs add clicked")
              return this.onBelongsClick(e);
            },
            onPropertyClick: function(e) { // nothing here: the extension point!

            },
            onBelongsClick: function(e) { // nothing here: the extension point!

            }
        });
    }
);