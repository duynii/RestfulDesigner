
// Example class
define([
    "dojo/_base/declare"
], function(declare){
    return declare("rfd/Property", null, {
        constructor: function(name, type){
            this.name = name;
            this.type = type;
        },

        toString: function() {
            return "Property = name: " + this.name + " type: " + this.type;
        }

    });
});
