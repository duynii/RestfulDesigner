define(["dojo/_base/declare", "dojo/dnd/Source",
        "dijit/registry"],

    function(declare, Source, baseArray, 
                registry)
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
            }

        });
    }
); // and that's it!
