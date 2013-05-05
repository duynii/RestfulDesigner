define([
    "dojo/_base/declare",
    "rfd/model/filter/NumberFilter",
    "dojox/collections/ArrayList"
], function(declare, NumberFilter, ArrayList){
    return declare("rfd/model/filter/DecimalFilter", NumberFilter, 
    {
        constructor: function(field, type)
        {
            if(type.enumval != 1) {
                console.error("Wrong type enum given, NumberFilterEnum needed");
            }
        },

    });
});