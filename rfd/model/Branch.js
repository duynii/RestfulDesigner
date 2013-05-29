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
            this.id = this.toUrl();
        },
        clone: function()
        {
            var br = new Branch();
            baseArray.forEach(this.inactive.resources, function(res)
            {
                br.addInactiveResource(res);
            });
            baseArray.forEach(this.active.resources, function(res)
            {
                br.addActiveResource(res);
            });

            return br;
        },
        // Transfer all resources to inactive
        allToInactive: function()
        {
            this.inactive.resources =  this.inactive.resources.concat(this.active.resources);
            this.active.resources = new Array();
        },
        //Returns last active resource, or null if no active
        lastActiveResource: function()
        {
            return this.active.last();
        },
        //Returns last inactive resource, or null if no inactive
        lastInactiveResource: function()
        {
            return this.inactive.last();
        },
        lastResource: function()
        {
            var res = this.active.last();
            if(res != null ) {
                return res;
            }
            else {
                return this.inactive.last();
            }
        },
        //getActive: function() { return this.active; },
        //getInactive: function() { return this.inactive; },
        addActiveResource: function(resource) { 
            this.active.addResource(resource);
            this.id = this.toUrl(); 

            //TODO add handler for id changed
        },
        addInactiveResource: function(resource) { 
            this.inactive.addResource(resource); 
            this.id = this.toUrl(); 

            //TODO add handler for id changed
        },
        // Create a new branch by branching midway from this resource
        // All existing resources will be in inactive, new resource will in in active
        branchOut: function(fromRes, newRes)
        {
            newRes = typeof newRes !== 'undefined' ? newRes : null;

            var br = new Branch();

            var isBranched = this.inactive.branchOut(fromRes, br);
            if(isBranched) {
                //console.log("branched from inactive");
                return br;
            }

            isBranched = this.active.branchOut(fromRes, br);

            // add the new res into active section
            if(newRes != null) 
            {
                //TODO: Make sure new br is unique?
                br.addActiveResource(newRes);
            }
            //console.log("Branched from active: " + isBranched + " at " + fromRes.name);
            //console.log("[branchOut] branched: " + br);

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