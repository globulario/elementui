/*
 * (C) Copyright 2016 Mycelius SA (http://mycelius.com/).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Authors: Dave Courtois
 * Contributors:
 */

/**
 * @fileOverview Various helper functions.
 * @author Dave Courtois
 * @version 1.0.0
 */
window.URL = window.URL || window.webkitURL; // Take care of vendor prefixes.

var mousePositionX = null;
var mousePositionY = null;
export function onMouseUpdate(e) {
  mousePositionX = e.pageX;
  mousePositionY = e.pageY;
}
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
export function getMouseX() {
  return mousePositionX;
}
export function getMouseY() {
  return mousePositionY;
}
export function fireResize() {
  if (document.createEvent) {
    // W3C
    var ev = document.createEvent('Event');
    ev.initEvent('resize', true, true);
    window.dispatchEvent(ev);
  } else {
    // IE
    element = document.documentElement;
    var event = document.createEventObject();
    element.fireEvent("onresize", event);
  }
}
;

Array.prototype.removeDuplicates = function () {
  var temp = new Array();

  label: for (var i = 0; i < this.length; i++) {
    for (var j = 0; j < temp.length; j++) {
      //check duplicates
      if (temp[j] == this[i]) //skip if already present 
        continue label;
    }

    temp[temp.length] = this[i];
  }

  return temp;
};
/* finds the intersection of 
 * two arrays in a simple fashion.  
 *
 * PARAMS
 *  a - first array, must already be sorted
 *  b - second array, must already be sorted
 *
 * NOTES
 *
 *  Should have O(n) operations, where n is 
 *    n = MIN(a.length(), b.length())
 */


export function intersectSafe(a, b) {
  var ai = 0,
      bi = 0;
  var result = [];

  while (ai < a.length && bi < b.length) {
    if (a[ai] < b[bi]) {
      ai++;
    } else if (a[ai] > b[bi]) {
      bi++;
    } else
      /* they're equal */
      {
        result.push(a[ai]);
        ai++;
        bi++;
      }
  }

  return result;
} ////////////////////////////////////////////////////////////////////////////
//  Validation functions helpers
////////////////////////////////////////////////////////////////////////////

/**
 * Test if a given input is a numeric value.
 * @param input Any value
 * @returns {boolean} True if the value is numeric.
 */

export function isNumeric(input) {
  var RE = /^-{0,1}\d*\.{0,1}\d+$/;
  return RE.test(input);
}
/**
 * Test if a given input is a well formed email address.
 * @param input Any value
 * @returns {boolean} True if the value is a well formed email address.
 */

export function isEmail(email) {
  return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
}
/**
 * Test if a given input is a string.
 * @param input Any value
 * @returns {boolean} True if the value is a string.
 */

export function isString(o) {
  return Object.prototype.toString.call(o) === '[object String]';
}
/**
 * Test if a given string is an object reference.
 */

export function isObjectReference(ref) {
  return /^[a-zA-Z_$][a-zA-Z_$0-9]*(\.[a-zA-Z_$][a-zA-Z_$0-9]*)+(\.[a-zA-Z_$][a-zA-Z_$0-9]*)*\%[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(ref);
}
/**
 * Test if a given input is a json string.
 * @param input Any value
 * @returns {boolean} True if the value is a JSON string.
 */

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}
/**
 * Test if a given input is an object.
 * @param input Any value
 * @returns {boolean} True if the value is an object.
 */

export function isObject(val) {
  if (val === null) {
    return false;
  }

  return typeof val === 'function' || typeof val === 'object';
}
/**
 * Test if a given input is an integer.
 * @param input Any value
 * @returns {boolean} True if the value is an integer.
 */

export function isInt(value) {
  return !isNaN(value) && function (x) {
    return (x | 0) === x;
  }(parseFloat(value));
}
/**
 * Test if a given input is a boolean value.
 * @param input Any value
 * @returns {boolean} True if the value is a boolean.
 */

export function isBoolean(value) {
  return typeof value === 'boolean';
}
/**
 * Test if a given input is an array.
 * @param input Any value
 * @returns {boolean} True if the value is an array.
 */

export function isArray(o) {
  // make sure an array has a class attribute of [object Array]
  var check_class = Object.prototype.toString.call([]);

  if (check_class === '[object Array]') {
    // test passed, now check
    return Object.prototype.toString.call(o) === '[object Array]';
  } else {
    // may want to change return value to something more desirable
    return -1;
  }
}
export function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
export function parseFunction(code) {
  // The function parameters
  var parameters = code.substring(code.indexOf("(") + 1, code.indexOf("{"));
  parameters = parameters.substring(0, parameters.indexOf(")"));
  parameters = parameters.split(","); // The function src

  var src = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
  var constructor = "Function(";

  for (var i = 0; i < parameters.length; i++) {
    constructor += '"' + parameters[i] + '"';

    if (i < parameters.length - 1) {
      constructor += ",";
    }
  }

  constructor += ", src)";
  return eval(constructor);
}
export function objectEquals(x, y) {
  'use strict';

  if (x === null || x === undefined || y === null || y === undefined) {
    return x === y;
  } // after this just checking type of one would be enough


  if (x.constructor !== y.constructor) {
    return false;
  } // if they are functions, they should exactly refer to same one (because of closures)


  if (x instanceof Function) {
    return x === y;
  } // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)


  if (x instanceof RegExp) {
    return x === y;
  }

  if (x === y || x.valueOf() === y.valueOf()) {
    return true;
  }

  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  } // if they are dates, they must had equal valueOf


  if (x instanceof Date) {
    return false;
  } // if they are strictly equal, they both need to be object at least


  if (!(x instanceof Object)) {
    return false;
  }

  if (!(y instanceof Object)) {
    return false;
  } // recursive object equality check


  var p = Object.keys(x);
  return Object.keys(y).every(function (i) {
    return p.indexOf(i) !== -1;
  }) && p.every(function (i) {
    return objectEquals(x[i], y[i]);
  });
} //////////////////////////////////// XML/SQL type ////////////////////////////////////

/**
 * Dertermine if the value is a base type.
 */

export function isXsBaseType(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  return isXsId(fieldType) || isXsRef(fieldType) || isXsInt(fieldType) || isXsString(fieldType) || isXsBinary(fieldType) || isXsNumeric(fieldType) || isXsBoolean(fieldType) || isXsDate(fieldType) || isXsTime(fieldType) || isXsMoney(fieldType);
}
/**
 * Helper function use to dertermine if a XS type must be considere integer.
 */

export function isXsInt(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("byte") || fieldType.endsWith("long") || fieldType.endsWith("int") || fieldType.endsWith("integer") || fieldType.endsWith("short") // XML
  || fieldType.endsWith("unsignedInt") || fieldType.endsWith("unsignedBtype") || fieldType.endsWith("unsignedShort") || fieldType.endsWith("unsignedLong") // XML
  || fieldType.endsWith("negativeInteger") || fieldType.endsWith("nonNegativeInteger") || fieldType.endsWith("nonPositiveInteger") || fieldType.endsWith("positiveInteger") // XML
  || fieldType.endsWith("tinyint") || fieldType.endsWith("smallint") || fieldType.endsWith("bigint") // SQL
  || fieldType.endsWith("time") || fieldType.endsWith("Time") // XML
  || fieldType.endsWith("timestampNumeric") || fieldType.endsWith("timestamp")) // SQL
    {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere String.
 */

export function isXsString(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("string") || fieldType.endsWith("Name") || fieldType.endsWith("QName") || fieldType.endsWith("NMTOKEN") // XML
  || fieldType.endsWith("gDay") || fieldType.endsWith("gMonth") || fieldType.endsWith("gMonthDay") || fieldType.endsWith("gYear") // XML
  || fieldType.endsWith("gYearMonth") || fieldType.endsWith("token") || fieldType.endsWith("normalizedString") || fieldType.endsWith("hexBinary") // XML
  || fieldType.endsWith("language") || fieldType.endsWith("NMTOKENS") || fieldType.endsWith("NOTATION") || fieldType.endsWith("token") // XML
  || fieldType.endsWith("char") || fieldType.endsWith("nchar") || fieldType.endsWith("varchar") // SQL
  || fieldType.endsWith("nvarchar") || fieldType.endsWith("text") || fieldType.endsWith("ntext") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere binary value.
 */

export function isXsBinary(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("base64Binary") // XML
  || fieldType.endsWith("varbinary") || fieldType.endsWith("binary") // SQL
  || fieldType.endsWith("image") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere numeric value.
 */

export function isXsNumeric(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("double") || fieldType.endsWith("decimal") || fieldType.endsWith("float") // XML
  || fieldType.endsWith("numeric") || fieldType.endsWith("real") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere boolean value.
 */

export function isXsBoolean(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("boolean") // XML
  || fieldType.endsWith("bit") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere date value.
 */

export function isXsDate(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("date") || fieldType.endsWith("dateTime") // XML
  || fieldType.endsWith("datetime2") || fieldType.endsWith("smalldatetime") || fieldType.endsWith("datetimeoffset") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere time value.
 */

export function isXsTime(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere money value.
 */

export function isXsMoney(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("money") || fieldType.endsWith("smallmoney") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere id value.
 */

export function isXsId(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("ID") || fieldType.endsWith("NCName") // XML
  || fieldType.endsWith("uniqueidentifier") // SQL
  ) {
      return true;
    }

  return false;
}
/**
 * Helper function use to dertermine if a XS type must be considere id value.
 */

export function isXsRef(fieldType) {
  if (!fieldType.startsWith("xs") || fieldType.startsWith("sqltypes")) {
    return false;
  }

  if (fieldType.endsWith("anyURI") || fieldType.endsWith("IDREF") // XML
  ) {
      return true;
    }

  return false;
} ////////////////////////////////////////////////////////////////////////////
//  Random functions helpers
////////////////////////////////////////////////////////////////////////////

/**
 * Create a random color
 * @returns {string} A string containing the rgb(0-255,0-255,0-255) value.
 */

export function randomColor() {
  //apply a random color since we don't have content to show yet
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}
/**
 * Create a "version 4" RFC-4122 UUID (Universal Unique Identifier) string.
 * @returns {string} A string containing the UUID.
 */

export function randomUUID() {
  var s = [],
      itoh = '0123456789abcdef'; // Make array of random hex digits. The UUID only has 32 digits in it, but we
  // allocate an extra items to make room for the '-'s we'll be inserting.

  for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10); // Conform to RFC-4122, section 4.4


  s[14] = 4; // Set 4 high bits of time_high field to version

  s[19] = s[19] & 0x3 | 0x8; // Specify 2 high bits of clock sequence
  // Convert to hex chars

  for (var i = 0; i < 36; i++) s[i] = itoh[s[i]]; // Insert '-'s


  s[8] = s[13] = s[18] = s[23] = '-';
  return s.join('');
}
/**
 * Deterministic value from a given value.
 */

export function generateUUID(value) {
  uuid = new UUID(3, "ns:URL", value);
  return uuid.toString();
}
/**
 * Create an integer value between a given range.
 * @param {int} min The inclusive minimumal value
 * @param {int} max The inclusive maximal value
 * @returns {int} A integer value between the tow limits.
 */

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/**
 * That function create an array of integer of a given length and randomize it elments order.
 * @param {int} length the length of the array.
 * @returns A shuffled array
 */

export function randomArray(length) {
  var array = [];

  for (var i = 0; i < length; i++) {
    array.push(i);
  }

  return shuffleArray(array);
} //////////////////////////////////////////////////////////////////////////
// Style sheet and script files manipulation function
//////////////////////////////////////////////////////////////////////////

/**
 * Load the style sheet (.css) or source file (.js) dynamically.
 * @param {string} filePath The path of the file to load.
 * @param {string} fileType The value can be 'js' or 'css'
 * @callback {function} callback The function to execute after the files are loaded. 
 */

export function loadjscssfile(filePath, filetype, callback) {
  var func = callback; // Instanciate the function from the code.

  if (typeof callback == "string") {
    var func = new Function("return " + callback)();
  }

  if (filetype == "js" || filetype == "application/javascript") {
    //if filePath is a external JavaScript file
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "application/javascript");
    fileref.setAttribute("src", filePath);
    fileref.onload = func;
  } else if (filetype == "css" || filetype == "text/css") {
    //if filePath is an external CSS file
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filePath);
    fileref.onload = func;
  }

  if (typeof fileref != "undefined") document.getElementsByTagName("body")[0].appendChild(fileref);
}
/**
 * Append javasrcipt source in the runtime.
 * @param {string} src The source code to append.
 * @param {string} id The id of the element to insert, can be undefined.
 */

export function includeJavascript(src, id) {
  if (document.createElement && document.getElementsByTagName) {
    var head_tag = document.getElementsByTagName('head')[0];
    var script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute('src', src);
    head_tag.appendChild(script_tag);
  }
}
/**
 * Get the style sheet with a given name.
 * @param {string} fileName The name of the file to get.
 * @returns {object} The file if the file is found, or null if is not.
 */

export function getStyleSheetByFileName(fileName) {
  function getStyleSheetByUrl(url) {
    for (var id in document.styleSheets) {
      var stylesheet = document.styleSheets[id];
      var href = stylesheet.href;

      if (href == null) {
        if (stylesheet.ownerNode != undefined) {
          href = stylesheet.ownerNode.id;
        }
      }

      if (href != undefined) {
        if (href.toUpperCase().startsWith(url.toUpperCase())) {
          return stylesheet;
        }
      }
    }

    return null;
  }

  if (fileName[0] != "/") {
    var currentUrl = document.URL;
    currentUrl += fileName;
    return getStyleSheetByUrl(currentUrl);
  } else {
    // Try with the ipv4 adress
    currentUrl = window.location.href + fileName; // Look for href that contain the filename

    var stylesheet = getStyleSheetByUrl(currentUrl);

    if (stylesheet != null) {
      return stylesheet;
    }

    var style = document.createElement("style"); // WebKit hack

    style.appendChild(document.createTextNode("")); // Add the <style> element to the page

    document.head.appendChild(style);
    return style.sheet;
  }
}
/**
 * Retreive a property for a given selector with a given attribute name.
 * @selector {string} The css selector {., #, *, etc.} @see http://www.w3schools.com/cssref/css_selectors.asp
 * @attribte {string} The name of the attribute to retreive.
 * @returns The associated value or null if there no value found.
 */

export function propertyFromStylesheet(selector, attribute) {
  var value;
  [].some.call(document.styleSheets, function (sheet) {
    return [].some.call(sheet.rules, function (rule) {
      if (selector === rule.selectorText) {
        return [].some.call(rule.style, function (style) {
          if (attribute === style) {
            value = rule.style.getPropertyValue(attribute);
            return true;
          }
        });
      }

      return false;
    });
  });
  return value;
}
export function getRulesByName(selector) {
  var rules = [];

  for (var i = 0; i < document.styleSheets.length; i++) {
    for (var j = 0; j < document.styleSheets[i].rules.length; j++) {
      if (document.styleSheets[i].rules[j] != undefined) {
        if (document.styleSheets[i].rules[j].selectorText != undefined) {
          if (document.styleSheets[i].rules[j].selectorText.indexOf(selector) != -1) {
            rules.push(document.styleSheets[i].rules[j]);
          }
        }
      }
    }
  }

  return rules;
}
/**
 * The map of frame rules indexed by their name.
 */

var framesRules = {};
/**
 * Find a rule whit a given name.
 * @param {string} The name of the rule to retreive.
 * @returns The rule if one exist, or null otherwise.
 */

export function findKeyframesRule(name) {
  // Look in the map first.
  if (framesRules[name] != undefined) {
    return framesRules[name];
  }

  var ss = document.styleSheets;

  for (var i = 0; i < ss.length; ++i) {
    for (var j = 0; j < ss[i].cssRules.length; ++j) {
      if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == name) {
        framesRules[ss[i].cssRules[j].name] = ss[i].cssRules[j];
        return ss[i].cssRules[j];
      }
    }
  }

  return null;
} // shim layer with setTimeout fallback

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();
/**
 * Retreive a style rule for a given selector in a given style sheet.
 * @param {string} style The css style attribute name
 * @param {string} selector The css selector {., #, *, etc.} @see http://www.w3schools.com/cssref/css_selectors.asp
 * @param {string} sheetPath The style sheet path.
 * @returns {string} The associated value.
 */


export function getStyleRuleValue(style, selector, sheetPath) {
  var sheet = getStyleSheetByFileName(sheetPath);

  if (!sheet.cssRules) {
    return;
  }

  for (var j = 0, k = sheet.cssRules.length; j < k; j++) {
    var rule = sheet.cssRules[j];

    if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
      return rule.style[style];
    }
  }

  return null;
}
/** 
 * Append a new style rule whit a given id.
 * @param {string} id The id of the rule to insert.
 * @param {string} rule The rule text itself.
 */

export function addStyleString(id, rule) {
  var node = document.createElement('style');
  node.id = window.location.href + "/" + id;
  node.innerHTML = rule;
  document.body.appendChild(node);
}
export function getCSSRule(ruleName) {
  ruleName = ruleName.toLowerCase();
  var result = null;
  var find = Array.prototype.find;
  find.call(document.styleSheets, function (styleSheet) {
    result = find.call(styleSheet.cssRules, function (cssRule) {
      return cssRule instanceof CSSStyleRule && cssRule.selectorText.toLowerCase() == ruleName;
    });
    return result != null;
  });
  return result;
} //////////////////////////////////////////////////////////////////////////
// Array buffer conversion stuff
//////////////////////////////////////////////////////////////////////////

/**
 * Work arround for large file data url.
 * 
 * @param {*} dataURI 
 * @param {*} callback 
 */

export function dataURIToBlob(dataURI, callback) {
  var binStr = atob(dataURI.split(',')[1]),
      len = binStr.length,
      arr = new Uint8Array(len),
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  return new Blob([arr], {
    type: mimeString
  });
}
/**
 * Covertion from an Array Buffer to a string.
 * @param buffer the array buffer to convert.
 * @returns {string} the string representation of the input buffer.
 */

export function ab2str(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}
/**
 * Convertion of a string to an Array Buffer.
 * @param {string} str The string to convert.
 * @returns the resulting Array Buffer.
 */

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char

  var bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}
/**
 * Convertion fo an height unsigned bytes integer array to base 64 string. 
 * @param array The array to convert.
 * @returns {string} the base 64 string representation of the input array.
 */

export function Uint8ToBase64(array) {
  var CHUNK_SIZE = 0x8000; //arbitrary number

  var index = 0;
  var length = array.length;
  var result = '';
  var slice;

  while (index < length) {
    slice = array.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }

  return btoa(result);
}
var Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=%",
  encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }

    return output;
  },
  decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    if (input.indexOf(",") > -1) {
      // If the input is an url...
      input = input.substr(input.indexOf(","));
    }

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);
    return output;
  },
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode(c >> 6 | 192);
        utftext += String.fromCharCode(c & 63 | 128);
      } else {
        utftext += String.fromCharCode(c >> 12 | 224);
        utftext += String.fromCharCode(c >> 6 & 63 | 128);
        utftext += String.fromCharCode(c & 63 | 128);
      }
    }

    return utftext;
  },
  _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c
    var c1
    var c2
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode((c & 31) << 6 | c2 & 63);
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        i += 3;
      }
    }

    return string;
  }
  /**
   * Encode iput content into base64 string
   * @param {string} input The input string, can be an json string. 
   * @results Return the base 64 string.
   */

};
export function encode64(input) {
  return Base64.encode(input);
}
/**
 * Decode the content of a base64 string back into text
 * @param {string} input base 64 string to decode.
 * @results {string} the string containing the original value.
 */

export function decode64(input) {
  return Base64.decode(input);
}
/**
 * Convert an UTF8 string to a base 64 string.
 * @param {string} str the UTF8 string to convert.
 * @returns {string} The base 64 string representation.
 */

export function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
/**
 * Convert a base 64 string to an UTF8 string.
 * @param {string} str The base 64 string.
 * @returns {string} the original UTF8 string.
 */

export function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
/**
 * Convert a base 64 string to a blob.
 * @param base64Data The base 64 string.
 * @param The blob mime type.
 */

export function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);
    var bytes = new Array(end - begin);

    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }

    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }

  return new Blob(byteArrays, {
    type: contentType
  });
}
/**
 * Convert a data uri (base 64), to a binaray array unit8
 * @param uri The uri to convert.
 * @returns An array of unsigned bytes. (uint8)
 */

export function convertDataURIToBinary(uri) {
  var BASE64_MARKER = ';base64,';
  var base64Index = uri.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = uri.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }

  return array;
} //////////////////////////////////////////////////////////////////////////
// String helpers function
//////////////////////////////////////////////////////////////////////////

/**
 * Determine if a string has a given suffix.
 * @param {string} suffix The value to use as suffix.
 * @returns {boolean} Return true if the value is found.
 */

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (suffix) {
    return this.substring(this.length - suffix.length, this.length) === suffix;
  };
}

;
/**
 * Determine if a string has a given prefix.
 * @param {string} prefix The value to use as prefix.
 * @returns  {boolean} Return true if the value is found.
 */

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (prefix) {
    return this.substring(0, prefix.length) === prefix;
  };
}

;
/**
 * Replace all occurences of a given value in a given string by another value.
 * @param {string} find The value to replace.
 * @param {string} replace The value to use as replacement.
 */

String.prototype.replaceAll = function (find, replace) {
  var str = this;
  return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};
/**
 * Set the first letter of a work to upper case.
 */


String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * A quick snippet to grab all the indexes of a substring within a string
 * @param {*} string The string we looking for.
 */


String.prototype.indices = function (string) {
  var returns = [];
  var position = 0;

  while (this.indexOf(string, position) > -1) {
    var index = this.indexOf(string, position);
    returns.push(index);
    position = index + string.length;
  }

  return returns;
};
/**
 * Count the number of space in a given string.
 * @param {string} str The target string.
 * @returns {int} The number of white space. 
 */


export function CountSpace(str) {
  var arr = str.split(" ");
  var size = arr.length - 1;
  return size;
}
/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {string} text The text to be rendered.
 * @param {string} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */

export function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width * 1.2;
}
; //////////////////////////////////////////////////////////////////////////
// Color helpers function
//////////////////////////////////////////////////////////////////////////

/**
 * That function is use to calculate the inverted hexadecimal value of a given 
 * hexadecimal color value.
 * @param {string} The hexadecimal value of the color to invert.
 * @param {string} The inverted color of the input color.
 */

export function invertHex(hexnum) {
  hexnum = hexnum.replace("#", "");

  if (hexnum.length != 6) {
    alert("Hex color must be six hex numbers in length.");
    return false;
  }

  hexnum = hexnum.toUpperCase();
  var splitnum = hexnum.split("");
  var resultnum = "";
  var simplenum = "FEDCBA9876".split("");
  var complexnum = new Array();
  complexnum.A = "5";
  complexnum.B = "4";
  complexnum.C = "3";
  complexnum.D = "2";
  complexnum.E = "1";
  complexnum.F = "0";

  for (i = 0; i < 6; i++) {
    if (!isNaN(splitnum[i])) {
      resultnum += simplenum[splitnum[i]];
    } else if (complexnum[splitnum[i]]) {
      resultnum += complexnum[splitnum[i]];
    } else {
      alert("Hex colors must only include hex numbers 0-9, and A-F");
      return false;
    }
  }

  return "#" + resultnum;
}
/**
 * Apply the saturation level (brigthness) to a given color.
 * @param sat The saturation level.
 * @param hex The hexadecimal value of the color to saturate.
 * @returns The hexadecimal value of the saturated color.
 */

export function applySat(sat, hex) {
  var hash = hex.substring(0, 1) === "#";
  hex = (hash ? hex.substring(1) : hex).split("");
  var long = hex.length > 3,
      rgb = [],
      i = 0,
      len = 3;
  rgb.push(hex.shift() + (long ? hex.shift() : ""));
  rgb.push(hex.shift() + (long ? hex.shift() : ""));
  rgb.push(hex.shift() + (long ? hex.shift() : ""));

  for (; i < len; i++) {
    if (!long) {
      rgb[i] += rgb[i];
    }

    rgb[i] = Math.round(parseInt(rgb[i], 16) / 100 * sat).toString(16);
    rgb[i] += rgb[i].length === 1 ? rgb[i] : "";
  }

  return (hash ? "#" : "") + rgb.join("");
}
/**
 * Get the red value from an hexadecimal color input.
 * @param {string} h The hexadecimal value of the color
 * @returns {int} A integer value in range of 0-255
 */

export function hexToR(h) {
  return parseInt(cutHex(h).substring(0, 2), 16);
}
/**
 * Get the green value from an hexadecimal color input.
 * @param {string} h The hexadecimal value of the color
 * @returns {int} A integer value in range of 0-255
 */

export function hexToG(h) {
  return parseInt(cutHex(h).substring(2, 4), 16);
}
/**
 * Get the blue value from an hexadecimal color input.
 * @param {string} h The hexadecimal value of the color
 * @returns {int} A integer value in range of 0-255
 */

export function hexToB(h) {
  return parseInt(cutHex(h).substring(4, 6), 16);
} // Internal use only.

export function cutHex(h) {
  return h.charAt(0) == "#" ? h.substring(1, 7) : h;
}
/**
 * Get the Red/Green/Blue value from an hexadecimal color.
 * @param {string} h The hexadecimal value of the color
 * @returns The rgb representation of the input color.
 */

export function hexToRgb(h) {
  var r = hexToR(h);
  var g = hexToG(h);
  var b = hexToB(h);
  return [r, g, b];
}
/**
 * Get the red, green and blue component of a color and calculate it HSL value.
 * @param {int} r The red value 0-255
 * @param {int} g The green value 0-255
 * @param {int} b The blue value 0-255
 * @return Return the tree value of the HSL.
 */

export function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
  var h,
      s,
      l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}
/**
 * Determine if a color is more distintive over a black or a white background.
 * @param {string} hexcolor The input color.
 * @returns {string} Black if the color is more visible over black, or white otherwise.
 */

export function getContrastYIQ(hexcolor) {
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 138 ? 'black' : 'white';
} ///////////////////////////////////////////////////////////////////////////////////
// Various helpers
///////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new RpcData.
 * @param variable The variable to create as RpcData
 * @param {string} variableType The type of the variable. Can be: DOUBLE, INTEGER, STRING, BYTES, JSON_STR, BOOLEAN
 * @param {string} variableName The name of the variable to create as RpcData. This parameter is optional
 * @param {string} typeName This is the name on the server side that must be use to interprest the data.
 * @returns {RpcData} The created RpcData or undefined if variableType was invalid
 */

export function createRpcData(variable, variableType, variableName, typeName) {
  if (variableName == undefined) {
    variableName = "varName";
  }

  if (variableType == "DOUBLE") {
    variableType = Data_DOUBLE;
    typeName = "double";
  } else if (variableType == "INTEGER") {
    variableType = Data_INTEGER;
    typeName = "int";
  } else if (variableType == "STRING") {
    variableType = Data_STRING;
    typeName = "string";
  } else if (variableType == "BYTES") {
    variableType = Data_BYTES;
    typeName = "[]unit8";
  } else if (variableType == "JSON_STR") {
    variableType = Data_JSON_STR;

    if (variable != null) {
      if (variable.stringify != undefined) {
        variableType = Data_JSON_STR;
        typeName = variable.TYPENAME;
        variable = variable.stringify();
      } else {
        variable = JSON.stringify(variable);
      }
    }
  } else if (variableType == "BOOLEAN") {
    variableType = Data_BOOLEAN;
    typeName = "bool";
  } else {
    return undefined;
  } // Now I will create the rpc data.


  return new RpcData({
    "name": variableName,
    "type": variableType,
    "dataBytes": utf8_to_b64(variable),
    "typeName": typeName
  });
}
/**
 * Evaluate if an array contain a given element.
 * @param arr The target array.
 * @param obj The object to find.
 * @returns {boolean} True if the array contain the object.
 */

export function contains(arr, obj) {
  var i = arr.length;

  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }

  return false;
}
/**
 * Evaluate if an object exist in regard of a given property.
 * @param list the array.
 * @param prop the property name
 * @param val the value to test
 * @returns {boolean} True if an object has a property with the same value.
 */

export function objectPropInArray(list, prop, val) {
  if (list == undefined) {
    return false;
  }

  if (list.length > 0) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][prop] === val) {
        return true;
      }
    }
  }

  return false;
}
/**
 * Take a list of objects at function arguments and merge it to create a single object regrouping all objects properties.
 * @returns {object} The resulting object with all properties.
 */

export function mergeJSON() {
  var destination = {};
  sources = [].slice.call(arguments, 0);
  sources.forEach(function (source) {
    var prop;

    for (prop in source) {
      if (prop in destination && Array.isArray(destination[prop])) {
        // Concat Arrays
        destination[prop] = destination[prop].concat(source[prop]);
      } else if (prop in destination && typeof destination[prop] === "object") {
        // Merge Objects
        destination[prop] = merge(destination[prop], source[prop]);
      } else {
        // Set new values
        destination[prop] = source[prop];
      }
    }
  });
  return destination;
}
/**
 * Randomly order a given array.
 * @param array An array of object.
 * @returns the same array ramdomly ordered.
 */

export function shuffleArray(array) {
  for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);

  return array;
}
/**
 * Stringification of the current date with the format dd-mm-yyyy
 * @returns {string} The date string.
 */

export function getCurrentDateStr() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  today = dd + '-' + mm + '-' + yyyy;
  return today;
}
/**
 * Resize an image to a maximum with or height, and keep the same ratio.
 * @param {string} The base 64 representation of the image.
 * @param {int} maxWidth The maximum width of the image.
 * @param {int} maxHeight The maximum height of the image.
 * @return {string} The base 64 representation of the resized image.
 */

export function resizeImage(base64, maxWidth, maxHeight) {
  // Max size for thumbnail
  if (typeof maxWidth === 'undefined') var maxWidth = 1024;
  if (typeof maxHeight === 'undefined') var maxHeight = 1024; // Create and initialize two canvas

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var canvasCopy = document.createElement("canvas");
  var copyContext = canvasCopy.getContext("2d"); // Create original image

  var img = new Image();
  img.src = base64;

  if (img.width <= 1024 && img.height <= 1024) {
    // nothing todo here.
    return base64;
  } // Determine new ratio based on max size


  var ratio = 1;
  if (img.width > maxWidth) ratio = maxWidth / img.width;else if (img.height > maxHeight) ratio = maxHeight / img.height; // Draw original image in second canvas

  canvasCopy.width = img.width;
  canvasCopy.height = img.height;
  copyContext.drawImage(img, 0, 0); // Copy and resize second canvas to first canvas

  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;
  ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
}
/**
 * Select all the text of a given element.
 * @param element the text element.
 */

export function selectText(element) {
  var doc = document;
  var text = element;

  if (doc.body.createTextRange) {
    // ms
    var range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    // moz, opera, webkit
    var selection = window.getSelection();
    var range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
/**
 * Return the name of the browser.
 * @returns {string} Can be one of Opera, Chrome, Safari, Firefox, IE or unknow.
 */

export function getNavigatorName() {
  if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
    return 'Opera';
  } else if (navigator.userAgent.indexOf("Chrome") != -1) {
    return 'Chrome';
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    return 'Safari';
  } else if (navigator.userAgent.indexOf("Firefox") != -1) {
    return 'Firefox';
  } else if (navigator.userAgent.indexOf("MSIE") != -1 || !!document.documentMode == true) //IF IE > 10
    {
      return 'IE';
    } else {
    return 'unknown';
  }
}
/** 
 * Return the time since a given time, it format 
 * the result in a human readable form.
 * @param {date} since The past date.
 * @returns {string} readable elapsed time.
 */

export function getTimeSinceStr(since) {
  //var now = Math.floor(Date.now() / 1000)
  var now = new Date().getTime();
  var passed = Math.floor(now / 1000) - since;

  if (passed < 60) {
    // Dipslay only the second here
    passed += " secs";
  } else if (passed >= 60 && passed < 3600) {
    // Display minutes here 
    passed = Math.floor(passed / 60) + " mins";
  } else if (passed >= 3600 && passed <= 86400) {
    // Display session that no longuer than on day
    var passedHours = Math.floor(passed / 3600) + " hrs"; // The minutes.

    var passedMinutes = Math.floor(passed % 3600 / 60) + " mins";
    passed = passedHours + " " + passedMinutes;
  } else {
    // Here the user is online for more than a day.
    passedDay = Math.floor(passed / 86400) + " days"; // The hours.

    passedHours = Math.floor(passed % 86400 / 3600) + " hrs"; // The minutes.

    var passedMinutes = Math.floor(passed % 86400 % 3600 / 60) + " mins";
    passed = passedDay + " " + passedHours + " " + passedMinutes;
  }

  return passed;
} //////////////////////////////////////////////////////////////////////////////////////
// Search function execute on the server side.
//////////////////////////////////////////////////////////////////////////////////////

export function keysrt(key) {
  return function (a, b) {
    if (a[key] > b[key]) return 1;
    if (a[key] < b[key]) return -1;
    return 0;
  };
}
/**
 * Search for object with value that begin with a given prefix
 */

export function StartWith(objects) {
  var results = _.select(objects, function (val) {
    var reg = /(^__PREFIX__)/;
    var result = reg.exec(val.__FIELD__);

    if (result != null) {
      if (result.length > 1) {
        return true;
      }
    }

    return false;
  });

  return results;
}
export function simulate(element, eventName) {
  var options = extend(defaultOptions, arguments[2] || {});
  var oEvent,
      eventType = null;

  for (var name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name;
      break;
    }
  }

  if (!eventType) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);

    if (eventType == 'HTMLEvents') {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
    }

    element.dispatchEvent(oEvent);
  } else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    var evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent('on' + eventName, oEvent);
  }

  return element;
}
export function extend(destination, source) {
  for (var property in source) destination[property] = source[property];

  return destination;
}
var eventMatchers = {
  'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
  'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};
var defaultOptions = {
  pointerX: 0,
  pointerY: 0,
  button: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  bubbles: true,
  cancelable: true
  /**
   *  Return the position top, left relative to the document.
   *  @param {object} elem The element to get the position.
   */

};
export function getCoords(elem) {
  // crossbrowser version
  var box = elem.getBoundingClientRect();
  var body = document.body;
  var docEl = document.documentElement;
  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  var clientTop = docEl.clientTop || body.clientTop || 0;
  var clientLeft = docEl.clientLeft || body.clientLeft || 0;
  var top = box.top + scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;
  return {
    top: Math.round(top),
    left: Math.round(left)
  };
}
/**
 * Return the global postion of a given element.
 * @param target An html element.
 * @returns The rectangle coordinates (top, left, bottom, right) with their respective values.
 */

export function localToGlobal(target) {
  var width = target.offsetWidth;
  var height = target.offsetHeight;
  var gleft = 0;
  var gtop = 0;
  var rect = {};

  var moonwalk = function (parent) {
    if (!parent) {
      gleft += parent.offsetLeft;
      gtop += parent.offsetTop;
      moonwalk(parent.offsetParent);
    } else {
      return rect = {
        top: target.offsetTop + gtop,
        left: target.offsetLeft + gleft,
        bottom: target.offsetTop + gtop + height,
        right: target.offsetLeft + gleft + width
      };
    }
  };

  moonwalk(target.offsetParent);
  return rect;
}
/**
 * Determine if the browser has video player.
 */

export function hasUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}
/**
 * Export list of rows to csv file.
 * @param filename The name of the file to after download.
 * @param rows A 2D array of values.
 */

export function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';

    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? '' : row[j].toString();

      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }

      ;
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ',';
      finalVal += result;
    }

    return finalVal + '\n';
  };

  var csvFile = '';

  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], {
    type: 'text/csv;charset=utf-8;'
  });

  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");

    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
} //////////////////////////////////////////////////////////////////////////////////////////////////////
//  Various value formating function.
//////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Format a date.
 * @param {date} value The date to format.
 * @param {format} format A string containing the format to apply, YYYY-MM-DD HH:mm:ss is the default.
 */

export function formatDate(value) {
  // Try to convert from a unix time.
  var date = new Date(value * 1000);

  if (date instanceof Date && !isNaN(date.valueOf())) {
    value = date;
  } // Here I will use the browser 


  var format = 'YYYY-MM-DD HH:mm:ss';
  value = moment(value).format(format);
  return value;
}
/**
 * Display a real number to a given precision.
 * @param {real} value The number to format.
 * @param {int} digits The number of digits after the point.
 */

export function formatReal(value, digits) {
  if (digits == undefined) {
    digits = 2;
  }

  value = parseFloat(value).toFixed(digits);
  return value;
}
/**
 * Format a string to be display in a input or text area control.
 * @param {string} value The string to format.
 */

export function formatString(value) {
  if (value == null) {
    return "";
  }

  if (value.replace != undefined) {
    value = value.replace(/\r\n|\r|\n/g, "<br />");
  }

  return value;
}
/**
 * Format boolean value.
 * @param {*} value 
 */

export function formatBoolean(value) {
  if (value == undefined) {
    value = 0;
  }

  if (value == 1) {
    return "true";
  } else if (value == 0) {
    return "false";
  }

  return value.toString();
} // Format the value

export function formatValue(value, typeName, callback) {
  // get the base type name.
  if (getBaseTypeExtension(typeName).length > 0) {
    typeName = getBaseTypeExtension(typeName);
  } // Here I will display basic types.


  if (isXsString(typeName) || isXsId(typeName)) {
    formatedValue = formatString(value);
  } else if (isXsBoolean(typeName)) {
    formatedValue = formatBoolean(value);
  } else if (isXsDate(typeName) || isXsTime(typeName)) {
    formatedValue = formatDate(value);
  } else if (isXsMoney(typeName) || typeName.indexOf("Price") != -1) {
    formatedValue = formatReal(value, 2);
  } else if (isXsInt(typeName)) {
    // In case of a date.
    if (typeName.startsWith("enum:")) {
      // In that case I will create a select box.
      // enum:FileType_DbFile:FileType_DiskFile
      formatedValue = typeName.split(":")[value].split("_")[1];
    } else {
      // Int are numeric value with 0 digit.
      formatedValue = formatReal(value, 0);
    }
  } else if (isXsNumeric(typeName)) {
    formatedValue = formatReal(value, 3);
  } else if (typeName.endsWith(":Ref")) {
    if (callback != undefined) {
      getEntityIdsFromUuid(value, callback);
    }
  } else if (isObject(value)) {
    if (value.M_valueOf != null) {
      formatedValue = value.M_valueOf;
    } else if (value.toString != undefined) {
      formatedValue = value.toString(); // that function can be use to display object as string.
    } else if (value.getTitles != undefined) {
      for (var i = 0; i < value.getTitles(); i++) {
        formatedValue += value.getTitles()[i];

        if (i < value.getTitles().length - 1) {
          formatedValue += " ";
        }
      }
    }
  } else if (isString(value)) {
    // remove empty values.
    if (value.startsWith("data:image/")) {
      // In that case I got a picture so I will create an image from it.
      var img = new Element(null, {
        "tag": "img",
        "src": value
      });
      return img;
    }

    formatedValue = null;
  }

  return formatedValue;
}