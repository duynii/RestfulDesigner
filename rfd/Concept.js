
// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojox/collections/ArrayList"
], function(declare, arrayUtil, ArrayList){
    return declare("rfd/Concept", null, {
        constructor: function(name, id, parentId){
            this.name = name;
            this.id = id;
            this.parentId = parentId;
            this.properties = new ArrayList();
        },

        toString : function() {
            var str = "name: " + this.name + ", parent: " + this.parentId;
        },
        print: function() {
            var str = " = id: " + this.id + " name: " + this.name + " parentID: " + this.parentId;
            str += "\nprops: \n";
            arrayUtil.forEach(properties.toArray(), function(prop, index) {
               str += prop.toString() + "\n";
            });
            console.log(str);
        },
        deleteProperty: function(prop) {
            if(this.properties.contains(prop)) {
                this.properties.remove(prop);
            }
        },
        addProperty: function(name, type, indexed, required) {
            // Add the property, must be unique name

            // default param value
            indexed = typeof indexed !== 'undefined' ? indexed : false;
            required = typeof required !== 'undefined' ? required : true;

            // Checks here
            this.properties.forEach(function(prop) {
                if(prop.name == name) {
                    console.warn("Property with name exists: " + name);
                    return false;
                }
            });

            //Add property here
            this.properties.add({name: name, type: type, indexed: indexed});
            console.log("it returns: ");
            return true;
        }


    });
});
