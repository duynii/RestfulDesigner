
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
    return declare("Concept_R", ConceptResource, {
        constructor: function(name, parentId, concept)
        {
            //un pluralise name
            if(name.charAt(name.length-1) == 's') {
                name  = name.substr(0, name.length-1);
                this.name = name + "_id";
            }
        },
        autoName: function() 
        {
            // Not needed for this
        },
        clone: function() 
        {
            var res = new Concept_R(this.id, this.parentId);
            //res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            return res;
        }
    });
});
