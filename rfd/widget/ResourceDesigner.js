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
        "dijit/registry", "dojo/aspect",
        "rfd/controller/controller_concepts"
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
        registry, aspect, controller)
    {
        /*
        * This is a custom widget that wraps a table dom.
        * It is used to create a dnd Moveable class, dojo/dnd/Container is also used
        */
        return declare("ResourceDesigner",[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
            templateString: template,
            container: null,
            branch_url: "",
            paramNo: 1, //For automatic naming of dropped resources eg. static1
            placeholderNo: 1,
            staticNo: 1,
            postCreate: function()
            {
                this.inherited(arguments);

                this.container = new ExtendedSource(this.listNode, {
                    singular: true,  // Single item selection
                    isSource: false, // Only acts as dnd target
                    accept: ["resource"], // Accept resource objects only
                    type: ["concepts"],
                    onDropExternal: lang.hitch(this, this._onResourcesListDrop),
                    creator: lang.hitch(this, this._resourcesListCreator)
                });

                // Handler for new branch selected
                on(this.listNode, "click", lang.hitch(this, function()
                {
                    if(this.container.current == null) {
                        return;
                    }

                    var li = this.container.getFirstSelectedWidget();
                    if(li != null && this.branch_url != li.branch.toUrl()) 
                    {
                        this.branch_url = li.branch.toUrl();
                        this.onNewSelectedBranch(li.branch);
                    }
                }));
                /** also works
                aspect.after(this.container, "onMouseDown", lang.hitch(this, function()
                {
                    console.log("ListItem onMouseDown");
                }));
                */
            },
            // Override this to find out when a new branch is selected,
            //  Not covering dropping resource into a new branch
            onNewSelectedBranch: function(branch) {
                console.log("new branch selection: " + branch.toUrl());
            },
            // Override to change behaviour by: branch already has resource added, it's a clone
            // Return true to accept, false to cancel
            onBranchingOut:function(branch, resource)
            {
                console.log("Branching event: " + branch.toUrl(), + " + " + resource);
                return true;
            },
            // Override to change behaviour by: branch is an existing branch ref, do not modify
            // Return true to accept, false to cancel
            onBranchDrop:function(branch, resource)
            {
                return true;
            },
            // When branching is activated, popup a dialog to add new resource
            _onBranching: function(branch, domNode)
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

                        //Add the new branch to Controller
                        if(this.onBranchingOut(br, newRes) == true) 
                        {
                            console.log("finished with new branch: " + br);
                            this.addListItem(br, domNode);
                            dialog.hide();
                        }
                    }),
                    onHide: function() {
                        dialog.destroyRecursive(false);
                    }
                });
                // Initialise with branch and show
                dialog.init(branch, controller.getConcepts());
                dialog.show();
            },
            _resourcesListCreator: function(branch, hint) 
            {
                //console.log("Designer creator: hint - " + hint + ", branch - " + branch);
                this.container.selectNone();
                var li = new ListItem(
                {
                    onBranchOut: lang.hitch(this, this._onBranching)
                });
                li.placeAt(this.listNode);
                li.set("branch", branch);
                li.startup();


                return {node: li.domNode, data: branch, type: ["branch"]};
            },
            // When a dnd catalogue item is droped into selected resource branch
            _onResourcesListDrop: function(source, nodes, copy) 
            {
                //console.log("_onResourcesListDrop left called");
                //console.log("source:" + typeof(source));
                //console.log("node id:" + nodes[0].id);

                var nodeId = nodes[0].id;

                //Data item
                var resource = source.getItem(nodeId).data;
                resource = resource.clone();
                console.log("Drop resource: " + resource);
                resource.autoName();

                var listitem = null;
                if(this.container.current == null) // Add the first ListItem for first branch
                {
                    var br = new Branch();
                    //Dont need to check return value as there's nothing in the designer
                    // no branch
                    br.addActiveResource(resource);
                    if(this.onBranchingOut(br, resource) == true) {
                        listitem = this.addListItem(br);
                        this.container.sync();
                    }

                    //TODO, may not want to do this
                    //source.getSelectedNodes().orphan();
                    //source.delItem(nodeId);
                    ////Dont uncomment, compile error: source.sync():
                }
                else 
                {
                    var li = registry.getEnclosingWidget(this.container.current);

                    if(this.onBranchDrop(li.branch, resource) == true) 
                    {
                        // Added in the event
                        li.branch.addActiveResource(resource);
                        li.addResource(resource);
                        listitem = li;
                        this.container.sync();
                        //TODO, may not want to do this
                        //source.getSelectedNodes().orphan();
                        //source.delItem(nodeId);
                    }
                }

                //If resource is a collection, add an extra resource
                //TODO ??? find existing Concept_R on this branch? unnecessary complicated
                if(listitem != null && resource.declaredClass == "Collection_R") 
                {
                    var res = new Concept_R("dummy", "/", resource.concept);
                    listitem.branch.addActiveResource(res);
                    listitem.addResource(res);

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

                this.branch_url = branch.toUrl();

                this.onNewSelectedBranch(branch);

                return  registry.getEnclosingWidget(this.container.getFirstSelected());
            },
            clearAll: function()
            {
                this.container.clearAll();
            }
        });
    }
);