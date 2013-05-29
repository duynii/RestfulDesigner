// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
	// Should this really connect to a Concept
    var autoNo = 0;
    return declare("Custom_R", ConceptResource, {
        constructor: function(name, parentId)
        {
            this.clearMethods();
            this.resource_type = this.declaredClass;
        },
        autoName: function() 
        {
            autoNo++;
            this.id = "param"+autoNo;
            this.name = "param"+autoNo;
            this.param = null;
        },
        clone: function() 
        {
            var res = new Custom_R(this.id, this.parentId);
            res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            res.param = this.param;
            return res;
        }
    });
});
