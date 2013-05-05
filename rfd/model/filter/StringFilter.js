// Example class

StringFilterEnum = {
        Contains = { name = "Contains", value = 0, enumval = 0 }, 
        StartsWith = { name = "StartsWith", value = 1, enumval = 0 }, 
        EndsWith = { name = "EndsWith", value = 2, enumval = 0 } 
    };
define([
    "dojo/_base/declare",
    "rfd/model/filter/Filter",
    "dojox/collections/ArrayList"
], function(declare, Filter, ArrayList){
    return declare("rfd/model/filter/StringFilter", Filter, 
    {
        constructor: function(field, type)
        {
            if(type.enumval != 0) {
                console.error("Wrong type enum given, NumberFilterEnum needed");
            }
        },
   });
});