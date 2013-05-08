
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
    return declare("rfd/model/Section", null, 
    {
        constructor: function()
        {
            this.resources = new Array();
        },
        addResource: function(resource)
        {
            this.resources.push(resource);
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
