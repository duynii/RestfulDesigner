// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList"
], function(declare, ArrayList){
    return declare("rfd/model/Method", null, 
    {
        constructor: function()
        {
        },


        toString: function()
        {
            console.error("Do not call Method.toString");
            return "Method";
        },
        print: function() 
        {
            console.error("Do not call Method.print");
        }
    });
});