define([
    "dojox/collections/Dictionary"
    ],
function(Dictionary) 
{
    var cssButtonMap = new Dictionary(),
    inited = false,
    init = function() 
    {
      // check init
      if(inited) {
        return;
      }
      cssButtonMap.add("StaticResource", "staticResource");
      cssButtonMap.add("TemplatedResource", "templatedResource");
      cssButtonMap.add("Custom_R", "customResource");
      cssButtonMap.add("Concept_R", "individualResource");
      cssButtonMap.add("PartialConcept_R", "partialResource");
      cssButtonMap.add("Collection_R", "collectionResource");
    };
    
    return {
      entry: function(className) {
        init();
        return cssButtonMap.entry(className);
      }
    };
});