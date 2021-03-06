// Example class
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/cookie",
    "rfd/Concept",
    "rfd/model/Tree",
    "rfd/model/Branch",
    "rfd/model/Section",
    "rfd/StaticResource",
    "rfd/TemplatedResource",
    "rfd/Collection_R",
    "dojo/store/Memory",
    "dojo/text!RfD_documents/saves/mark1.rfd" 
], function(declare, baseArray, lang, cookie, Concept, 
            Tree, Branch, Section, 
            StaticResource, TemplatedResource, Collection_R,
            Memory, mark1)
{
    // This is a global singleton module
    var store = null,
    _tree =  new Tree(),
    // Array of concepts
    concepts = null,
    //create to access static function of class
    //_dummyStatic = new StaticResource("dummy", "/"),
    loadFromFile = function(raw_concepts)
    {
        raw_concepts = typeof raw_concepts !== 'undefined' ? raw_concepts : null;

        //var data = JSON.parse(mark1);

        if(raw_concepts == null) 
        {
            raw_concepts = JSON.parse(mark1).concepts;
        }

        // Should put all classes in a Dictionary
        var arr = baseArray.map(raw_concepts, function(obj_concept, index)
        {
            console.log("concept " + (index+1)  + " is " + obj_concept.name);
            // Create Concept class from db file's object
            var concept = new Concept(obj_concept.id, obj_concept.name, null);
            lang.mixin(concept, obj_concept);

            return concept;
        });

        return arr;
    },
    //Load tree from saved savedState
    _loadTree = function()
    {
        _tree.load()
    };
    return {
        init: function(concepts, branches)
        {
            //load from file or argument
            var concepts = loadFromFile(concepts);
            store = new Memory({data: concepts});

            //load the tree
            if(typeof branches !== 'undefined' && branches != null) {
                _tree.load(branches, concepts);
            }
        },
        //static: function() { return _dummyStatic; },
        constructor: function()
        {
        },
        getAllBranches: function() {
            return _tree.getBranches();
        },
        queryById: function(id)
        {
            var concept =  store.get(id);
            console.log("query by Id: " + id + " -> " + concept);

            return concept;
        },
        query: function(obj) {
            return store.query(obj);
        },
        addConcept: function (concept, options) {
            store.put(concept, options);
        },
        // Get existing concepts
        getConcepts: function() 
        {
            return store.query(function(item) {return true});
        },
        getTree: function() {
            return _tree;
        },
        toJSON: function() // Get the whole JSON representation of program current state eg. a save file
        {
            var saveState = {
                branches: _tree,
                concepts: this.getConcepts()
            };

            return saveState;
        },
        getJSONString: function() // Get the whole JSON representation of program current state eg. a save file
        {
            return JSON.stringify(this.toJSON());
        },
       onBranchingOut: function(branch, resource)
        {

            //Test if it clashs with existing branch
            //Note: this checks that no branch starts with the specified URL also.
            var existing_branch = _tree.getBranch(branch.toUrl());
            if(existing_branch != null) {
                alert("Clashing branch, it already exists: " + existing_branch.toUrl());
                return false;
            }

            _tree.addBranch(branch);
            //TODO check that no branch starts like this.
            return true;
        },
        onBranchDrop: function(branch_ref, resource)
        {
            //Check that the previous resource is an individual resource
            if(resource.declaredClass == "PartialConcept_R") {
                var last = branch_ref.lastResource();

                if(last != null && last.declaredClass != "Concept_R") {
                    alert("Partial element must be added after Type II/Individual resource");
                    return false;
                }

                resource.concept = last.concept;
            }

            //Create a branch copy just to add and call toUrl()
            var br = branch_ref.clone();
            br.addActiveResource(resource);

            //Note: this checks that no branch starts with the specified URL also.
            var existing_branch = _tree.getBranch(br.toUrl());
            if(existing_branch != null) {
                alert("Clashing branch, it already exists: " + existing_branch.toUrl());
                return false;
            }
            else {
                //branch_ref.addActiveResource(resource); // adds it
                //flows throught
            }
            return true;
        },
        getDummyBranch: function()
        {
            var branch = new Branch();
            branch.addActiveResource(new StaticResource("v1", "/"));
            branch.addActiveResource(new TemplatedResource("public", "v1"));

            var hos = queryById("hospitals");
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
    };
});
