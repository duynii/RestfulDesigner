
// Example class
define([
    "dojo/_base/declare"
], function(declare){
    return declare("rfd/Resource", null, {
        constructor: function(name){
            this.name = name;
        },

        isConcept: function() { return false; },

        toString: function() {
            var str = " = " +
                "name: " + this.name + "\n" +
                "isConcept: " + false;
            return str;
        }
    });
});
