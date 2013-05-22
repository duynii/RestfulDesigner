CLASS_SPACING = 40;
CLASS_Y_SPACING = 10;

define([
    "dojo/dom",
    "dojo/dom-construct", "dojo/dom-style", "dojo/dom-geometry",
    "dojo/query", "dojo/on", "dojo/aspect", "dojo/json", "dojo/keys",
    "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", 
    "dojox/collections/Dictionary",
    "dojo/parser", 
    "dijit/form/Button", "dijit/registry", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
    "rfd/Concept", "rfd/Resource", "rfd/StaticResource", "rfd/TemplatedResource",
    "rfd/ConceptResource", "rfd/Representation", "rfd/Concept_R", "rfd/Collection_R", 
    "rfd/module/ClassStyle",
    "rfd/widget/ListItem", 
    "rfd/widget/NewResourceDialog", 
    "rfd/widget/Entity", 
    "dijit/form/CheckBox", "dijit/form/NumberTextBox", "dijit/Dialog", 
    "dojo/dnd/Container", "dojo/dnd/Selector", "dojo/dnd/Source", "dojo/dnd/Moveable", 
          "dojo/text!RfD_documents/saves/mark1.rfd", 
          "dojo/text!rfd/widget/templates/NewProperty.html",
    "rfd/controller/controller_concepts",
    "rfd/module"
    ],
function(
            dom, domConstruct, domStyle, domGeometry, query, on, aspect, 
            JSON, keys, lang, baseArray, baseEvent, 
            Dictionary,
            parser, Button, registry, Menu, MenuItem, MenuSeparator,
            Concept,
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R, classStyle,
            ListItem, NewResourceDialog, Entity,
            CheckBox, NumberTextBox, Dialog,
            Container, Selector, Source, Moveable,
            text, newprop,
            Controller
            ) 
{
    var store = null,
    tablesMap = new Dictionary(),
    temp_id_num = 1,
    dialog  = new Dialog({title: "New Property", content: newprop}),
    controller = new Controller(),
    resCatalogue = null, //Widget of the catalogue, to be changed to many?
    resDesigner = null, // The one container for Resource Designer
    newBranchDom = null,
 
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
      query("table", bottomLeft).forEach(function(node)
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
    onBranching = function(branch, domNode)
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
            addListItem(br, resDesigner, domNode);
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
    addListItem = function(branch, res_designer, refBranchNode)
    {
      // If a ref node is specified, create the new branch under it
      //  for branching out - onBranchOut

      // Defaults to 'before' the newBranchDom
      is_before = typeof refBranchNode !== 'undefined' ? false : true;
      refBranchNode = typeof refBranchNode !== 'undefined' ? refBranchNode : newBranchDom;

      res_designer.insertNodes(true, //new selected node 
        [ branch ], is_before, refBranchNode);

      return  registry.getEnclosingWidget(res_designer.getSelected());
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

      var li = addListItem(branch, resDesigner);
      var res = new StaticResource("added", "hospitals");
      branch.addActiveResource(res);
      li.addResource(res, branch);
    },
    // This will only be called upon if the Designer is initially
    // TODO, is this correct?
    // Give a new branch to be added to Designer
    resourcesListCreator = function(branch, hint) 
    {
      //console.log("Designer creator: hint - " + hint + ", branch - " + branch);
      resDesigner.selectNone();
      var li = new ListItem(
      {
        onBranchOut: onBranching
      });
      li.placeAt("resourcesList");
      li.set("branch", branch);
      li.startup();

      li.watch("className", function(attr, oldVal, newVal){
        console.log("class old: " + oldVal + "; new: " + newVal);
      });
      li.watch("class", function(attr, oldVal, newVal){
        console.log("class old: " + oldVal + "; new: " + newVal);
      });

      return {node: li.domNode, data: branch, type: ["branch"]};
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

      if(resDesigner.current == null) // Add the first ListItem for first branch
      {

        var br = new Branch();
        br.addActiveResource(resource);
        addListItem(br, resDesigner);
        resDesigner.sync();

        //TODO, may not want to do this
        //source.getSelectedNodes().orphan();
        //source.delItem(nodeId);
        ////Dont uncomment, compile error: source.sync():
      }
      else 
      {
        console.log("current: " + resDesigner.current);
        console.log("no: " + resDesigner.size());

        var li = registry.getEnclosingWidget(resDesigner.current);
        console.log("li type: " + li.declaredClass);
        li.branch.addActiveResource(resource);
        li.addResource(resource, li.branch);

        //TODO, may not want to do this
        //source.getSelectedNodes().orphan();
        //source.delItem(nodeId);
      }
    },
    createResourceDesigner = function()
    {
        newBranchDom = dom.byId("dropNewBranch");

      resDesigner = new Source("resourcesList", {
        id: "resourcesContainer",
        singular: true,  // Single item selection
        isSource: false, // Only acts as dnd target
        accept: ["resource"], // Accept resource objects only
        type: ["concepts"],
        /*
        onSelectStart: lang.hitch(this, function(e)
        {
          console.log("On Selected item: " + e.target);
          console.log("On Selected item: " + e.target.id);
        }),
        */
        onDropExternal: onResourcesListDrop,
        creator: resourcesListCreator
      });

      /*
      aspect.after(resDesigner, "onSelectStart", function(e){
          console.log("On Selected item: " + e.target);
      }, true);

      resDesigner.on("onselectstart", function(e)
      {
          console.log("On Selected item: " + e.target);
          console.log("On Selected item: " + e.target.id);
      });
      */

      resDesigner.size = function() {
        return resDesigner.getAllNodes().length;
      };

      // return the selected node, it can only be one in this app
      resDesigner.getSelected = function()
      {
        
         var nodes = resDesigner.getSelectedNodes();

         if(nodes.length == 0) {
          console.error("Cannot get selected ListItem node");
         }

         return nodes[0];
      };
      resDesigner.selectedWidget = function()
      {
        var sel = this.getSelected();
        if(sel == null ) {
          return null;
        }

        return registry.getEnclosingWidget(sel);
      };
    },
    catalogueListCreator = function(item, hint)
    {
      //console.log("Catalogue creator: hint - " + hint + ", item - " + item);
      //console.log("catalogue creator's item: " + item.declaredClass);

      var cssStyle = classStyle.entry(item.declaredClass);
      //console.log("css: " + item.declaredClass + " to " + cssStyle);
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
    //Populate based on context of selected branch on the Designer
    populateCatalogue = function(widget)
    {
      //TODO      
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
      var concepts = controller.getConcepts();
      baseArray.forEach(concepts, 
        function(concept, index)
        {
          console.log("Looping through: " + concept.id);
          var coll_R = new Collection_R(concept.id, "/", concept);
          var concept_R = new Concept_R(concept.id, "/", concept);
          available.push(coll_R);
          available.push(concept_R);
        }, 
        this
      );
      resCatalogue.insertNodes(false, available, false, null);
    },
    setupEntityDesigner = function()
    {
        // Get all existing concepts
        var concepts = controller.getConcepts();
        baseArray.forEach(concepts, function(concept, index)
        {
          //createConcept(concept);

          var e = new Entity({});
          e.placeAt("bottomLeft");
          e.set("concepts", concepts);
          e.set("concept", concept);
        },
        this);

        arrangeClasses();
    },
    initUi = function() 
    {
        console.log("initUi called");

        setupEntityDesigner();

        // Right click Menu for bottom Left area
        var outter = dom.byId("bottomLeft");
        setupAddClass(outter);

        createResourceDesigner();
        //setupResourceDesigner();
        createResourcesCatalogue();

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
