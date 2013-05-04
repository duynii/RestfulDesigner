
METHODS = { 
                GET : { value: 0, name: "GET", code: "G" },
                POST : { value: 0, name: "GET", code: "G" },
                PUT : { value: 0, name: "GET", code: "G" },
                DELETE : { value: 0, name: "GET", code: "G" }
            };

// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList"
], function(declare, ArrayList){
    return declare("rfd/model/Section", null, 
    {
        constructor: function()
        {
            this.resources = new ArrayList();
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
