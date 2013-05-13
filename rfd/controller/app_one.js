define([
    "dojox/collections/Dictionary",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dojo/json",
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
          "rfd/Custom_R",
          "rfd/Representation",
          "rfd/Concept_R",
          "rfd/PartialConcept_R",
          "rfd/Collection_R", 
          "dijit/form/CheckBox", 
          "dijit/form/NumberTextBox", 
          "dojo/dnd/Source", 
          "dojo/dnd/Container", 
          "dojo/store/Memory",
    "rfd/model/Tree",
    "rfd/model/Branch",
    "rfd/model/Section",
    "rfd/controller/Controller_One",
    "rfd/widget/HidePane",
    "rfd/widget/PushMe",
    "rfd/widget/AuthorWidget",
    "rfd/widget/ListItem",
    "dojo/text!../../demo/authors.json",
    "rfd/module"
    ],
function(
            Dictionary,
            dom, domConstruct, domStyle, on, JSON, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, 
            TemplatedResource, Custom_R, Representation,
            Concept_R, PartialConcept_R, Collection_R,
            CheckBox, NumberTextBox,
            Source, Container,
            Memory,
            Tree, Branch, Section,
            Controller,
            HidePane, PushMe, AuthorWidget, ListItem, authors_json) 
{
    var store = null,
    resDesigner = null,
    resCatalogue = null,
    stackContainer = null,
    cssButtonMap = new Dictionary(),
    controller = new Controller(),
 
    startup = function() 
    {
        console.log("startup called")
        initUi();
    },
    resourcesListCreator = function(item, hint) 
    {
      console.log("Designer creator: hint - " + hint + ", item - " + item);

      //item is a resource
      var branch = new Branch();
      branch.addActiveResource(item);

      var li = new ListItem(
      {
        onBranchOut: function(branch)
        {
          console.log("event branch out: " + branch);
        }
      });
      li.placeAt("resourcesList");

      li.setBranch(branch);


      //li.setBranchMenu();

      return {node: li.domNode, data: branch, type: ["branch"]};

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
      console.log("Catalogue creator: hint - " + hint + ", item - " + item);
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
    onResourcesListDrop = function(source, nodes, copy) 
    {
      console.log("onResourcesListDrop left called");
      console.log("source:" + typeof(source));
      console.log("node id:" + nodes[0].id);

      var nodeId = nodes[0].id;

      //Check if there s no resource
      var itemNo = resDesigner.size();
      console.log("Drop found " + itemNo + " item/s");

      //Data item
      var resource = source.getItem(nodeId).data;
      console.log("Drop resource: " + resource);

      var selected = resDesigner.getSelected();
      console.log("widget: " + selected);

      if(itemNo == 0) // Add the first ListItem for first branch
      {

        resDesigner.insertNodes(false, [resource], false, null);
        resDesigner.sync();

        //TODO, may not want to do this
        source.getSelectedNodes().orphan();
        source.delItem(nodeId);
        //source.sync():
      }
      else 
      {
        //There must be a selected node
        var selected = resDesigner.getSelected();
        var widget = registry.getEnclosingWidget(selected);

        console.log("current: " + resDesigner.current);
        console.log("no: " + resDesigner.size());

        var li = registry.getEnclosingWidget(resDesigner.current);
        console.log("li type: " + li.declaredClass);
        li.branch.addActiveResource(resource);
        li.addResource(resource, li.branch);

        //TODO, may not want to do this
        source.getSelectedNodes().orphan();
        source.delItem(nodeId);
      }
    },
    createResourceDesigner = function()
    {

      resDesigner = new Source("resourcesList", {
        id: "resourcesContainer",
        singular: true,  // Single item selection
        isSource: false, // Only acts as dnd target
        accept: ["resource"], // Accept resource objects only
        type: ["concepts"],
        onDropExternal: onResourcesListDrop,
        creator: resourcesListCreator
      });

      resDesigner.size = function() 
      {
        var itemNo = 0;
        resDesigner.forInItems(function(obj, id, map)
        {
          itemNo++;
        }, 
        resDesigner);
        return itemNo;
      };

      // return the selected node, it can only be one in this app
      resDesigner.getSelected = function()
      {
         resDesigner.getSelectedNodes().forEach(function(node)
         {
            return node;
         });

         return null;
      }
    },
    createResourcesCatalogue = function()
    {
      console.log("rightTree called");
      //create the first catalogue for first branch    
      resCatalogue = new Source("catalogueList_" + 1, {
          singular: true,
          accept: [], // This is a dnd source only
          creator: catalogueListCreator,
          type: ["concepts"]
      });
      // Testing purpose only
      var template_R = new TemplatedResource("JSON Template", "/", {title: "Test JSON data"
        , data: "some text"}, null );
      var static_R = new StaticResource("static", "/");
      var custom_R = new Custom_R("Custom", "/");
      var available = [ template_R, static_R, custom_R ];
      //var coll_R = new Collection_R("Collection of concepts", "/");
      //var concept_R = new Concept_R("Concept", "/");
      //var partial_R = new PartialConcept_R("Partial Concept", "/");
      var concepts = controller.getConcepts();
      baseArray.forEach(concepts, 
        function(concept, index)
        {
          console.log("Looping through: " + concept.id);
          var coll_R = new Collection_R(concept.id, "/");
          //var concept_R = new Concept_R(concept.id, "/");
          available.push(coll_R);
          //available.push(concept_R);
        }, 
        this
      );
      resCatalogue.insertNodes(false, available, false, null);
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

    var createConceptFunc = new function(concept)
    {
      var outter = dom.byId("bottomLeft");
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        },
        createConcept: createConceptFunc
    };
});