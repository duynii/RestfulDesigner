
// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array"
], function(declare, arrayUtil){
    return declare("rfd/Concept", null, {
        constructor: function(name, id, parentId){
            this.name = name;
            this.id = id;
            this.parentId = parentId;
            this.properties = new Array();
        },

        toString : function() {
            var str = "name: " + this.name + ", parent: " + this.parentId;
        },
        print: function() {
            var str = " = id: " + this.id + " name: " + this.name + " parentID: " + this.parentId;
            str += "\nprops: \n";
            arrayUtil.forEach(properties, function(prop, index) {
               str += prop.toString() + "\n";
            });
            return str;
        }


    });
});
