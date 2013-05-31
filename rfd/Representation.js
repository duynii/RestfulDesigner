
// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array"
], function(declare, arrayUtil){
    return declare("rfd/Representation", null, {
        constructor: function(id, fields)
        {
            //unique name for this representation
            this.id = id;

            fields = typeof fields !== 'undefined' ? fields : [];
            this.fields = fields;
        },
        setId: function(id) { this.id = id; },
        // Push a field (Property object) into the array
        addField: function(field) {
            this.fields.push(field);
        },
        toString: function()
        {
            return this.id;
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
