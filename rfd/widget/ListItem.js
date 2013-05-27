//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ListItem.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "rfd/widget/TemplateWidget", "rfd/widget/StaticWidget", "rfd/widget/CollectionWidget", 
        "rfd/widget/ConceptWidget", "rfd/widget/PartialWidget", "rfd/widget/CustomWidget", 
        "dijit/Menu",  "dijit/MenuItem", "dijit/form/Button", 
        "dojo/on",  "dojo/_base/fx",  "dojo/_base/array", "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section, classStyle, TemplateWidget, StaticWidget, CollectionWidget,
        ConceptWidget, PartialWidget, CustomWidget,
        Menu, MenuItem, Button,
        on, baseFx, baseArray, lang)
    {
        return declare("ListItem",[_WidgetBase, _TemplatedMixin], 
        {
            // Some default values for our author
            // These typically map to whatever you're passing to the constructor
            name: "No item",
            url: "No URL", // The model item
            // Our template - important!
            templateString: template,
            onBranchOut: null,
            lastNode: null,
 
            // A class to be applied to the root node in our template
            baseClass: "listItem",
 
            _setBranchAttr: function(branch)
            {
                if(branch != null) 
                {
                    this.setBranch(branch);
                    this._set("branch", branch);
                }
            },
            _setUrlAttr: function(urlString) {
                // We only want to set it if it's a non-empty string
                if (urlString != "") 
                {
                    // Save it on our widget instance - note that
                    // we're using _set, to support anyone using
                    // our widget's Watch functionality, to watch values change
                    this._set("url", urlString);
             
                    // Using our avatarNode attach point, set its src value
                    //this.urlLabel.innerHTML = this.url;
                    //console.log("set Url is called");
                }
            },
            postCreate: function()
            {
                console.log("ListItem postcreate called");
                this.branch = null;
                //this.wid2Res = new Dictionary();               
                //this.dom2branch = new Dictionary();               

                //Events
                //this.onBranchOut = function(branch){};
            },
            _createWidget: function(resource, isHidden)
            {
                var cssStyle = classStyle.entry(resource.declaredClass); 
                cssStyle += (isHidden ? " hidden" : "");

                var widget = null;
                if(resource.declaredClass == "TemplatedResource") {
                    widget = new TemplateWidget({});
                }
                else if(resource.declaredClass == "StaticResource") {
                    widget = new StaticWidget({});
                }
                else if(resource.declaredClass == "Collection_R") {
                    widget = new CollectionWidget({});
                }
                else if(resource.declaredClass == "Concept_R") {
                    widget = new ConceptWidget({});
                }
                else if(resource.declaredClass == "Custom_R") {
                    widget = new CustomWidget({});
                }
                else if(resource.declaredClass == "PartialConcept_R") {
                    widget = new PartialWidget({});
                }
                else
                {
                    console.error("Unknown resource found in ListItem");
                }

                if(isHidden) {
                    domStyle.set(widget.domNode, {visibility: 'hidden'});
                }

                widget.init(resource);
                widget.placeAt(this.domNode);

                if(this.onBranchOut != null) {
                    widget.onBranchOutClick = lang.hitch(this, this._onBranchOut);
                }
                return widget;
            },
            _onBranchOut: function(resource) 
            {
                if(this.onBranchOut) {
                    var br = this.branch.branchOut(resource, null); //Create the new branch
                    //console.info("branch--->" + br);
                    this.onBranchOut(br, this.domNode);
                }
            },
            //Private func: add a resource to the branch
            // Resources in an inactive section must be added as hidden
            // Add to the end of <li>'s childs'
            // branch: pass in if allow creation of new ListItem, context of this resource
            _addResource: function(resource, isHidden, branch)
            {
                //default to not hidden
                isHidden = typeof isHidden !== 'undefined' ? isHidden : false;
                branch = typeof branch !== 'undefined' ? branch : null;

                console.log("this.branch: " + this.branch);
                console.log("adding res: " + resource.id + " branch: " + branch);

                var cssStyle = classStyle.entry(resource.declaredClass); 
                cssStyle += (isHidden ? " hidden" : "");

                var myId = this.id;
                // create a dom under self

                // Create the button widget
                var wid = this._createWidget(resource, isHidden);

            },
            // Basic dnd functionality to add resource to the tree/branch's end
            // The new branch must be the same as old branch with 'resource' added
            addResource: function(resource, branch)
            {
                this.branch = branch;
                var br = this.branch.clone();
                br.allToInactive();
                this._addResource(resource, false, br);
                //TODO this should be in the controller
                this._setUrlAttr(this.branch.toString());
            },
            setBranch: function(branch)
            {
                this.branch = branch;
                
                var active_section = branch.active;
                var inactive_section = branch.inactive;

                baseArray.forEach(inactive_section.resources, function(resource, index)
                {
                    this._addResource(resource, true);
                },
                this); // this context
                baseArray.forEach(active_section.resources, function(resource, index)
                {
                    this._addResource(resource, false, 
                                        this.branch.branchOut(resource, null));
                },
                this); // this context
                //console.log("Branch set: " + branch.toString());
                this._setUrlAttr(this.branch.toString());
            }
    
        });
    }
); // and that's it!
