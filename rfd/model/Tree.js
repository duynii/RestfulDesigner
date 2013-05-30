// Example class
define([
    "dojo/_base/declare",
    "rfd/model/Branch",
    "dojo/store/Memory",
    "dojo/store/Observable"
], function(declare, Memory, Observable){
    return declare("Tree", null, 
    {
        constructor: function()
        {
            // This array is obsalete
            //this.branches = new Array();
            this.store = new Observable(new Memory({ data: [] }));
        },
        // This does a like match for 'idUrl%', so that feature can be used
        //  eg. "static/" will find a branch with id "static/custom/"
        getBranch: function(idUrl)
        {
            // TODO Branch shall have an ID string
            var br =  this.store.get(idUrl);

            if(typeof br === 'undefined') {
                return null;
            }

            console.log("getBranch: " + br);
            return br;
        },
        addBranch: function(br) { this.store.put(br); }, // Triggers observers
        removeBranch: function(brId) { this.store.remove(brId); },
        getBranches: function() { return this.branhces; },
        toString: function()
        {
            return "TODO";
        },
        // serialise a tree to JSON string, return the object for it
        toJSON: function() 
        {
            var branches = this.store.query(function(dummy){return true;});
            return branches; // returns as an array object
        },
        print: function() 
        {
            //"TODO";
            // Print everything here
        }
    });
});