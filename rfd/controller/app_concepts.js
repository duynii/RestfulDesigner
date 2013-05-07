CLASS_SPACING = 40;
CLASS_Y_SPACING = 10;

define([
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/query",
    "dojo/on",
    "dojo/json",
    "dojo/keys",
    "dojo/_base/lang",
    "dojo/_base/array", 
    "dojo/_base/event", 
    "dojox/collections/Dictionary",
          "dojo/parser", 
          "dijit/form/Button",
          "dijit/registry",
          "dijit/Menu",
          "dijit/MenuItem",
          "dijit/MenuSeparator",
          "rfd/Concept",
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
          "dojo/dnd/Moveable", 
          "dojo/text!RfD_documents/saves/mark1.rfd", 
    "rfd/module"
    ],
function(
            dom, domConstruct, domStyle, domGeometry, query, on, JSON, keys, lang, baseArray, baseEvent, 
            Dictionary,
            parser, Button, registry, Menu, MenuItem, MenuSeparator,
            Concept,
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            Container, Selector, Moveable,
            text
            ) 
{
    var store = null,
    tablesMap = new Dictionary(),
    temp_id_num = 1,
    table_row_id = null,
 
    startup = function() 
    {
        console.log("startup called")
        initUi();
    },
    arrangeClasses = function()
    {
      /*
      tablesMap.forEach(function(pair) {
          console.log("key:" + pair.key + ", item: " + pair.value.id);

          //var container = registry.byId(pair.key);
          //console.log("container: " + container.id);
        }, 
        null
      );
*/

      var bottomLeft = dom.byId("bottomLeft");
      /*
      var containers = registry.findWidgets(bottomLeft);
      var left = 0;
      baseArray.forEach(containers, function(item) {
        var box = domGeometry.getMarginBox(item.domNode);
        domStyle.set(item.domNode, "left", left + "px");
        left += box.l + CLASS_SPACING;
      });
      */
      var left = 0;
      var top = 0;
      var maxHeight = 0;
      var divBox = domGeometry.getMarginBox(bottomLeft);
      query("#bottomLeft > .classTable").forEach(function(node)
      {
        console.log("table: " + node.id);
        domStyle.set(node, "position", "absolute");

        var box = domGeometry.getMarginBox(node);
        domStyle.set(node, "left", left + "px");
        domStyle.set(node, "top", top + "px");
        left += box.l + box.w + CLASS_SPACING;

        // Next row is below biggest class of top row.
        // Simple.
        if(box.t + box.h > maxHeight) 
        { 
          maxHeight = box.t+ box.h; 
        }
        //Go to next row if past outter box
        if(divBox.l + divBox.w < left) 
        {
          left = 0;
          top = maxHeight + CLASS_Y_SPACING;
        }
      });
    },
    createConcept = function(concept)
    {
        console.log("createConcept called");
        var outter = dom.byId("bottomLeft");
        // The table
        var table = domConstruct.create("table", 
          {
            id: concept.name + "_table",
            class: "classTable", 
            position: "absolute"
          }, 
          outter);
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

        on(table, "click", function(evt)
          {
            console.log("clicked table: " + JSON.stringify(evt));

            if(container.current == null) { // If so header clicked, add property, else double click
              console.log("no hover over property");
            }

            var item = container.getItem(container.current.id);
            if(container.current != null) {
              table_row_id = container.current.id;
              console.log("current table row id is: " + table_row_id);
            }
            else {
              console.log("no table_row_id");
              table_row_id = null;
            }


          });

        var menu = new Menu({targetNodeIds:  [concept.name + "_table"]});
        menu.addChild(new MenuItem(
          {
            label: "Add Property",
            onClick: function()
            {
              console.log("Adding new property");
              concept.addProperty("address", "string");
            }
          }));
        menu.addChild(new MenuSeparator());
        var deleteItem = new MenuItem({
          label: "Delete attribute",
          onClick: function(evt) 
          {
            if(container.current == null) {
              console.log("Shouldnt happen, current is null");
            }
            console.log("delete: current table row id is: " + table_row_id);
          }
        });
        menu.addChild(deleteItem);

        // Set it into a map
        console.log("adding concept");
        tablesMap.add(concept.name + "_table", table);

        // Make it dragable any where inside its container div
        new Moveable(table);
    },
    setupAddClass = function(node) {
      var menu = new Menu({targetNodeIds: [ node.id ] });
      var menuItem = new MenuItem({
        label: "Create new concept",
        onClick: function(event) 
        {
          // Create a new class
          var name = "DefaultClass_" + temp_id_num;
          temp_id_num += 1;
          var concept = new Concept(name, name, null);
          createConcept(concept);

          console.log("mouse: " + event.layerX + " " + event.layerY);
          console.log("page mouse: " + event.pageX + " " + event.pageY);
/*
          var n = dom.byId(concept.name + "_table");
          var box = domGeometry.getMarginBox("topTab");
          console.log(JSON.stringify(box));
          domStyle.set(n,"position", "absolute");
          domStyle.set(n,"left", event.pageX);
          domStyle.set(n,"top",  event.pageY -  box.h);
          */
          arrangeClasses();
        }
      });
      menu.addChild(menuItem);
    }, 
    initUi = function() 
    {
        console.log("initUi called");

        var data = JSON.parse(text);

        var outter = dom.byId("bottomLeft");
        // For each object do something
        var left = 0; // For arranging the classes left to right
        // Should put all classes in a Dictionary
        baseArray.forEach(data.concepts, function(obj_concept, index)
        {
          console.log("concept " + (index+1)  + " is " + obj_concept.name);
          // Create Concept class from db file's object
          var concept = new Concept(obj_concept.id, obj_concept.name, null);
          lang.mixin(concept, obj_concept);
          // create a Container (table) for this concept
          createConcept(concept);
        });
        arrangeClasses();
        // Right click Menu for bottom Left area
        setupAddClass(outter);

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
