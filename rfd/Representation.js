
// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array"
], function(declare, arrayUtil){
    return declare("rfd/Representation", null, {
        constructor: function(concept, fields){
            this.concept = concept;

            fields = typeof fields !== 'undefined' ? fields : [];
            this.fields = fields;

            this.id = this.toString();
            this.label = this.toString();
        },
        // Push a field (Property object) into the array
        addField: function(field) {
            this.fields.push(field);
            this.id = this.toString();
            this.label = this.toString();
        },
        toString: function()
        {
            return this.fields.join(',');
        },
        toPrint: function() {
            var str = "Fields: \n";
            arrayUtil.forEach(this.fields, function(field, index) {
                str += (++index) + ' -> ' + JSON.stringify(field) + "\n";
            });
            return str;
        }

    });
});
