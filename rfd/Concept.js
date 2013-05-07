
// Example class
define([
    "dojo/_base/declare",
    "dojo/json",
    "dojo/_base/array"
], function(declare, JSON, arrayUtil){
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
            console.log(str);
        },
        deleteProperty: function(prop) 
        {
            var indexOf = null;

            arrayUtil.forEach(this.properties, function(item, index)
            {
                console.log("item: " + JSON.stringify(item));
                if(prop.name == item.name) 
                {
                    indexOf = index;
                    console.log("prop removed from " + this.name + ": " + JSON.stringify(item));
                }
            });
            if(indexOf != -1) {
                this.properties.splice(indexOf, 1); // remove one
            }
        },
        addProperty: function(name, type, indexed, required) {
            // Add the property, must be unique name

            // default param value
            indexed = typeof indexed !== 'undefined' ? indexed : false;
            required = typeof required !== 'undefined' ? required : true;

            // Checks here
            arrayUtil.forEach(this.properties, function(prop) {
                if(prop.name == name) {
                    console.warn("Property with name exists: " + name);
                    return false;
                }
            });

            //Add property here
            var prop = {name: name, type: type, indexed: indexed};
            this.properties.push(prop);
            console.log("added new prop: " + JSON.stringify(prop));
            return true;
        }


    });
});
