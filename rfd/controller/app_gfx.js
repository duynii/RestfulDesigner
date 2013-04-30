define([
    "dojo/dom",
    "dojox/gfx",
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
    "dojox/image/LightboxNano",
    "dojox/data/FlickrRestStore",
    "rfd/module"
    ],
function(
            dom, gfx, on, keys, lang, baseArray, baseEvent, 
            parser, Button, registry, query, 
            Resource, StaticResource, TemplatedResource, ConceptResource, Representation,
            Concept_R, Collection_R,
            CheckBox, NumberTextBox,
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
        lightbox = new LightboxNano({});

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

    var drawFunc = function(id) 
    {
        gfx.renderer = "canvas";

        // Create a GFX surface
        // Arguments:  node, width, height
        surface = gfx.createSurface(id, 400, 400);

        // Create a circle with a set "blue" color
        surface.createCircle({ cx: 50, cy: 50, rx: 50, r: 25 }).setFill("blue");

        // Crate a circle with a set hex color
        surface.createCircle({ cx: 300, cy: 300, rx: 50, r: 25 }).setFill("#f00");

        // Create a circle with a linear gradient
        surface.createRect({x: 180, y: 40, width: 200, height: 100 }).
        setFill({ type:"linear",
          x1: 0,
          y1: 0,   //x: 0=>0, consistent gradient horizontally
          x2: 0,   //y: 0=>420, changing gradient vertically
          y2: 420,
          colors: [
            { offset: 0,   color: "#003b80" },
            { offset: 0.5, color: "#0072e5" },
            { offset: 1,   color: "#4ea1fc" }
          ]
        });

        // Create a circle with a radial gradient
        surface.createEllipse({
          cx: 120,
          cy: 260,
          rx: 100,
          ry: 100
        }).setFill({
          type: "radial",
          cx: 150,
          cy: 200,
          colors: [
            { offset: 0,   color: "#4ea1fc" },
            { offset: 0.5, color: "#0072e5" },
            { offset: 1,   color: "#003b80" }
          ]
        });
    };
    return {
        init: function() {
            // proceed directly with startup
            startup();
        },
        draw: drawFunc
    };
});