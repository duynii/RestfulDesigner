//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Entity.html", 
        "dijit/form/Button",
        "dijit/form/TextBox",
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
        "dojo/dnd/Container", 
        "dojo/dnd/Moveable", 
        "dojo/on", 
        "dojo/_base/fx", 
        "dojo/_base/array",
        "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Button, TextBox, DropDownButton, TooltipDialog,
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, Container, Moveable,
        on, baseFx, baseArray, lang)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("Entity",[_WidgetBase, _TemplatedMixin], 
        {
            concept: null,
            baseClass: "classTable",
            templateString: template,
            container: null,
            moveable: null,
            buildRendering: function()
            {
                this.inherited(arguments);
            },
            postCreate: function()
            {
                this.inherited(arguments);

                this.container = new Container(this.containerNode,
                {
                    creator: function(item, hint)
                    {

                    }
                });

                this.header.innerHTML = "Blah header";

                this.moveable = new Moveable(this.domNode, {handle: this.header});
            },
            _onPropertyButtonClick: function( /*Event*/ e)
            {
              // Trust me, _onClick calls this._onClick
              console.log("Property add clicked")
              return this.onPropertyClick(e);
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