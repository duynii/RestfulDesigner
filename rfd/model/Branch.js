// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList"
], function(declare, ArrayList){
    return declare("rfd/model/Branch", null, 
    {
        constructor: function()
        {
            this.resources = new ArrayList();
        },


        toString: function()
        {
            return "TODO";
        },
        print: function() 
        {
            return "TODO";
        }
    });
});