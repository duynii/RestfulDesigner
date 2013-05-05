// Example class
define([
    "dojo/_base/declare",
    "rfd/model/Branch",
    "dojox/collections/ArrayList",
    "dojo/store/Memory"
], function(declare, ArrayList, Memory){
    return declare("rfd/model/Tree", null, 
    {
        constructor: function()
        {
            this.branches = new ArrayList();
            this.store = new Memory();
        },

        getBranches: function() { return this.branhces; },

        toString: function()
        {
            return "TODO";
        },
        print: function() 
        {
            //"TODO";
            // Print everything here
        }
    });
});