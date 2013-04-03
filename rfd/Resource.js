
METHODS = { 
                GET : { value: 0, name: "GET", code: "G" },
                POST : { value: 0, name: "GET", code: "G" },
                PUT : { value: 0, name: "GET", code: "G" },
                DELETE : { value: 0, name: "GET", code: "G" }
            };

// Example class
define([
    "dojo/_base/declare"
], function(declare){
    return declare("rfd/Resource", null, {
        constructor: function(name, parentId){
            this.id = name;
            this.name = name;
            this.parentId = parentId;
            this.methods = new Array();
        },

        isConcept: function() { return false; },

        toString: function() {
            var str = " = " +
                "name: " + this.name + "\n" +
                "parentId: " + this.parentId + "\n" +
                "isConcept: " + false;
            return str;
        }
    });
});
