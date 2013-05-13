
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
        branchOut: function(fromRes, branch)
        {
            baseArray.forEach(this.resources, function(res, index)
                {
                    branch.addInactiveResource(res);
                    if(res.id == fromRes.id) {
                        return true;
                    }
                }, 
                this
            );
        },
        size: function() { return this.resources.length; },
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
