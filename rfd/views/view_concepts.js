CLASS_SPACING = 40;
CLASS_Y_SPACING = 10;

var COOKIE_NAME = "RfD_cookie_28_05_2013";

define([
    "dojo/dom", "dojo/topic",
    "dojo/dom-construct", "dojo/dom-style", "dojo/dom-geometry",
    "dojo/query", "dojo/on", "dojo/aspect", "dojo/json", "dojo/keys",
    "dojo/_base/lang", "dojo/_base/array", "dojo/_base/event", "dojo/_base/window", "dojo/_base/fx",
    "dojox/collections/Dictionary", "dojo/text!../widget/templates/DesignerHelp.html",
    "dojo/parser", "dojo/cookie",
    "dijit/form/Button", "dijit/registry", "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
    "dijit/MenuBar", "dijit/PopupMenuBarItem", "dijit/DropDownMenu", "dijit/form/DropDownButton", 
    "dijit/MenuBarItem", "dijit/form/Textarea", "dijit/layout/ContentPane", "dijit/TooltipDialog",
    "rfd/Concept", "rfd/Resource", "rfd/StaticResource", "rfd/TemplatedResource",
    "rfd/ConceptResource", "rfd/Representation", "rfd/Concept_R", "rfd/Collection_R", "rfd/PartialConcept_R",
    "rfd/module/ClassStyle", "rfd/model/Branch",
    "rfd/widget/ListItem", 
    "rfd/widget/NewResourceDialog", 
    "rfd/widget/Entity",
    "rfd/widget/ResourceCatalogue", "rfd/widget/ResourceDesigner", 
    "dijit/form/CheckBox", "dijit/form/NumberTextBox", "dijit/Dialog", 
    "dojo/dnd/Container", "dojo/dnd/Selector", "rfd/ExtendedSource", "dojo/dnd/Moveable", 
          "dojo/text!RfD_documents/saves/mark1.rfd", 
          "dojo/text!rfd/widget/templates/NewProperty.html",
    "rfd/module/LongCookie", "rfd/controller/controller_concepts",
    "rfd/module"
    ],
function(
            dom, topic, domConstruct, domStyle, domGeometry, query, on, aspect, 
            JSON, keys, lang, baseArray, baseEvent, win, baseFx,
            Dictionary, designerHelpContent,
            parser, cookie, Button, registry, Menu, MenuItem, MenuSeparator,
            MenuBar, PopupMenuBarItem, DropDownMenu, DropDownButton, 
            MenuBarItem, Textarea, ContentPane, TooltipDialog,
            Concept,
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R, PartialConcept_R, 
            classStyle, Branch,
            ListItem, NewResourceDialog, Entity, ResourceCatalogue, ResourceDesigner,
            CheckBox, NumberTextBox, Dialog,
            Container, Selector, ExtendedSource, Moveable,
            text, newprop,
            LongCookie, controller
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
          //console.log("mouse: " + event.layerX + " " + event.layerY);
          //console.log("page mouse: " + event.pageX + " " + event.pageY);

          // Create a new class
          var name = "Class_" + temp_id_num;
          temp_id_num += 1;
          var concept = new Concept(name, name, null);
          controller.addConcept(concept);
          createConceptDisplay(concept);
          arrangeClasses();
          //_saveToCookie();
        })
      });
      menu.addChild(menuItem);
    }, 
    createResourceDesigner = function()
    {
      resDesigner = new ResourceDesigner();
      resDesigner.placeAt("topLeft");
      // Hook event to allow disallow branching
      resDesigner.onBranchingOut = lang.hitch(controller, controller.onBranchingOut);
      // When a drop to add to a branch
      resDesigner.onBranchDrop = lang.hitch(controller, controller.onBranchDrop);

      resDesigner.onNewSelectedBranch = lang.hitch(this, _onBranchSelect);

      // Load any existing branches - loaded from saved cookie
      resDesigner.setBranches(controller.getAllBranches());
    },
    _onBranchSelect = function(branch)
    {
      var json = JSON.stringify(branch, null, "  ");
      registry.byId("outputNode").set('value', json);
      //dom.byId("outputNode").innerHTML = json;
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

      resCatalogue.addResource( new StaticResource("inactive", "/") );
      resCatalogue.addResource( new TemplatedResource("Static", "/", 
                                          {title: "my title", data: "my document"}, "empty") );
      resCatalogue.addResource( new Custom_R("param", "/") );
      resCatalogue.addResource( new PartialConcept_R("Partial", "/", null) );
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
    _initToolbar = function()
    {
      var menubar = new MenuBar({});

      menubar.addChild(new MenuBarItem({
        label: 'Load',
        iconClass: "dijitEditorIconOpen",
        onClick: lang.hitch(this, _displayLoadedXML)
      }));
      menubar.addChild(new MenuBarItem({
        label: 'Save',
        iconClass: "dijitEditorIconOpen",
        onClick: lang.hitch(this, _saveToCookie)
      }));
      menubar.addChild(new MenuBarItem({
        label: 'Display as XML',
        onClick: lang.hitch(this, _showExportXML)
      }));

      menubar.placeAt("toolbar");
      menubar.startup();
    },
    //TO DO it cannot save long cookie (over 2200 chars, need custom module)
    _saveToCookie = function () 
    {
      var value = controller.getJSONString();
      console.info("Cookie length: " + value.length);
      //cookie(COOKIE_NAME, value, {expires: 60, path: "/"});
      LongCookie.setItem(value, {});


      console.info("Saving program states");
      //_displayExportXML(value);
    },
    _loadFromCookie = function () {
      var value = LongCookie.getItem();

      return value;
    },
    _displayLoadedXML = function()
    {
      var data = _loadFromCookie();
      // parses and re stringify for better formating with new lines
      var formatted = JSON.stringify(JSON.parse(data), null, "  ");
      _displayExportXML(formatted);
    },
    _showExportXML =  function()
    {
      var formattedStr = JSON.stringify(controller, null, "  ");
      _displayExportXML(formattedStr);
    },
    _displayExportXML = function(jsonStr) 
    {
      // Use ContentPane for scrolling, and theme
      var cont = new ContentPane({ 
          style: "min-width: 400px; min-height: 500px; padding: 0; overflow: auto",
          content: new Textarea({
            value: jsonStr
          })
      });
      var dialog = new Dialog({
        title: "Exporting XML",
        content: cont
      });

      dialog.show();
    },
    endLoading = function() 
    {
      // summary: 
      //    Indicate not-loading state in the UI

      baseFx.fadeOut({
        node: dom.byId("loadingOverlay"),
        onEnd: function(node){
          domStyle.set(node, "display", "none");
        }
      }).play();
    },

    startLoading = function(targetNode) 
    {
      // summary: 
      //    Indicate a loading state in the UI

      var overlayNode = dom.byId("loadingOverlay");
      if("none" == domStyle.get(overlayNode, "display")) 
      {
        var coords = domGeometry.getMarginBox(targetNode || win.body());
        domGeometry.setMarginBox(overlayNode, coords);

        // N.B. this implementation doesn't account for complexities
        // of positioning the overlay when the target node is inside a 
        // position:absolute container
        domStyle.set(dom.byId("loadingOverlay"), {
          display: "block",
          opacity: 1
        });
      }
    },
    _setHelpButtons = function(id, content)
    {
      new DropDownButton({
        label: "Help",
        dropDown: new TooltipDialog({
          content: content
        })
      }, id, content);

    },
    initUi = function() 
    {

        console.log("initUi called");
        //var save = _loadFromCookie();
        //_displayExportXML(save);
        _initToolbar();
        setupEntityDesigner();

        // Right click Menu for bottom Left area
        setupAddClass("bottomLeft");
        createResourceDesigner();
        createResourcesCatalogue();

        _setHelpButtons("designerHelp", designerHelpContent);
/*
        topic.subscribe("save_update", lang.hitch(this, function(branch, resource)
        {
          _saveToCookie();
        }));
*/
      endLoading();
    };
    return {
        init: function() 
        {
          startLoading();
          var savedState = _loadFromCookie();

          var isLoad = false;
          if( typeof savedState !== 'undefined' && savedState != null && savedState.length > 0) {
            isLoad = confirm("Saved data found, proceed to restore previous states?");
          }
          if(isLoad)
          {

            var data = JSON.parse(savedState);
            controller.init(data.concepts, data.branches); //supporting controller
          }
          else {
            controller.init();
          }
            // proceed directly with startup
            startup();
        }
    };
});
