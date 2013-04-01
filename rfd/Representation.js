
// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array"
], function(declare, arrayUtil){
    return declare("rfd/Representation", null, {
        constructor: function(concept){
            this.concept = concept;

            this.fields = new Array();
        },

        // Push a field (fieldObject) into the array
        addField: function(field) {
            this.fields.push(field);
        },

        toString: function() {
            var str = "Fields: \n";
            arrayUtil.forEach(this.fields, function(field, index) {
                str += (++index) + ' -> ' + JSON.stringify(field) + "\n";
            });
            return str;
        }

    });
});
