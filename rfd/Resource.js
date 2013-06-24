


// Example class
define([
    "dojo/_base/declare", "dojox/collections/Dictionary", "dojo/_base/array"
], function(declare, Dictionary, baseArray)
{
    var METHODS = { 
                GET :   { id: "GET" },
                POST :  { id: "POST"},
                PUT :   { id: "PUT" },
                CREATE : { id: "CREATE" },
                DELETE : { id: "DELETE" }
    },
    dictionaryInited = false,
    initDictionary = function() 
    {
        if(dictionaryInited) {
            return;
        }
        dictionary.add(METHODS.GET.id, METHODS.GET);
        dictionary.add(METHODS.POST.id, METHODS.POST);
        dictionary.add(METHODS.PUT.id, METHODS.PUT);
        dictionary.add(METHODS.CREATE.id, METHODS.CREATE);
        dictionary.add(METHODS.DELETE.id, METHODS.DELETE);
        dictionaryInited = true;
    }
    dictionary = new Dictionary();
    return declare("Resource", null, 
    {
        constructor: function(name, parentId)
        {
            this.id = name;
            this.name = name;
            this.parentId = parentId;
            this.is_concept = false;
            this.resource_type = "Resource"; // to be overriden in child
            this.type = [ "resource" ];
            this.methods = [];
            this.clearMethods();
        },
        hasMethod : function(method) 
        {
            if(this.methods.length == 0) {
                return false;
            }
            var filtered = baseArray.filter(this.methods, function(item)
            {
                return item.id == method.id;
            });

            return filtered.length >= 1;
        },
        setId: function(id) {
            this.id = id;
            this.name = id;
        },
        getMethod: function(name) {
            initDictionary();
            return dictionary.entry(name).value;
        },
        addMethod: function(name) {
            this.methods.push({id: name});
        },
        findMethod: function(name) 
        {
            var resultArr = baseArray.filter(this.methods, function(item) {
                return item.id == id;
            });

            if(resultArr.length == 0) {
                return null;
            }
            return resultArr[0];
        },
        clearMethods: function() {
            while(this.methods.length > 0 ) {
                //this.methods.splice(0, this.methods.length);
                this.methods.pop();
            }
        },
        toString: function()
        {
            return this.name;
        },
        print: function() 
        {
            var str = " = " +
                "name: " + this.name + "\n" +
                "parentId: " + this.parentId + "\n" +
                "isConcept: " + false;
            return str;
        }
    });
});
