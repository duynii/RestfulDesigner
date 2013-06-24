define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/TemplateWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", "dijit/focus",
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem, focusUtil,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog)
    {
        return declare("TemplateWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(templateResource) 
            {
                this.inherited(arguments)


                //Set the existing JSON doc
                this.json_doc.set('value', this.resource.getJSONStr() );

                this.methodWidget.methods = this.resource.methods;
                this.methodWidget.allowed = [];
                this.methodWidget.init();
                this.methodWidget.hideDetails();
                this.methodWidget.setDisabled(true);
            },
            postCreate: function()
            {
                this.inherited(arguments);

                //Set up JSON doc editing
                this.json_doc.set("onChange", lang.hitch(this, function(newValue)
                {
                    var str = this.json_doc.get('value');

                    try {
                        var json = JSON.parse(str, true);
                        //Success
                        console.log("We got a JSON data: " + JSON.stringify(json));
                        //TODO this must be saved into a specific mongo database
                        this.resource.setJSON(json);
                        this.resetErrorMsg();
                    }
                    catch(err) {
                        console.log("Failed to json parse: '" + str + "'");
                        this.setErrorMsg("Failed to parse JSON data, please fix.\n" +
                            err + ": " + str);
                        return;
                    }
                }));

            },
            _checkAcceptableJSON: function(str)
            {

            }        
        });
    }
); // and that's it!
