// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "rfd/model/Section"
], function(declare, baseArray, Section){
    return declare("rfd/model/Branch", null, 
    {
        constructor: function(active, inactive)
        {
            // default param value if no param is specified
            active = typeof active !== 'undefined' ? active : new Section();
            inactive = typeof inactive !== 'undefined' ? inactive : new Section();
            // The active section
            this.active = active;
            this.inactive = inactive;
        },
        //getActive: function() { return this.active; },
        //getInactive: function() { return this.inactive; },
        addActiveResource: function(resource) { this.active.addResource(resource); },
        addInactiveResource: function(resource) { this.inactive.addResource(resource); },
        // Create a new branch by branching midway from this resource
        branchOut: function(fromRes, newRes)
        {
            // Branch from active section

            // Make sure new branch is unique
        },

        toString: function()
        {
            return this.inactive + " -> " + this.active;
        },
        print: function() 
        {
            console.log("Branch: (" + this.inactive + ")[" + this.active + "]");
        }
    });
});