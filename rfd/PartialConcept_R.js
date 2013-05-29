
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
    return declare("PartialConcept_R", ConceptResource, {
        constructor: function(name, parentId, json_data, template)
        {
            // 'name' and 'parentId' are auto init'ed in parent

            this.addMethod("GET");  // support GET
            this.addMethod("PUT");  // support PUT
            this.resource_type = this.declaredClass;
        },
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
