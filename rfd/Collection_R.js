
// Example class
define([
    "dojo/_base/declare",
    "dojox/collections/ArrayList",
    "rfd/ConceptResource"
], function(declare, ArrayList, ConceptResource){
    return declare("Collection_R", ConceptResource, {
    	constructor: function(name, parentId) 
    	{
    		// Array of associated OrderBy objects
    		this.orderbys = new ArrayList();
    	}
    });
});
