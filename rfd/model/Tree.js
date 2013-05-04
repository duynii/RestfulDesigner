// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList",
    "dojo/store/Memory"
], function(declare, ArrayList, Memory){
    return declare("rfd/model/Tree", null, 
    {
        constructor: function()
        {
            this.resources = new ArrayList();
            this.store = new Memory();
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