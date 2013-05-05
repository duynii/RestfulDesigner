// Example class

NumberFilterEnum = {
        EQ = { name = "Equal", value = 0, enumval = 1 }, 
        LT = { name = "LessThan", value = 1, enumval = 1 }, 
        GT = { name = "GreaterThan", value = 2, enumval = 1 },
        LTE = { name = "LessThanOrEqual", value = 3, enumval = 1 }, 
        GTE = { name = "LessThanOrEqual", value = 4, enumval = 1 } 
    };
define([
    "dojo/_base/declare",
    "rfd/model/filter/Filter",
    "dojox/collections/ArrayList"
], function(declare, Filter, ArrayList){
    return declare("rfd/model/filter/NumberFilter", Filter, 
    {
        constructor: function(field, type)
        {
            if(type.enumval != 1) {
                console.error("Wrong type enum given, NumberFilterEnum needed");
            }
        },

    });
});