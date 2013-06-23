

define([
    "dojox/collections/Dictionary",
    "dojo/cookie", "dojo/_base/lang"
    ],
function(Dictionary, cookie, lang) 
{
  //template for numbered cookie name
  var COOKIE_NAME = "RfD2013_";
  var COOKIE_NO = "RfD2013_count";
  var NO_OF_COOKIE = 10;
  var CHAR_PER_COOKIE = 1000;
  var EXPIRE_DAYS = 365;

  var docCookies = 
  {
    getItem: function () 
    {
      var cookieNo = cookie(COOKIE_NO);
      console.log("No cookie loaded: " + cookieNo);

      var value = "";
      for(var i=0; i<cookieNo; i++) {
        value += cookie(COOKIE_NAME + (i+1));
      } 

      return value;
    },
    setItem: function (sValue, options) 
    {
      var cookies = [];
      for(var i=0; i<NO_OF_COOKIE; i++) {
        cookies.push("");
      }

      var max_chars = (NO_OF_COOKIE*CHAR_PER_COOKIE);
      if(sValue.length > max_chars) {
        alert("Unable to save as length is too long.\n" +
          "Please select 'Export as XML' to save manually");
        return false;
      }

      // Breaking the cookie into cookies, each holding CHAR_PER_COOKIE length at max
      var curLength = 1;
      var curCookieNo = 0;
      while(curLength < sValue.length)
      {
        curCookieNo++; //How many cookie used
        cookies[curCookieNo-1] = sValue.substr(curLength-1, CHAR_PER_COOKIE);
        curLength += cookies[curCookieNo-1].length;
      } 

      //Now set/override cookie 
      var opts = {expires: EXPIRE_DAYS};
      lang.mixin(opts, options);
      cookie(COOKIE_NO, curCookieNo, opts);
      for(var j=0; j<NO_OF_COOKIE; j++) {
        cookie(COOKIE_NAME + (j+1), cookies[j], opts);
      }

      console.log("No cookie saved: " + curCookieNo);
    },
    //Clear all cookies
    removeItem: function () 
    {
      for(var j=0; j<NO_OF_COOKIE; j++) {
        cookie(COOKIE_NAME + (j+1), null, {expires: -1});
      }
    }
  };

  return docCookies;
});

