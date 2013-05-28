
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
    return declare("PartialConcept_R", ConceptResource, {
        autoName: function() 
        {
            // Not needed for this
        },
        clone: function() 
        {
            var res = new PartialConcept_R(this.id, this.parentId);
            //res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            return res;
        }
    });
});
