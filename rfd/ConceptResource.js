
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource)
{
    return declare("rfd/ConceptResource", Resource, 
    {
        constructor: function(name, parentId)
        {
            // Re-defined here, mixin to replace parent's false value
            this.is_concept = true;
        },
        toString: function() 
        {
            return "{" + this.name + "}";
        },
        print: function() 
        {
            var str = " = " +
                "name: " + this.name + "\n" +
                "isConcept: " + true;
            return str;
        }

    });
});
