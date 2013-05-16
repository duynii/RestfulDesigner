//http://dojotoolkit.org/documentation/tutorials/1.8/recipes/custom_widget/
// myApp/widget/AuthorWidget.js
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ListItem.html", 
        "dojox/collections/Dictionary",
        "dojo/dom-style", 
        "dojo/dom-geometry", 
        "dojo/dom-construct", 
        "rfd/model/Branch", 
        "rfd/model/Section", 
        "dijit/Menu", 
        "dijit/MenuItem", 
        "dojo/on", 
        "dojo/_base/fx", 
        "dojo/_base/array",
        "dojo/_base/lang"
        ],

    function(declare, _WidgetBase, _TemplatedMixin, template, 
        Dictionary,
        domStyle, domGeometry, domConstruct, 
        Branch, Section,
        Menu, MenuItem,
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
 
            // A class to be applied to the root node in our template
            baseClass: "listItem",
 
            // Colors for our background animation
            baseBackgroundColor: "#fff",
            mouseBackgroundColor: "#def",
            initCssButtonMap: function()
            {
                this.cssButtonMap.add("rfd/StaticResource", "staticResource");
                this.cssButtonMap.add("rfd/TemplatedResource", "templatedResource");
                this.cssButtonMap.add("rfd/Custom_R", "customResource");
                this.cssButtonMap.add("rfd/Concept_R", "individualResource");
                this.cssButtonMap.add("rfd/PartialConcept_R", "partialResource");
                this.cssButtonMap.add("rfd/Collection_R", "collectionResource");
            },
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
                    this.urlLabel.innerHTML = this.url;
                    //console.log("set Url is called");
                }
            },
            postCreate: function()
            {
                console.log("ListItem postcreate called");
                this.cssButtonMap = new Dictionary(),
                this.initCssButtonMap();
                this.branch = null;
                this.wid2Res = new Dictionary();               
                this.dom2branch = new Dictionary();               

                //Events
                //this.onBranchOut = function(branch){};
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

                var cssMap = this.cssButtonMap;
                var cssStyle = cssMap.entry(resource.declaredClass); 
                cssStyle += (isHidden ? " hidden" : "");

                var myId = this.id;
                //console.log("css: " + cssMap.entry(resource.declaredClass));
                // create a dom under self
                var button = domConstruct.create("button", 
                {
                    id: resource.id + '_' + myId,
                    class: cssStyle,
                    innerHTML: resource.name
                }, 
                this.domNode
                );
                var slash = domConstruct.create(
                    "button",
                    {
                        id: resource.id + '_' + myId + '_' + "slash",
                        class: "slash",
                        innerHTML: "  /  "
                    }, 
                    this.domNode
                );
                if(isHidden) {
                    slash.className += " hidden";
                }
                else {
                    // add option to branchOut
                    this.dom2branch.add(slash.id, branch);
                    /* on(slash, "click", function()
                    {
                        console.log("branching simple click:" + branch.toString());
                    }); */
                    var func = this.onBranchOut;

                    var itemBranchOut = new MenuItem(
                        {
                            label: "New Branch",
                            onClick: function(e)
                            {
                                console.log("the branch: " + branch);
                                if(func != null) {
                                    func(branch);
                                }
                            }
                        }
                    );

                    var menu = new Menu({
                        onFocus: function() {
                            console.log("This menu got focused: " + this.id);
                        }
                    });
                    menu.addChild(itemBranchOut);
                    menu.bindDomNode(slash);
                    menu.startup();
                }
                // add to the map
                this.wid2Res.add(button, resource);
                return button;
            },
            // Basic dnd functionality to add resource to the tree/branch's end
            addResource: function(resource, branch)
            {
                this._addResource(resource, false, branch);
                //TODO this should be in the controller
                this._setUrlAttr(this.branch.toString());
            },
            setBranch: function(branch)
            {
                this.branch = branch;
                
                var active_section = branch.active;
                var inactive_section = branch.inactive;

                var cssMap = this.cssButtonMap;
                var myId = this.id;

                var domNode = this.domNode;

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
