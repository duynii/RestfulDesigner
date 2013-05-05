define([
    "dojox/collections/Dictionary",
    "dojo/dom",
    "dojo/dom-construct",
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
          "dojo/dnd/Source", 
          "dojo/store/Memory", 
    "rfd/controller/controller_one",
    "rfd/module"
    ],
function(
            Dictionary,
            dom, domConstruct, on, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, 
            TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            Source,
            Memory,
            Controller) 
{
    var store = new Memory({}),
    //flickrQuery = dojo.config.flickrRequest || {},
    stackContainer = null,
    catalogueTemplate_R = null,
    catalogueStatic_R = null,
    cssButtonMap = new Dictionary(),
    controller = new Controller(),
 
    startup = function() 
    {
        console.log("startup called")
        // create the data store
        //var flickrStore = this.store = new FlickrRestStore();
        initUi();
    },
    resourcesListCreator = function(item, hint) {

    },
    initCssButtonMap = function()
    {
      cssButtonMap.add("rfd/StaticResource", "staticResource");
      cssButtonMap.add("rfd/TemplatedResource", "templatedResource");
      cssButtonMap.add("rfd/Custom_R", "customResource");
      cssButtonMap.add("rfd/Concept_R", "individualResource");
      cssButtonMap.add("rfd/PartialConcept_R", "partialResource");
      cssButtonMap.add("rfd/Collection_R", "collectionResource");
    },
    catalogueListCreator = function(item, hint)
    {
      console.log("catalogue creator's item: " + item.declaredClass);

      var cssStyle = cssButtonMap.entry(item.declaredClass);
      console.log("css: " + item.declaredClass + " to " + cssStyle);
      var li = domConstruct.create("li");
      domConstruct.create(
      "button", 
        { 
          class: cssStyle,
          innerHTML:  item.toString() 
        },
        li,
        null
      );

      return { node: li, data: item, type: item.type };
    },
    // When a dnd catalogue item is droped into selected resource branch
    onResourcesListDrop = function(source, node, copy) 
    {

    },
    createResourceDesigner = function()
    {

      var source = new Source("resourcesList", {
        singular: true,  // Single item selection
        isSource: false, // Only acts as dnd target
        accept: ["resource"], // Accept resource objects only
        type: ["concepts"],
        creator: resourcesListCreator,
        onDropExternal: onResourcesListDrop
      });
    },
    getConcepts = function()
    {
      return null;
    },
    createResourcesCatalogue = function()
    {
      console.log("rightTree called");
      //create the first catalogue for first branch    
      var container = new Source("catalogueList_" + 1, {
          singular: true,
          accept: [], // This is a dnd source only
          creator: catalogueListCreator,
          type: ["concepts"]
      });
      // Testing purpose only
      var catalogueTemplate_R = new TemplatedResource("JSON Template", "/");
      var catalogueStatic_R = new StaticResource("static", "/");
      var concepts = getConcepts();
      container.insertNodes(false, [catalogueStatic_R, catalogueTemplate_R], false, null);
    },
    initUi = function() 
    {
        // summary:
        //      create and setup the UI with layout and widgets

        console.log("initUi called");

        initCssButtonMap();
        // Init the Resource Designer
        createResourceDesigner();
        stackContainer = registry.byId("stackContainer");
        createResourcesCatalogue();
 
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