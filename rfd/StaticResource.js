
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource) {
	//This is like a global pholder number
	var pholderNo = 0; //for automatic naming of resource eg. pholder1
    return declare("StaticResource", Resource, {
        constructor: function(name, parentId)
        {
            this.clearMethods();   //Does not support anything
            this.addMethod("GET");
            this.resource_type = this.declaredClass;
        },
    	createResource: function(parent)
    	{
    		parent = typeof parent !== 'undefined' ? parent : "/";
    		pholderNo++;
    		return new StaticResource("pholder"+pholderNo, parent);
    	},
    	autoName: function() {
    		pholderNo++;
    		this.id = "pholder"+pholderNo;
    		this.name = "pholder"+pholderNo;
    	},
        clone: function() 
        {
            var res = new StaticResource(this.id, this.parentId);
            res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            return res;
        }
    });
});
