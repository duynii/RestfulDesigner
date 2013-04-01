
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource){
    return declare("rfd/TemplatedResource", Resource, {
        constructor: function(name, json_data, template){
            // 'name' is auto init'ed in parent

            // template string
            this.template = template; 
            // Data source
            this.source = json_data;
        },

        toString: function() {
            var str = this.inherited(arguments);
            str += "\ntemplate: " + this.template;
            str += "\nsource: " + JSON.stringify(this.source);
            return str;
        }
    });
});
