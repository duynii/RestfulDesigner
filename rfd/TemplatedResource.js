
// Example class
define([
    "dojo/_base/declare",
    "rfd/Resource", "dojo/json"
], function(declare, Resource, JSON) {
    var autoNo = 0;
    return declare("TemplatedResource", Resource, 
    {
        constructor: function(name, parentId, json_data, template)
        {
            // 'name' and 'parentId' are auto init'ed in parent

            // template string
            this.template = template; 
            // Data source
            this.json_doc = json_data;
        },
        getJSON: function() { return this.json_doc; },
        getJSONStr: function() { return JSON.stringify(this.json_doc); },
        setJSON: function(data) { this.json_data = data },
        print: function() 
        {
            var str = this.inherited(arguments);
            str += "\ntemplate: " + this.template;
            str += "\nsource: " + JSON.stringify(this.source);
            return str;
        },
        clone: function() 
        {
            var res = new TemplatedResource(this.id, this.parentId, this.json_doc, this.template);
            res.is_concept = this.is_concept;
            res.methods.splice(0, 0, this.methods);
            return res;
        },
        autoName: function() 
        {
            autoNo++;
            this.id = "static"+autoNo;
            this.name = "static"+autoNo;
        }
    });
});
