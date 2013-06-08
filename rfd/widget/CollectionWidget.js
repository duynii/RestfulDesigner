define(["dojo/_base/declare", 
        //"dijit/_WidgetBase",  "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
        "rfd/widget/StaticWidget",
        "dojo/text!./templates/CollectionWidget.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/TemplatedResource", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "dijit/Menu", "dijit/MenuItem", 
        "dojo/on", "dojo/dom", "dojo/aspect", "dojo/_base/fx", "dojo/_base/array", "dojo/_base/lang",
        "dijit/popup", "dijit/TooltipDialog", "dijit/focus", 
        "dijit/form/Button", "dijit/form/Select"
        ],

    function(declare, 
        //_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, 
        StaticWidget, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        TemplatedResource, Branch, Section,
        classStyle,
        Menu, MenuItem,
        on, dom, aspect, baseFx, baseArray, lang, popup, TooltipDialog, focusUtil, 
        Button, Select)
    {

        var img = '<img width="20" alt="C" height="20" src="../rfd/widget/images/coll_red.png" />';
        return declare("CollectionWidget",[StaticWidget], 
        {
            resource: null,
            //baseClass: "templatedResource",
            templateString: template,
            init: function(coll) 
            {
                this.inherited(arguments);

                this.spanNode.innerHTML = this.resource + img;

                this.checkPaging.set('value', coll.has_paging ? 'true' : 'false');
                this.textPagingNo.set('value', coll.paging_size);

            },
            _initFilterWidgets: function()
            {
                var concept = this.resource.concept;

                baseArray.forEach(concept.properties, function(prop)
                {
                    this.filterField.options.push({value: prop.name, text: prop.name});
                    console.log("pushing: " + prop.name);
                },
                this);

                this.filterField.on("onChange", function(newValue)
                {
                    var prop = this.resource.concept.findProperty(newValue);

                    if(prop.type == 'enum') {
                        this.stringCriteria.set('value', 'equals');
                        this.stringCriteria.set('disabled', true);
                        domStyle.set(this.stringNode, 'visibility', 'visible');
                        domStyle.set(this.numberNode, 'visibility', 'hidden');
                    }
                    else if(prop.type == 'string') {
                        domStyle.set(this.stringNode, 'visibility', 'visible');
                        domStyle.set(this.numberNode, 'visibility', 'hidden');
                        this.stringCriteria.set('disabled', false);
                    }
                    else { //Must be integer or decimal
                        domStyle.set(this.stringNode, 'visibility', 'hidden');
                        domStyle.set(this.numberNode, 'visibility', 'visible');
                    }
                });
            },
            _setupEditing: function()
            {
                this.checkPaging.on("change", lang.hitch(this, function(newValue)
                {
                    console.info("checkPaging: " + newValue);
                    this.resource.has_paging = newValue;
                }));

                this.textPagingNo.on("change", lang.hitch(this, function(newValue)
                {
                    if(newValue < 1) {
                        alert("Paging value cannot be 0 or negative, 10 or more recommended");
                    }
                    else {
                        this.resource.paging_size = newValue;
                    }
                }));
            },
            postCreate: function()
            {
                this.inherited(arguments);

                //Template cant seem to handle more dijit widget inside it
                var button = new Button({label: "Add"}, this.addNode);


                this._setupEditing();

                //Populate Filter
                //this.filterField.options.push({value:'id', label: 'id key', selected: true});
                //this._initFilterWidgets();
            }
        });
    }
); // and that's it!
