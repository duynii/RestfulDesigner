
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource){
    return declare("rfd/StaticResource", Resource, {
        constructor: function(name){
            // name is auto init'ed in parent
        }
    });
});
