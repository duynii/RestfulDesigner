// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList"
], function(declare, ArrayList){
    return declare("rfd/model/filter/Filter", null, 
    {
        constructor: function(field, type)
        {
            this.field = field;
            this.type = type;
        },

        toString: function()
        {
            return "Filter: " + this.field + "type: " + type.name;
        },
        print: function() 
        {
            console.log(toString());
        }
    });
});