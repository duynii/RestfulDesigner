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
          "rfd/widget/ListItem", 
          "rfd/widget/NewResourceDialog", 
          "dijit/form/CheckBox", 
          "dijit/form/NumberTextBox", 
          "dijit/Dialog", 
          "dojo/dnd/Container", 
          "dojo/dnd/Selector", 
          "dojo/dnd/Moveable", 
          "dojo/text!RfD_documents/saves/mark1.rfd", 
          "dojo/text!rfd/widget/templates/NewProperty.html",
    "rfd/controller/controller_concepts",
    "rfd/module"
    ],
function(
            dom, domConstruct, domStyle, domGeometry, query, on, JSON, keys, lang, baseArray, baseEvent, 
            Dictionary,
            parser, Button, registry, Menu, MenuItem, MenuSeparator,
            Concept,
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            ListItem, NewResourceDialog,
            CheckBox, NumberTextBox,
            Dialog,
            Container, Selector, Moveable,
            text, newprop,
            Controller
            ) 
{
    var store = null,
    tablesMap = new Dictionary(),
    temp_id_num = 1,
    dialog  = new Dialog({title: "New Property", content: newprop}),
    controller = new Controller(),
 
    startup = function() 
    {
        console.log("startup called")
        initUi();
    },
    arrangeClasses = function()
    {
      var bottomLeft = dom.byId("bottomLeft");
      var left = 0;
      var top = 0;
      var maxHeight = 0;
      var divBox = domGeometry.getMarginBox(bottomLeft);
      // TODO, bug when adding new class, re-arrange oddly
      // use container.forEachNodeItem
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
                        var inner = null;
                        if(item instanceof Array) 
                        {
                          console.log("typeof is an array");
                          inner = "<b>belongs to: ";
                          baseArray.forEach(item, function(item)
                          {
                            inner += item + " ";
                          });  
                          inner += "<b>";
                        }
                        else 
                        {
                          inner = item.name + ": " + item.type;
                        }
                        console.log("creator called with " + item);
                        var tr = domConstruct.create("tr");
                        var td = domConstruct.create("td", { 
                          innerHTML: inner 
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
        if(concept.belongs_to.length > 0) {
          container.insertNodes([ concept.belongs_to ], false, null);
        }

        on(table, "dblclick", function(evt)
          {
            console.log("clicked table: " + JSON.stringify(evt));

            if(container.current == null) 
            { // If so header clicked, add property, else double click
              console.log("no hover over property");
              dialog.on("submit", function(e)
              {
                e.preventDefault(); // Do not submit the form to server
                var form = registry.byId("myForm");
                if(form.validate()) 
                {
                  var prop = form.getValues();
                  console.log(JSON.stringify(prop));
                  concept.addProperty(prop);
                  container.insertNodes([prop], false, null);
                  container.sync();
                }
                else {
                  alert("form has invalid data, please correct");
                }
                dialog.hide();
              });
              dialog.show();
            }
            else
            {
              var propertyId = container.current.id;
              var prop = container.getItem(propertyId).data;
              if(prop instanceof Array) {
                console.warn("Cannot delete relationship at this time");
                return;
              } // Else it must be a property
              else if(confirm("Delete the property? " + prop.name)) 
              {
                console.log("deleting the property");
                console.log("prop delete: " + JSON.stringify(prop));
                concept.deleteProperty(prop);
                //Now remove from UI
                domConstruct.destroy(propertyId);
                container.delItem(propertyId);
                container.sync();
              }
            }

          });

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

          arrangeClasses();
        }
      });
      menu.addChild(menuItem);
    }, 
    popup = null,
    onBranching = function(branch)
    {
      console.log("Branching out of: " + branch);

      var dialog = new NewResourceDialog({
          //id: "NRDialog",
          title:"Custom Dialog",
          style: "min-width: 500px; min-height: 400px",
          onFinish: function(newRes)
          {
            var br = dialog.branch.clone();
            br.addActiveResource(newRes);
            console.log("finished with new branch: " + br);
            addListItem(br);
            //Add the new branch to Controller
            dialog.destroyRecursive(false);
            //dialog.destroy();
          },
          onHide: function()
          {
            dialog.destroyRecursive(false);
          }
        });
      dialog.init(branch, controller.getConcepts());
      dialog.show();
    },
    addListItem = function(branch)
    {
      var outter = dom.byId("resourcesList");
      var li = new ListItem(
      {
        onBranchOut: onBranching
      });
      li.placeAt(outter);
      li.set("branch", branch);
      li.startup();

      return li;
    },
    setupResourceDesigner = function() 
    {
      var branch = controller.getDummyBranch();
      console.log("TESTING");
      var br = branch.branchOut( new StaticResource("public", "/"));
      console.log("TEST from public: " + br);
      var concept = controller.queryById("hospitals");
      var br = branch.branchOut( new Concept_R("hospitals", "/", concept));
      console.log("TEST from hospitals: " + br);

      var li = addListItem(branch);
      var res = new StaticResource("added", "hospitals");
      branch.addActiveResource(res);
      li.addResource(res, branch);



    },
    initUi = function() 
    {
        console.log("initUi called");

        // Get all existing concepts
        var concepts = controller.getConcepts();
        baseArray.forEach(concepts, function(concept, index)
        {
          createConcept(concept);
        });

        arrangeClasses();
        // Right click Menu for bottom Left area
        var outter = dom.byId("bottomLeft");
        setupAddClass(outter);

        setupResourceDesigner();

        //createDialog();
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
