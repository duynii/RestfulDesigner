// Example class
define([
    "dojo/_base/declare",
    "rfd/model/Section",
    "dojox/collections/ArrayList"
], function(declare, Section, ArrayList){
    return declare("rfd/model/Branch", null, 
    {
        constructor: function()
        {
            // The active section
            this.active = new Section();
            this.inactive = new Section();
        },
        // Create a new branch by branching midway from this resource
        branchOut: function(fromRes, newRes)
        {
            // Branch from active section

            // Make sure new branch is unique
        },

        toString: function()
        {
            return "/" + inactive + " -> " + active;
        },
        print: function() 
        {
            console.log("Branch: (" + inactive + ")[" + active + "]");
        }
    });
});