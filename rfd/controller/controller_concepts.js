// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "rfd/Concept",
    "rfd/model/Tree",
    "rfd/model/Branch",
    "rfd/model/Section",
    "rfd/StaticResource",
    "rfd/TemplatedResource",
    "rfd/Collection_R",
    "dojo/store/Memory",
    "dojo/text!RfD_documents/saves/mark1.rfd" 
], function(declare, baseArray, lang, Concept, 
            Tree, Branch, Section, 
            StaticResource, TemplatedResource, Collection_R,
            Memory, mark1){
    return declare("rfd/controller/controller_concepts", null, 
    {
        store: null,
        _tree: new Tree(),
        // Array of concepts
        concepts:  null,
        constructor: function()
        {
            this.concepts = this.loadFromFile();
            this.store = new Memory({data: this.concepts});
        },
        queryById: function(id)
        {
            var concept =  this.store.get(id);
            console.log("query by Id: " + id + " -> " + concept);

            return concept;
        },
        query: function(obj) {
            return this.store.query(obj);
        },
        loadFromFile: function()
        {
            var data = JSON.parse(mark1);

            // Should put all classes in a Dictionary
            var arr = baseArray.map(data.concepts, function(obj_concept, index)
            {
              console.log("concept " + (index+1)  + " is " + obj_concept.name);
              // Create Concept class from db file's object
              var concept = new Concept(obj_concept.id, obj_concept.name, null);
              lang.mixin(concept, obj_concept);

              return concept;
            });

            data.concepts = arr;
            return data.concepts;
        },
        // Get existing concepts
        getConcepts: function() 
        {
            if(this.concepts == null) {
                return this.loadFromFile();
            }

            return this.concepts;
        },
        getDummyBranch: function()
        {
            var branch = new Branch();
            branch.addActiveResource(new StaticResource("v1", "/"));
            branch.addActiveResource(new TemplatedResource("public", "v1"));

            var hos = this.queryById("hospitals");
            if(hos != null) {
                branch.addActiveResource(new Collection_R("hospitals", "public", hos));
            }

            return branch;
        },

        deleteConcept: function(concept)
        {
            
        },

        print: function() 
        {
            return "controller: nothing";
        }
    });
});
