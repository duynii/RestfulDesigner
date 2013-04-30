define([
    "dojo/dom",
    "dojox/gfx",
    "dojox/drawing/annotations/Arrow",
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
            dom, gfx, Arrow, on, keys, lang, baseArray, baseEvent, 
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

    //eg. drawArrow({start: {x:200,y:200}, end: {x : 335, y : 335}}, surface);
    var drawArrowFunc = function drawArrow(p, surface) {
        /////////////////////////////////////////////////////
        //Create a group that can be manipulated as a whole
        /////////////////////////////////////////////////////
        var group = surface.createGroup();

        var x1 = p.start.x,
            y1=p.start.y,
            x2 = p.end.x,
            y2=p.end.y;

        var len = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));

        var _defaultStroke = {
            color : "black",
            style : "solid",
            width : 1
        };

        ///////////////////////////
        //Add a line to the group
        ///////////////////////////
        group.createLine({
            x1 : 0,
            y1 : 0,
            x2 : 0+len,
            y2 : 0
        })
        .setStroke(p.stroke || _defaultStroke)
        ;

        var _arrowHeight = p.arrowHeight || 9;
        var _arrowWidth = p.arrowWidth || 6;

        /////////////////////////////////////////////////////
        //Add a custom path that is a triangle to the group
        /////////////////////////////////////////////////////
        group.createPath()
        .moveTo(len-_arrowHeight,0)
        .lineTo(len-_arrowHeight,-_arrowWidth)
        .lineTo(len,0)
        .lineTo(len-_arrowHeight,_arrowWidth)
        .lineTo(len-_arrowHeight,0)
        .setStroke(p.stroke || _defaultStroke)
        .setFill(p.stroke ? p.stroke.color : "black" )
        ;

        var _rot = Math.asin((y2-y1)/len)*180/Math.PI;
        if (x2 <= x1) {_rot = 180-_rot;}

        /////////////////////////////////////////////////////////////
        //Translate and rotate the entire group as a whole
        /////////////////////////////////////////////////////////////
        group.setTransform([
            dojox.gfx.matrix.translate(x1,y1),
            dojox.gfx.matrix.rotategAt(_rot,0,0)
        ]);
    };

    var drawFunc = function(id) 
    {
        gfx.renderer = "canvas";

        // Create a GFX surface
        // Arguments:  node, width, height
        surface = gfx.createSurface(id, 400, 400);

        // Create a circle with a set "blue" color
        surface.createCircle({ cx: 50, cy: 50, rx: 50, r: 25 }).setFill("blue");

        drawArrowFunc({start: {x: 25, y:25}, end: {x:250, y:250} }, surface);

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

        var arrow = new Arrow({
          arrowStart: {}, arrowEnd: {}
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