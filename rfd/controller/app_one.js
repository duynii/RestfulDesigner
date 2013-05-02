define([
    "dojo/dom",
    "dojo/on",
    "dojo/keys",
    "dojo/_base/lang",
    "dojo/_base/array", 
    "dojo/_base/event", 
          "dojo/parser", 
          "dijit/form/Button",
          "dijit/registry",
          "dojo/query",
          "rfd/Resource",
          "rfd/StaticResource",
          "rfd/TemplatedResource",
          "rfd/ConceptResource",
          "rfd/Representation",
          "rfd/Concept_R",
          "rfd/Collection_R", 
          "dijit/form/CheckBox", 
          "dijit/form/NumberTextBox", 
    "dojox/image/LightboxNano",
    "dojox/data/FlickrRestStore",
    "rfd/module"
    ],
function(
            dom, on, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            LightboxNano,
            FlickrRestStore) 
{
    var store = null,
    flickrQuery = dojo.config.flickrRequest || {},
    stackController = null,
 
    startup = function() 
    {
        console.log("startup called")
        // create the data store
        var flickrStore = this.store = new FlickrRestStore();
        initUi();
    },
 
    initUi = function() 
    {
        // summary:
        //      create and setup the UI with layout and widgets
        // create a single Lightbox instnace which will get reused
        lightbox = new LightboxNano({});

        console.log("initUi called");

        registry.byId("stackContainer").forward();
 
    },
    doSearch = function() {
        // summary:
        //      inititate a search for the given keywords
        console.log("doSearch called");
    },
    renderItem = function(item, refNode, posn) 
    {
        // summary:
        //      Create HTML string to represent the given item
        console.log("renderItem called");
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        }
    };
});