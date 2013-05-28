
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource"
], function(declare, ConceptResource){
    return declare("Collection_R", ConceptResource, {
    	constructor: function(name, parentId, concept) 
    	{
            this.id = concept.id;
            this.name = concept.id;

            if(concept.id.charAt(concept.id.length-1) != 's') {
                this.id += "s";
                this.name += "s";
            }
    		// Array of associated OrderBy objects
    		this.orderbys = new Array();
            this.concept = concept; //concept do not get copied
    	},
        autoName: function() 
        {
            // Not needed for this
        },
        clone: function() 
        {
            var res = new Collection_R(this.id, this.parentId, this.concept);
            //res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            res.orderbys.splice(0, 0, this.orderbys);
            return res;
        }
    });
});
