define(["dojo/_base/declare", "dojo/dnd/Source",
        "dijit/registry", "dojo/dom-construct"],

    function(declare, Source, baseArray, 
                registry, domConstruct)
    {
        return declare("ExtendedSource",[ Source], 
        {
            size: function() {
                return this.getAllNodes().length;
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
                var sel = this.getSelected();
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
            }



        });
    }
); // and that's it!
