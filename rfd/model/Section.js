
METHODS = { 
                GET : { value: 0, name: "GET", code: "G" },
                POST : { value: 0, name: "GET", code: "G" },
                PUT : { value: 0, name: "GET", code: "G" },
                DELETE : { value: 0, name: "GET", code: "G" }
            };

// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "rfd/Resource"
], function(declare, baseArray, Resource){
    return declare("Section", null, 
    {
        constructor: function()
        {
            this.resources = new Array();
        },
        addResource: function(resource)
        {
            this.resources.push(resource);
        },
        hasResourceId: function(id)
        {
            var ind = -1;
            baseArray.forEach(this.resources, function(res, index)
                {
                    if(res.id == id) {
                        ind = index;
                    }
                }, 
                this
            );
            return (ind != -1);
        },
        branchOut: function(fromRes, branch)
        {
            var ind = -1;
            baseArray.forEach(this.resources, function(res, index)
                {
                    if(ind == -1) {
                        branch.addInactiveResource(res);
                    }
                    if(res.id == fromRes.id) {
                        ind = index;     
                    }
                }, 
                this
            );
            return (ind != -1);
        },
        size: function() { return this.resources.length; },
        last: function() 
        { 
            if(this.resources.length <= 0 ){
                return null;
            } 

            return this.resources[this.size() - 1];
        },
        toString: function()
        {
            var str = "";
            baseArray.forEach(this.resources, function(resource, index)
                {
                    str += resource + '/';
                }, 
                null
            );
            return str;
        },
        print: function() 
        {
            console.log("Section: " + toString());
        }
    });
});
