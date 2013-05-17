
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource"
], function(declare, Resource){
    return declare("TemplatedResource", Resource, {
        constructor: function(name, parentId, json_data, template){
            // 'name' and 'parentId' are auto init'ed in parent

            // template string
            this.template = template; 
            // Data source
            this.source = json_data;
        },

        print: function() {
            var str = this.inherited(arguments);
            str += "\ntemplate: " + this.template;
            str += "\nsource: " + JSON.stringify(this.source);
            return str;
        }
    });
});
