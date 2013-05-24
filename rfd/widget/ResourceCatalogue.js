//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/ResourceCatalogue.html", 
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
        "rfd/ExtendedSource", 
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
        Concept, ExtendedSource,
        on, JSON, query, baseFx, baseArray, lang,
        registry)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("ResourceCatalogue",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            concepts: null,
            templateString: template,
            container: null,
            postCreate: function()
            {
                this.inherited(arguments);


                this.container = new ExtendedSource(this.listNode, {
                    singular: true,
                    accept: [], // This is a dnd source only
                    creator: this.catalogueListCreator,
                    type: ["concepts"]
                });
            },
            catalogueListCreator: function(item, hint)
            {
                //console.log("Catalogue creator: hint - " + hint + ", item - " + item);
                //console.log("catalogue creator's item: " + item.declaredClass);

                var img = '<img width="20" height="20" src="../rfd/widget/images/coll_red.png" />';

                var innerHTML = (item.declaredClass != "Collection_R" ? item : item + img)
                var cssStyle = classStyle.entry(item.declaredClass);
                //console.log("css: " + item.declaredClass + " to " + cssStyle);
                var li = domConstruct.create("li");
                domConstruct.create("button", 
                    { 
                        class: cssStyle,
                        innerHTML: innerHTML 
                    },
                    li
                );

                return { node: li, data: item, type: item.type };
            },
            clearAll: function()
            {
                this.container.clearAll();
            },
            addResource:  function(resource)
            {
                this.container.insertNodes(false, [resource], false, null);
            },
            // add many at once
            addResources: function(resouces)
            {
                this.container.insertNodes(false, [resources], false, null);
            },
            dummy: function()
            {

            }
        });
    }
);