// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList"
], function(declare, ArrayList){
    return declare("rfd/model/OrderBy", null, 
    {
        constructor: function(field, is_ascending)
        {
            this.fields = new ArrayList([ {name: field, ascending: is_ascending} ]);
        },
        addSortCriteria : function(field, is_ascending) 
        {
            // Check to see if field is already there
            this.fields.forEach(function(item)
            {
                if(item.field == field) {
                    console.error("You cannot add field again to OrderBy: " + field);
                    return;
                }
            },
            null);
            // Now just add it
            fields.add({field: field, ascending: is_ascending});
        }

        toString: function()
        {
            var str = "size: " + fields.toArray().length;
            this.fields.forEach(function(item) 
                { 
                    str += (item.field + ',')
                }, 
                null
            );
            return str;
        },
        print: function() 
        {
            this.fields.forEach(
                    function(item)
                    {
                        console.log("OrderBy item: " + item.field + "-" + item.ascending ? "asc" | "desc");
                    }
                );
        }
    });
});