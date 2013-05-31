
// Example class
define([
    "dojo/_base/declare",
    "dojo/json",
    "dojo/_base/array"
], function(declare, JSON, baseArray){
    return declare("Concept", null, {
        constructor: function(name, id, parentId){
            this.name = name;
            this.id = id;
            this.parentId = parentId;
            this.properties = [{name: "id", type: "integer", indexed: true}];

            // names of class/es this one belongs to
            //many to one relationship, this is the many side
            this.belongs_to = new Array();
        },
        clone: function() 
        {
            var c = new Concept(this.id, this.name, this.parentId);
            res.properties.splice(0,0, this.properties);
            res.belongs_to.splice(0,0, this.belongs_to);
        },
        setId: function(id) {
            this.id = id;
            this.name = id;
        },
        toString : function() {
            var str = "name: " + this.name + ", parent: " + this.parentId;
        },
        print: function() {
            var str = " = id: " + this.id + " name: " + this.name + " parentID: " + this.parentId;
            str += "\nprops: \n";
            baseArray.forEach(properties, function(prop, index) {
               str += prop.toString() + "\n";
            });
            console.log(str);
        },
        //Return prop names in an array
        getPropertyNames: function() {
            return baseArray.map(this.properties, function(prop){
                return prop.name;
            });
        },
        // return -1 if not found otherwise an index
        _findProperty: function(name) 
        {
            var ind = -1;
            baseArray.forEach(this.properties, function(prop, index)
            {
                if(prop.name === name) {
                    ind = index;
                }
            }, this);

            return ind;
        },
        findProperty: function(name) {
            var ind = this._findProperty(name);
            if(ind == -1) { return null;}

            return this.properties[ind];
        },
        hasProperty: function(name)
        {
            var ind = this._findProperty(name);
            return (ind != -1);
        },
        deleteProperty: function(prop) 
        {
            var indexOf = null;

            baseArray.forEach(this.properties, function(item, index)
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
        lastProp: function() {
            if(this.properties.length < 0) {
                return null;
            }
            return this.properties[this.properties.length-1];
        },
        addObjProperty: function(prop) 
        {
            this.properties.push(prop);
            console.log("added new prop: " + JSON.stringify(prop));

            return true;
        },
        addProperty: function(name, type, indexed, required) 
        {
            // Add the property, must be unique name

            // default param value
            indexed = typeof indexed !== 'undefined' ? indexed : false;
            required = typeof required !== 'undefined' ? required : true;

            // Checks here
            /* TODO fix this, cannot return from loop
            baseArray.forEach(this.properties, function(prop) {
                if(prop.name == name) {
                    console.warn("Property with name exists: " + name);
                    return false;
                }
            });
*/

            //Add property here
            var prop = {name: name, type: type, indexed: indexed};
            this.properties.push(prop);
            console.log("added new prop: " + JSON.stringify(prop));
            return true;
        }


    });
});
