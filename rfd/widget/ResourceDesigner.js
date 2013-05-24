//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/ResourceDesigner.html", 
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
        "rfd/widget/ListItem", 
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
        Concept, ExtendedSource, ListItem,
        on, JSON, query, baseFx, baseArray, lang,
        registry)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("ResourceDesigner",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            concepts: null,
            templateString: template,
            container: null,
            postCreate: function()
            {
                this.inherited(arguments);

                this.container = new ExtendedSource(this.listNode, {
                    singular: true,  // Single item selection
                    isSource: false, // Only acts as dnd target
                    accept: ["resource"], // Accept resource objects only
                    type: ["concepts"],
                    onDropExternal: lang.hitch(this, this.onResourcesListDrop),
                    creator: lang.hitch(this, this.resourcesListCreator)
                });
            },
            resourcesListCreator: function(branch, hint) 
            {
                //console.log("Designer creator: hint - " + hint + ", branch - " + branch);
                this.container.selectNone();
                var li = new ListItem(
                {
                    //TODO onBranchOut: onBranching
                });
                li.placeAt(this.listNode);
                li.set("branch", branch);
                li.startup();

/*
                li.watch("className", function(attr, oldVal, newVal){
                    console.log("class old: " + oldVal + "; new: " + newVal);
                });
                li.watch("class", function(attr, oldVal, newVal){
                    console.log("class old: " + oldVal + "; new: " + newVal);
                });
*/

                return {node: li.domNode, data: branch, type: ["branch"]};
            },
            // When a dnd catalogue item is droped into selected resource branch
            onResourcesListDrop: function(source, nodes, copy) 
            {
                //console.log("onResourcesListDrop left called");
                //console.log("source:" + typeof(source));
                //console.log("node id:" + nodes[0].id);

                var nodeId = nodes[0].id;

                //Data item
                var resource = source.getItem(nodeId).data;
                console.log("Drop resource: " + resource);

                if(this.container.current == null) // Add the first ListItem for first branch
                {

                    var br = new Branch();
                    br.addActiveResource(resource);
                    this.addListItem(br);
                    this.container.sync();

                    //TODO, may not want to do this
                    //source.getSelectedNodes().orphan();
                    //source.delItem(nodeId);
                    ////Dont uncomment, compile error: source.sync():
                }
                else 
                {
                    //console.log("no: " + this.container.size());
                    var li = registry.getEnclosingWidget(this.container.current);
                    console.log("li type: " + li.declaredClass);
                    li.branch.addActiveResource(resource);
                    li.addResource(resource, li.branch);

                    //TODO, may not want to do this
                    //source.getSelectedNodes().orphan();
                    //source.delItem(nodeId);
                }
            },
            addListItem: function(branch, refBranchNode)
            {
                // If a ref node is specified, create the new branch under it
                //  for branching out - onBranchOut

                // Defaults to 'before' the newBranchDom
                is_before = typeof refBranchNode !== 'undefined' ? false : true;
                refBranchNode = typeof refBranchNode !== 'undefined' ? null : this.dropNewBranchNode;

                this.container.insertNodes(true, //new selected node 
                    [ branch ], is_before, refBranchNode);

                return  registry.getEnclosingWidget(this.container.getFirstSelected());
            },
            clearAll: function()
            {
                this.container.clearAll();
            },
            addResource:  function(resource)
            {
            },
            // add many at once
            addResources: function(resouces)
            {
            },
            dummy: function()
            {

            }
        });
    }
);