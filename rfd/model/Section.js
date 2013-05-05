
METHODS = { 
                GET : { value: 0, name: "GET", code: "G" },
                POST : { value: 0, name: "GET", code: "G" },
                PUT : { value: 0, name: "GET", code: "G" },
                DELETE : { value: 0, name: "GET", code: "G" }
            };

// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource",
    "dojox/collections/ArrayList"
], function(declare, Resource, ArrayList){
    return declare("rfd/model/Section", null, 
    {
        constructor: function()
        {
            this.resources = new ArrayList();
        },


        toString: function()
        {
            var str = "";
            this.fields.forEach(function(resource)
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
