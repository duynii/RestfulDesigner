//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./templates/ResourceDesigner.html", 
        "dijit/form/Button",
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/model/Branch", "rfd/model/Section", 
        "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "rfd/Concept", 
        "rfd/ExtendedSource", "rfd/widget/ListItem", "rfd/widget/NewResourceDialog", 
        "dojo/on", "dojo/json", "dojo/query", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/registry"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, 
        Button, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        classStyle,
        Menu, MenuItem,
        Concept, ExtendedSource, ListItem, NewResourceDialog,
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
            _setConceptsAttr: function(concepts)
            {
                this.concepts = concepts;
            },
            onBranching: function(branch, domNode)
            {
                console.log("Branching out of: " + branch);

                var dialog = new NewResourceDialog({
                    title:"Custom Dialog",
                    style: "min-width: 500px; min-height: 400px",
                    onFinish: lang.hitch(this, function(newRes)
                    {
                        // TODO Why are branches created here and only know in ListItem
                        var br = dialog.branch.clone();
                        br.addActiveResource(newRes);
                        console.log("finished with new branch: " + br);
                        this.addListItem(br, domNode);
                        //Add the new branch to Controller
                        dialog.destroyRecursive(false);
                        //dialog.destroy();
                    }),
                    onHide: function() {
                        dialog.destroyRecursive(false);
                    }
                });
                // Initialise with branch and show
                dialog.init(branch, this.concepts);
                dialog.show();
            },
            resourcesListCreator: function(branch, hint) 
            {
                //console.log("Designer creator: hint - " + hint + ", branch - " + branch);
                this.container.selectNone();
                var li = new ListItem(
                {
                    onBranchOut: lang.hitch(this, this.onBranching)
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
                refBranchNode = typeof refBranchNode !== 'undefined' ? refBranchNode : this.dropNewBranchNode;

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