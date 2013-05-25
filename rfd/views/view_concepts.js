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
    "rfd/widget/ResourceCatalogue", "rfd/widget/ResourceDesigner", 
    "dijit/form/CheckBox", "dijit/form/NumberTextBox", "dijit/Dialog", 
    "dojo/dnd/Container", "dojo/dnd/Selector", "rfd/ExtendedSource", "dojo/dnd/Moveable", 
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
            ListItem, NewResourceDialog, Entity, ResourceCatalogue, ResourceDesigner,
            CheckBox, NumberTextBox, Dialog,
            Container, Selector, ExtendedSource, Moveable,
            text, newprop,
            controller
            ) 
{
    var store = null,
    temp_id_num = 1,
    //controller = new Controller(), Now a global module
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
    createConceptDisplay = function(concept)
    {
      var e = new Entity({});
      e.placeAt("bottomLeft");
      e.set("concepts", controller.getConcepts());
      e.set("concept", concept);
    },
    setupAddClass = function(id) 
    {
      var menu = new Menu({targetNodeIds: [ id ] });
      var menuItem = new MenuItem({
        label: "Create new concept",
        onClick: lang.hitch(this, function(event) 
        {
          // Create a new class
          var name = "Class_" + temp_id_num;
          temp_id_num += 1;
          var concept = new Concept(name, name, null);
          controller.getConcepts().push(concept);
          createConceptDisplay(concept);

          console.log("mouse: " + event.layerX + " " + event.layerY);
          console.log("page mouse: " + event.pageX + " " + event.pageY);

          arrangeClasses();
        })
      });
      menu.addChild(menuItem);
    }, 
    createResourceDesigner = function()
    {
      resDesigner = new ResourceDesigner();
      resDesigner.placeAt("topLeft");

    },
    //Populate based on context of selected branch on the Designer
    populateCatalogue = function(widget)
    {
      //TODO      
    },
    createResourcesCatalogue = function()
    {
      console.log("rightTree called");

      resCatalogue = new ResourceCatalogue();
      resCatalogue.placeAt("topRight");

      resCatalogue.addResource( new StaticResource("static", "/") );
      resCatalogue.addResource( new TemplatedResource("JSON template", "/") );
      resCatalogue.addResource( new Custom_R("Custom Method", "/") );
      baseArray.forEach(controller.getConcepts(), function(concept, index)
        {
          console.log("Looping through: " + concept.id);
          var coll_R = new Collection_R(concept.id, "/", concept);
          var concept_R = new Concept_R(concept.id, "/", concept);
          resCatalogue.addResource(coll_R);
          resCatalogue.addResource(concept_R);
        }, 
        this
      );
    },
    setupEntityDesigner = function()
    {
        // Get all existing concepts
        baseArray.forEach(controller.getConcepts(), function(concept, index)
        {
          createConceptDisplay(concept);
        },
        this);

        arrangeClasses();
    },
    initUi = function() 
    {
        console.log("initUi called");

        setupEntityDesigner();

        // Right click Menu for bottom Left area
        setupAddClass("bottomLeft");
        createResourceDesigner();
        createResourcesCatalogue();
    };
    return {
        init: function() 
        {
          controller.init(); //supporting controller
            // proceed directly with startup
            startup();
        }
    };
});
