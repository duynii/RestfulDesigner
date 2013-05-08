// Example class
define([
    "dojo/_base/declare",
    "rfd/model/Tree",
    "rfd/model/Branch",
    "rfd/model/Section",
    "dojo/store/Memory"
], function(declare, Tree, Branch, Section, Memory){
    return declare("rfd/controller/controller_one", null, 
    {
        store: new Memory(),
        constructor: function()
        {
        },
        // Get existing concepts
        getConcepts: function() 
        {

        },

        deleteConcept: function(concept)
        {

        },

        print: function() 
        {
            return "controller: nothing";
        }
    });
});