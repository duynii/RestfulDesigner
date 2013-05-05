// Example class
define([
    "dojo/_base/declare",
    "rfd/model/Method",
    "dojox/collections/ArrayList"
], function(declare, Method, ArrayList){
    return declare("rfd/model/GETMethod", Method, 
    {
        constructor: function()
        {
            this.expiry_duration = 300; // 300s or 5 mins
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