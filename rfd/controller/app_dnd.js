define([
    "dojox/collections/Dictionary",
    "dojox/collections/ArrayList",
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
          "dojo/dnd/Container", 
          "dojo/dnd/Selector", 
          "dojo/dnd/Source", 
    "dojox/image/LightboxNano",
    "dojox/data/FlickrRestStore",
    "rfd/module"
    ],
function(
            Dictionary, ArrayList,
            dom, domConstruct, on, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            Container, Selector, Source,
            LightboxNano,
            FlickrRestStore) 
{
    var store = null,
    flickrQuery = dojo.config.flickrRequest || {},
 
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

        console.log("initUi called");

        var dic = new Dictionary();
        dic.add("a", "b");
        dic.add("b", "c");
        dic.add("c", "d");
        console.log("a: " + dic.entry("a"));
        console.log("c: " + dic.entry("c"));
        console.log("f: " + dic.entry("f"));

        var t = dic.containsKey("a");
        console.log("conatins: " + t);

        var arr = new ArrayList(["s", "d"]);
        console.log("conatins arr: " + arr.contains("s"));
        console.log("conatins arr: " + arr.contains("t"));

        
 
    },
    resourcesContainer = null,
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
    var resourceCreator = function(item, hint)
    {
         console.log("resources creator's item: " + item.declaredClass);

         var cssStyle = "collectionResource";
         if(item.declaredClass == "rfd/Concept_R") {
            cssStyle = "individualResource";
         }

         var li = domConstruct.create("li");
         domConstruct.create(
           "button", 
           { 
              id: item.name + "_id",
              class: cssStyle,
              innerHTML: "{" +item.name + "}" 
           },
           li,
           null
         );
          return { node: li, data: item, type: item.type };
    };
    var creatorFunc =  function(item, hint)
     {
         console.log("creator's item: " + item.declaredClass);

         var cssStyle = "collectionResource";
         if(item.declaredClass == "rfd/Concept_R") {
            cssStyle = "individualResource";
         }

         var li = domConstruct.create("li");
         domConstruct.create(
           "button", 
           { 
             class: cssStyle,
             innerHTML: "{" +item.name + "}" 
           },
           li,
           null
         );
          return { node: li, data: item, type: item.type };
     };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        },
        rightTree: function(id)
        {
          console.log("rightTree called");
          
          var container = new Source(id, {
            singular: true,
            accept: [], // This is a dnd source only
            creator: creatorFunc,
            type: ["concepts"]
          });

          var c1 = new Collection_R("hospitals", "/");
          var c2 = new Concept_R("services", "/");
          container.insertNodes(false, [c1, c2], false, null);
        },

        leftTree: function(id)
        {
          console.log("leftTree called");
          
          resourcesContainer = new Source(id, {
            singular: true,
            isSource: false, // Can only be dnd target
            accept: ["resource"], // Accept resource objects only
            type: ["concepts"],
            creator: resourceCreator ,
            checkAcceptance: function(source, nodes)
            {
                console.log("source checkAcceptance: " + nodes[0].id);
                return true;
            },
            onDropExternal: function(source, nodes, copy)
            {
              console.log("onDropExternal left called");

              console.log("source:" + typeof(source));
              console.log("node id:" + nodes[0].id);

         var selectedNode = null;
         resourcesContainer.getSelectedNodes().forEach(function(node)
         {
            selectedNode = node;
         });

         console.log("selected node id: " + (selectedNode != null ? selectedNode.id : "null selectedNode"));


              var obj = source.map[nodes[0].id];
              console.log("data: " + obj.data);
              console.log("type: " + obj.type);
              console.log("copy:" + copy);
              // performs the drop
              resourcesContainer.insertNodes(false, [obj.data], false, null);
              resourcesContainer.sync();

              //source.node.removeChild(nodes[0].id);
              source.getSelectedNodes().orphan();
              source.delItem(nodes[0].id);
              source.sync();
              //onDropExternal(source, nodes, copy);
            }
          });

          var c1 = new StaticResource("public", "/");
          var c2 = new Concept_R("contacts", "public");
          resourcesContainer.insertNodes(false, [c1, c2], false, null);
        }
    };
});