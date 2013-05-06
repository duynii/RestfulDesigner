define([
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
          "rfd/ConceptResource",
          "rfd/Representation",
          "rfd/Concept_R",
          "rfd/Collection_R", 
          "dijit/form/CheckBox", 
          "dijit/form/NumberTextBox", 
          "dojo/dnd/Container", 
          "dojo/dnd/Moveable", 
          "dojo/text!RfD_documents/saves/mark1.rfd", 
    "rfd/module"
    ],
function(
            dom, domConstruct, domStyle, on, JSON, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            Container, Moveable,
            text
            ) 
{
    var store = null,
 
    startup = function() 
    {
        console.log("startup called")
        initUi();
    },
    createConcept = function(concept)
    {
        console.log("createConcept called");
        var outter = dom.byId("bottomLeft");
        // The table
        var table = domConstruct.create("table", {class: "classTable", position: "absolute"}, outter);
        domConstruct.create("th", {innerHTML: concept.name}, table);
        var container = new Container(table, { 
                      creator: function(item, hint) 
                      {
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                          innerHTML: item.name + ": " + item.type 
                        }, 
                        tr);
                        return { node: tr, data: item, type: ["text"] };
                      },
                      singular: true,
                      id: concept.name + "_table",
                      data: concept 
        });
        baseArray.forEach(concept.properties, function(prop, index)
        {
          console.log("\tproperty" + (index+1)  + " is " + prop.name);
        });

        container.insertNodes(concept.properties, false, null);
        // Make it dragable any where inside its container div
        new Moveable(table);
    },
 
    initUi = function() 
    {
        console.log("initUi called");

        var data = JSON.parse(text);

        var outter = dom.byId("bottomLeft");
        // For each object do something
        var left = 0; // For arranging the classes left to right
        // Should put all classes in a Dictionary
        baseArray.forEach(data.concepts, function(concept, index)
        {
          console.log("concept " + (index+1)  + " is " + concept.name);
          // create a Container (table) for this concept
          var table = domConstruct.create("table", {class: "classTable", position: "absolute"}, outter);
          domConstruct.create("th", {innerHTML: concept.name}, table);
          //domStyle.set(table, "position", "absolute");
          //console.log("style before: " + domStyle.get(table, "class"));
          var container = new Container(table, { 
                      creator: function(item, hint) 
                      {
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                          innerHTML: item.name + ": " + item.type 
                        }, 
                        tr);
                        return { node: tr, data: item, type: ["text"] };
                      },
                      singular: true,
                      id: concept.name + "_table",
                      data: concept 
          });
          baseArray.forEach(concept.properties, function(prop, index)
          {
            console.log("\tproperty" + (index+1)  + " is " + prop.name);
          });

          container.insertNodes(concept.properties, false, null);

          new Moveable(table);
        });

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
