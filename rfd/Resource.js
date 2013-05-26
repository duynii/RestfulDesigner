

// Example class
define([
    "dojo/_base/declare"
], function(declare){
    return declare("rfd/Resource", null, 
    {
        constructor: function(name, parentId)
        {
            this.id = name;
            this.name = name;
            this.parentId = parentId;
            this.methods = new Array();

            this.is_concept = false;
            this.type = [ "resource" ];
        },
        setId: function(id) {
            this.id = id;
            this.name = id;
        },
        toString: function()
        {
            return this.name;
        },
        print: function() 
        {
            var str = " = " +
                "name: " + this.name + "\n" +
                "parentId: " + this.parentId + "\n" +
                "isConcept: " + false;
            return str;
        }
    });
});
