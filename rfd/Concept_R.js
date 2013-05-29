
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
    return declare("Concept_R", ConceptResource, {
        constructor: function(name, parentId, concept)
        {
            this.id = concept.id;
            this.name = concept.id;
            //un pluralise name
            if(this.name.charAt(this.name.length-1) == 's') {
                this.name  = this.name.substr(0, this.name.length-1);
            }
            this.name = this.name + "_id";
            this.id = this.name;

            this.methods.length = 0;
            this.methods.push("GET");
            this.methods.push("DELETE");
            this.resource_type = this.declaredClass;
        },
        autoName: function() 
        {
            // Not needed for this
        },
        clone: function() 
        {
            var res = new Concept_R(this.id, this.parentId, this.concept);
            //res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            return res;
        }
    });
});
