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
          "dijit/Menu", 
          "dijit/MenuItem", 
          "dijit/PopupMenuItem", 
          "dijit/CheckedMenuItem", 
          "dijit/MenuSeparator", 
    "dojox/image/LightboxNano",
    "rfd/module"
    ],
function(
            dom, on, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
            Menu, MenuItem, PopupMenuItem, CheckedMenuItem, MenuSeparator,
            LightboxNano
            ) 
{
    var store = null,
 
    startup = function() 
    {
        console.log("startup called")
        initUi();
    },
 
    initUi = function() 
    {
        // summary:
        //      create and setup the UI with layout and widgets
        // create a single Lightbox instnace which will get reused

        console.log("initUi called");
 
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

    var createMenuFunc = function(contextOfIds, selector_str) {
        var pMenu;
        // Ids array, nodes to attach menu to - right click
        var menuSelection = { targetNodeIds: contextOfIds };
        // If a selector string is specified, we want to select sub-nodes of the contextOfIds
        if(selector_str != null) { menuSelection.selector = selector_str; }
        pMenu = new Menu(menuSelection);

        console.log("Menu add to '" + contextOfIds);
        pMenu.addChild(new MenuItem({
            label: "Simple menu item"
        }));
        pMenu.addChild(new MenuItem({
            label: "Disabled menu item",
            disabled: true
        }));
        pMenu.addChild(new MenuItem({
            label: "Menu Item With an icon",
            iconClass: "dijitEditorIcon dijitEditorIconCut",
            onClick: function(){alert('i was clicked')}
        }));
        pMenu.addChild(new CheckedMenuItem({
            label: "checkable menu item"
        }));
        pMenu.addChild(new MenuSeparator());

        var pSubMenu = new Menu();
        pSubMenu.addChild(new MenuItem({
            label: "Submenu item"
        }));
        pSubMenu.addChild(new MenuItem({
            label: "Submenu item"
        }));
        pMenu.addChild(new PopupMenuItem({
            label: "Submenu",
            popup: pSubMenu
        }));

        pMenu.startup();
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        },
        createMenu: createMenuFunc
    };
});
