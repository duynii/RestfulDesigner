define(["dojo/_base/declare", "dojo/dnd/Source",
        "dijit/registry", "dojo/dom-construct"],

    function(declare, Source, 
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
            getWidgetFromData: function(data)
            {
                var nodes = this.getAllNodes();
                var widget = null;
                nodes.forEach(function(node)
                {
                    var d = this.getItem(node.id).data;
                    if(d == data) {
                        widget = registry.getEnclosingWidget(node);
                    }
                },
                this);

                return widget;
            }



        });
    }
); // and that's it!
