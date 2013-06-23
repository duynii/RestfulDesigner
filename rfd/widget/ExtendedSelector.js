// Class for handling multi selection, dijit MultiSelect does not work so well
define(["dojo/_base/declare", "dojo/dnd/Selector", "dojo/on", "dojo/_base/lang", "dojo/aspect",
        "dijit/registry", "dojo/dom-construct", "dojo/json"],

    function(declare, Selector, on, lang, aspect,
                registry, domConstruct, JSON)
    {
        return declare("ExtendedSelector",[ Selector], 
        {
            currentItemId: null,
            hookOnNewSelected: function(func)
            {
                //this.on("click", lang.hitch(this, function()
                aspect.after(this, "onMouseDown", lang.hitch(this, function()
                {
                    var node = this.getFirstSelected();
                    if(this.currentItemId == null || this.currentItemId != node.id) {
                        this.currentItemId = node.id;
                        //Call event function
                        var data = this.getItem(node.id).data;
                        this.onNewSelected(data);
                        func(data);
                    }
                }));
            },
            //To be overriden
            onNewSelected : function(data) {
                console.log("default on new selected selector" + JSON.stringify(data));
            },
            size: function() {
                return this.getAllNodes().length;
            },
            getSelectedStrings: function() {
                var nodes = this.getSelectedNodes();

                var selecteds = nodes.map(function(node){
                    return this.getItem(node.id).data;
                }, 
                this);

                return selecteds;
            },
            getAllData: function() {
                var nodes = this.getAllNodes();
                var dataArray = nodes.map(function(node){
                    return this.getItem(node.id).data;
                }, 
                this);

                return dataArray;
            },
            // return the selected node, it can only be one in this app
            getFirstSelected: function()
            {
                var nodes = this.getSelectedNodes();

                if(nodes.length == 0) {
                    //console.error("Cannot get selected ListItem node");
                    return null;
                }

                return nodes[0];
            },
            getFirstSelectedWidget: function()
            {
                var sel = this.getFirstSelected();
                return (sel == null ? null : registry.getEnclosingWidget(sel));
            },
            clearAll: function()
            {
                var nodes = this.getAllNodes();
                nodes.forEach(function(node)
                {
                    this.delItem(node.id);
                    domConstruct.destroy(node);
                },
                this);
            },
            deleteNode: function(node) 
            {
                this.delItem(node.id);
                domConstruct.destroy(node);
                this.sync();
            }
        });
    }
); // and that's it!
