
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource)
{
    return declare("ConceptResource", Resource, 
    {
        constructor: function(name, parentId, concept)
        {
            // Re-defined here, mixin to replace parent's false value
            this.is_concept = true;
            if(typeof concept === 'undefined' || concept == null) {
                console.error("concept cannot be null inside a ConceptResource type");
            }
            this.entity = concept;
        },
        toString: function() 
        {
            return "{" + this.name + "}";
        },
        print: function() 
        {
            var str = " = " +
                "name: " + this.name + "\n" +
                "isConcept: " + this.is_concept + "\n" +
                "entity:: " + this.entity;
            return str;
        }

    });
});
