// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "rfd/model/Section"
], function(declare, baseArray, Section){
    return declare("Branch", null, 
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
        // All existing resources will be in inactive, new resource will in in active
        branchOut: function(fromRes, newRes)
        {
            newRes = typeof newRes !== 'undefined' ? newRes : null;

            var br = new Branch();

            var isBranched = this.inactive.branchOut(fromRes, br);
            if(isBranched) {
                console.log("branched from inactive");
                return br;
            }

            isBranched = this.active.branchOut(fromRes, br);

            // add the new res into active section
            if(newRes != null) 
            {
                //TODO: Make sure new br is unique?
                br.addActiveResource(newRes);
            }
            console.log("Branched from active: " + isBranched + " at " + fromRes.name);
            console.log("[branchOut] branched: " + br);

            return br;
        },
        getPrevResource: function()
        {
            if(this.active.resources.length > 0) {
                return this.active.resources.pop();
            }
            else if(this.inactive.resources.length > 0) {
                return this.inactive.resources.pop();
            }
            else {
                return null;
            }
        },
        getPrevResourceId: function()
        {
            var res = this.getPrevResource();
            return res != null ? res.id : "/";
        },
        hasResourceId: function(id) {
            return (this.active.hasResourceId(id)) || (this.inactive.hasResourceId(id));
        },
        toString: function()
        {
            return this.inactive + " -> " + this.active;
        },
        toUrl: function() {
            return this.inactive + this.active;
        },
        print: function() 
        {
            console.log("Branch: (" + this.inactive + ")[" + this.active + "]");
        }
    });
});