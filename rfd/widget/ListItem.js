//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ListItem.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", "dojo/dom-geometry", "dojo/dom-construct", 
        "rfd/model/Branch", "rfd/model/Section", "rfd/module/ClassStyle", 
        "rfd/widget/TemplateWidget", "rfd/widget/StaticWidget", 
        "dijit/Menu",  "dijit/MenuItem", "dijit/form/Button", 
        "dojo/on",  "dojo/_base/fx",  "dojo/_base/array", "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section, classStyle, TemplateWidget, StaticWidget,
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

                if(resource.declaredClass == "TemplatedResource")
                {
                    var widget = new TemplateWidget({});
                    if(isHidden) {
                        widget.className += " hidden"
                    }

                    widget.init(resource, this.branch);
                    widget.placeAt(this.domNode);
                    return widget;
                }
                else if(resource.declaredClass == "StaticResource")
                {
                    var widget = new StaticWidget({});
                    if(isHidden) {
                        widget.className += " hidden"
                    }

                    widget.init(resource, this.branch);
                    widget.placeAt(this.domNode);
                    return widget;
                }
                else
                {
                    var button = domConstruct.create("button", 
                    {
                        class: cssStyle,
                        innerHTML: resource.name
                    }, 
                    this.domNode);
                    return button;
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

                /*
                var slash = domConstruct.create("button",
                    {
                        id: resource.id + '_' + myId + '_' + "slash",
                        class: "addButton",
                        innerHTML: "/"
                    }, 
                    this.domNode
                );
                */
/*
                var slash = new Button({
                    label: '/'
                });
                slash.className += " floatLeft";
                slash.placeAt(this.domNode, "last");
                this.lastNode = slash.domNode;

                var myDom = this.domNode;
                if(isHidden) {
                    slash.className += " hidden";
                }
                else {
                    // add option to branchOut
                    //this.dom2branch.add(slash.id, branch);

                    slash.on("click", function()
                        {
                            console.log("branching simple click:" + branch.toString());
                            console.log("the branch: " + branch);
                            if(func != null) {
                                func(branch, myDom);
                            }
                        }
                    );

                    var func = this.onBranchOut;

                    this.own(
                        on(slash, "click", function()
                        {
                            console.log("branching simple click:" + branch.toString());
                            console.log("the branch: " + branch);
                            if(func != null) {
                                func(branch, myDom);
                            }
                        }) 
                    );
                    var itemBranchOut = new MenuItem(
                        {
                            label: "New Branch",
                            onClick: function(e)
                            {
                                console.log("the branch: " + branch);
                                if(func != null) {
                                    func(branch, myDom);
                                }
                            }
                        }
                    );

                    var menu = new Menu({});
                    menu.addChild(itemBranchOut);
                    menu.bindDomNode(slash.domNode);
                    menu.startup();
                }
*/
                // add to the map
                //this.wid2Res.add(button, resource);
                //return button;
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
