
// Example class
define([
    "dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang",
    "rfd/StaticResource", "rfd/TemplatedResource", "rfd/Custom_R", "rfd/Collection_R", 
    "rfd/Concept_R", "rfd/PartialConcept_R", "rfd/Concept"
], function(declare, baseArray, lang,
            StaticResource, TemplatedResource, Custom_R, 
            Collection_R, Concept_R, PartialConcept_R,
            Concept){
    var dummyConcept = new Concept("dummyC", "dummyC", "na");
    var s_getResourceClass = function(name) 
    {

            switch(name)
            {
                case "StaticResource":
                    return new StaticResource("dummy", "dummy");
                break;
                case "TemplatedResource":
                    return new TemplatedResource("dummy", "dummy", {}, "");
                break;
                case "Custom_R":
                    return new Custom_R("dummy", "dummy", null);
                break;
                case "Collection_R":
                    return new Collection_R("dummy", "dummy", dummyConcept);
                break;
                case "Concept_R":
                    return new Concept_R("dummy", "dummy", dummyConcept);
                break;
                case "PartialConcept_R":
                    return new PartialConcept_R("dummy", "dummy", dummyConcept);
                break;
                default:
                    console.error("Unknown resource found: " + name);
                    return null;
            }
    };
    return declare("Section", null, 
    {
        constructor: function()
        {
            this.resources = new Array();
        },
        addResource: function(resource)
        {
            this.resources.push(resource);
        },
        hasResourceId: function(id)
        {
            var ind = -1;
            baseArray.forEach(this.resources, function(res, index)
                {
                    if(res.id == id) {
                        ind = index;
                    }
                }, 
                this
            );
            return (ind != -1);
        },
        branchOut: function(fromRes, branch)
        {
            var ind = -1;
            baseArray.forEach(this.resources, function(res, index)
                {
                    if(ind == -1) {
                        branch.addInactiveResource(res);
                    }
                    if(res.id == fromRes.id) {
                        ind = index;     
                    }
                }, 
                this
            );
            return (ind != -1);
        },
        size: function() { return this.resources.length; },
        last: function() 
        { 
            if(this.resources.length <= 0 ){
                return null;
            } 

            return this.resources[this.size() - 1];
        },
        toString: function()
        {
            var str = "";
            baseArray.forEach(this.resources, function(resource, index)
                {
                    str += resource + '/';
                }, 
                null
            );
            return str;
        },
        print: function() 
        {
            console.log("Section: " + toString());
        },
        load: function(concepts)
        {
            this.resources = baseArray.map(this.resources, function(res)
            {
                var resource = s_getResourceClass(res.resource_type);
                lang.mixin(resource, res);

                // Now set up references to concepts correctly, when JSON'ed only concept name is used
                if(typeof resource.concept !== 'undefined' || resource.concept != null)
                {
                    // Filter act as a search, should return only one
                    var concept_real_refs = baseArray.filter(concepts, function(concept) {
                        return (concept.id == resource.concept);
                    });
                    // Set it to point to real reference
                    resource.concept = concept_real_refs[0];
                }
                return resource;
            }); 
        }
    });
});
