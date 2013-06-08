
// Example class
define([
    "dojo/_base/declare",
    "rfd/ConceptResource", "dojo/json", "dojo/_base/lang"
], function(declare, ConceptResource, JSON, lang){
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

            this.has_paging = true;
            this.paging_size = 100;

            this.methods.length = 0;
            this.addMethod("GET");  //only support GET
            this.addMethod("POST"); // create
            this.resource_type = this.declaredClass;
    	},
        toString: function() {
            return this.name;
        },
        autoName: function() 
        {
            // Not needed for this
        },
        clone: function() 
        {
            var res = new Collection_R(this.id, this.parentId, this.concept);

            res.has_paging =  this.has_paging;
            res.paging_size = this.paging_size;
            //res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            res.orderbys.splice(0, 0, this.orderbys);

            
            res.selected_rep = this.selected_rep;
            res.clearReps();
            res.representations.splice(0,0, this.representations);
            return res;
        }
    });
});
