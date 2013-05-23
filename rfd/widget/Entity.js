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
        "dojo/on", "dojo/json", "dojo/query", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Select, MultiSelect, Button, TextBox, Form, InlineEditBox, DropDownButton, TooltipDialog,
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, Container, Moveable,
        on, JSON, query, baseFx, baseArray, lang)
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
                //this.errorNode.innerHTML = msg;
                //domStyle.set(this.errorNode, "visibility", "visible");
            },
            resetErrorMsg: function()
            {
                //this.errorNode.innerHTML = "";
                //domStyle.set(this.errorNode, "visibility", "hidden");
            },
            postCreate: function()
            {
                this.inherited(arguments);

                // Change nodes into widgets
                //Instantiate the dijit widgets

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