
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource){
    return declare("rfd/ConceptResource", Resource, {
        isConcept: function() { return true; },

        toString: function() {
            var str = " = " +
                "name: " + this.name + "\n" +
                "isConcept: " + true;
            return str;
        }

    });
});
