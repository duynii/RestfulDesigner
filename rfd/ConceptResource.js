
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource", "dojo/_base/lang"
], function(declare, Resource, lang)
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

            concept = typeof concept !== 'undefined' ? concept : null;
            this.concept = concept;

            //TODO set concept name to resource's name
        },
        toString: function() 
        {
            return "{" + this.name + "}";
        },
        toJSON: function() {
            var obj = {};
            lang.mixin(obj, this);
            if(this.concept != null) {
                obj.concept = this.concept.name;
            }
            return obj;
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
