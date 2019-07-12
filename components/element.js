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
*/

/**
* @fileOverview Html element wrapper class.
* @author Dave Courtois, Philippe Séguin-Boies, Eric Kavalec
* @version 1.0.0
*/
import { randomUUID, getStyleSheetByFileName, getNavigatorName } from "./utility.js";
/**
* Creates a child element for a given parent.
* @param parent The parent of the child element.
* @param node The child element node.
* @stability 1
*/

function createChildElement(parent, node) {
  var nodeElement = new Element(parent, null, null);
  nodeElement.parent = parent;
  nodeElement.element = node;

  if (node.id !== undefined) {
    nodeElement.id = node.id;
  } else {
    nodeElement.id = randomUUID();
    node.id = nodeElement.id;
  }

  if (parent === null) {
    document.getElementsByTagName("body")[0].appendChild(node);
  } else {
    parent.appendElement(nodeElement);
  } // Wrapping the html elements inside the js element structure


  for (var i = 0; i < node.childNodes.length; i++) {
    createChildElement(nodeElement, node.childNodes[i]);
  }
}
/**
* Builds an element from a plain xml string.
* @param parent The parent of the resulting element.
* @param xml The xml string.
* @stability 1
*/


function createElementFromXml(parent, xml) {
  var parser = new DOMParser(); // The parser creates the html element

  var xmlDoc = parser.parseFromString(xml, "text/xml"); // Wrapping the html elements inside the js element structure

  for (var i = 0; i < xmlDoc.childNodes.length; i++) {
    createChildElement(parent, xmlDoc.childNodes[i]);
  }
}
/**
* Builds an element from a plain html string.
* @param parent The parent of the resulting element.
* @param html The xml string.
* @stability 0
*/


function createElementFromHtml(parent, html) {
  var parser = new DOMParser();
  var htmlDoc = parser.parseFromString(html, "text/html");
  var body = htmlDoc.getElementsByTagName("body")[0];

  for (var i = 0; i < body.childNodes.length; i++) {
    var node = body.childNodes[i];

    if (node.nodeName != "#text" && node.nodeName != "#comment" && node.nodeName != "#script") {
      createChildElement(parent, body.childNodes[i]);
    }
  }
}
/**
 * Create a Element from a plain html element.
 * @param {*} element The dom element
 */


export function createElement(element, params) {
  var parent = null;

  if (element != null) {
    parent = element.parentNode;
  }

  var e;

  if (params == undefined) {
    e = new Element(parent, {});
    e.element = element;
    e.uuid = element.id;
  } else {
    e = new Element(parent, params);
  }

  return e;
}
/**
* Wraps DOM element
  *@param parent The parent element of this element. Can be an Element or a DOM element.
* @param params The list of parameters.
* @param callback This function is called after the initialization is completed.
* @param appendFront If true the element is put in front of the other elements, otherwise it will be at the end.
* @returns {HTMLElement}
* @constructor
* @stability 2
*/

var Element = function (parent, params, callback, appendFront) {
  /**
   * @property {function} callback The function to call after the initialization.
   */
  this.callback = callback;
  /**
   * @property {Element} parent The parent element, can be a plain HTML element or an Element.
   */

  this.parentElement = parent;
  /**
   * @property {string} uuid uniquely indentify an element.
   */

  this.uuid = randomUUID();
  /**
   * @property {string} id textual id to name an element, not necessarely unique.
   */

  this.id = this.uuid;
  /**
   * @property {Element[]} childs The map of child elements indexed by their id.
   */

  this.childs = {}; // Keeping a reference of the lastChild. Used by the down function.

  this.lastChild = null;

  if (params !== null) {
    // If there is no tag or params, this means the initialization is
    // made outside the constructor. See createElementFromXml for example.
    var innerHtml = "";

    if (params.tag !== undefined) {
      if (params.NS !== undefined) {
        this.element = document.createElementNS(params.NS, params.tag);
      } else {
        this.element = document.createElement(params.tag);
      }

      this.element._ParentObject_ = this;
      var isScript = params["tag"] == "script";
      delete params["tag"]; // Set attributes

      for (var param in params) {
        // The child element
        if (param === "childs") {
          for (var i = 0; i < params[param].length; i++) {
            this.appendElement(params[param][i]);
          }
        } else if (param == "init") {
          this.init = params[param];
        } else if (param == "innerHtml") {
          innerHtml = params[param];
        } else if (param == "id") {
          this.id = params[param];

          if (params["NS"] !== undefined) {
            this.element.setAttributeNS(param.NS, param, params[param]);
          } else {
            this.element.setAttribute(param, params[param]);
          }
        } else {
          if (params["NS"] !== undefined) {
            this.element.setAttributeNS(param.NS, param, params[param]);
          } else {
            this.element.setAttribute(param, params[param]);
          }
        }
      }

      if (parent != null) {
        // Append child
        if (!appendFront) {
          if (parent.element == undefined) {
            parent.appendChild(this.element);
          } else {
            parent.element.appendChild(this.element);
            parent.appendElement(this);
          }
        } else {
          // Prepend child
          if (parent.element == undefined) {
            if (parent.childNodes.length > 0) {
              var firstChild = parent.childNodes[0];
              parent.insertBefore(this.element, firstChild);
            } else {
              parent.appendChild(this.element);
            }
          } else {
            if (parent.element.childNodes.length > 0) {
              var firstChild = parent.element.childNodes[0];
              parent.element.insertBefore(this.element, firstChild);
            } else {
              parent.element.appendChild(this.element);
            }

            parent.prependElement(this);
          }
        }
      }

      if (innerHtml != null) {
        // The inner html
        if (innerHtml.length > 0) {
          this.element.innerHTML = innerHtml + this.element.innerHTML;
        }
      }
    }
  }

  if (this.callback != undefined) {
    this.callback(); // Calls the callback function
  }

  return this;
};
/**
* Append a child element to an existing element. The child element will be last in the parent's childs hierarchy
* @param {Element} e The element to append. It can be an existing element, or a list of element properties.
* @returns {HTMLElement}
* @example var child = parent.appendElement({"tag":"div", "class":"myClass", "style":"position:absolute; with:1px;"}).down()
* @stability 1
*/


Element.prototype.appendElement = function (e) {
  if (e == undefined) {
    return;
  }

  if (e.element != undefined) {
    e.parentElement = this;
    this.childs[e.id] = e;
    this.lastChild = e;
    this.element.appendChild(e.element);
  } else {
    for (var i = 0; i < arguments.length; i++) {
      var child = new Element(this, arguments[i]);
      child.parentElement = this;
      this.childs[child.id] = child;
      this.lastChild = child;
    }
  }

  return this;
};
/**
* Append a child element to an existing element. The child element will be first in the parent's childs hierarchy
* @param e The element to append. It can be an existing element, or a list of element properties.
* @returns {HTMLElement}
* @example var child = parent.prependElement({"tag":"div", "class":"myClass", "style":"position:absolute; with:1px;"}).down()
* @stability 1
*/


Element.prototype.prependElement = function (e) {
  if (e == null) {
    return;
  }

  if (e.element != undefined) {
    e.parentElement = this;
    this.childs[e.id] = e;
    this.lastChild = e;

    if (e.element.innerHTML != undefined) {
      if (this.element.childNodes.length > 0) {
        var firstChild = this.element.childNodes[0];
        this.element.insertBefore(e.element, firstChild);
      } else {
        this.element.appendChild(e.element);
      }
    }
  } else {
    for (var i = 0; i < arguments.length; i++) {
      var child = new Element(this, arguments[i], undefined, true);
      child.parentElement = this;
      this.childs[child.id] = child;
      this.lastChild = child;
    }
  }

  return this;
};
/**
 *  Insert a child inside a div a given position.
 */


Element.prototype.insertChildAtIndex = function (child, index) {
  if (!index) index = 0;

  if (index >= this.element.children.length) {
    this.element.appendChild(child.element);
  } else {
    this.insertBefore(child.element, this.element.children[index]);
  }
};
/**
* Remove a child element.
* @param {Element} e The child element to remove.
* @stability 1
*/


Element.prototype.removeElement = function (e) {
  // Remove it from the DOM
  this.element.removeChild(e.element); // Remove it from the memory

  delete this.childs[e.id];
};
/**
* Remove all the childs of an element.
* @stability 1
*/


Element.prototype.removeAllChilds = function () {
  for (var id in this.childs) {
    if (this.childs[id].element != undefined) {
      if (this.childs[id].element.parentNode != null) {
        try {
          this.childs[id].element.parentNode.removeChild(this.childs[id].element);
        } catch (err) {}
      }
    }
  }

  this.childs = {};
};
/**
* Initialization of the element
* Recursive function called from the most exterior Element.
* @returns {HTMLElement}
* @stability 0
*/


Element.prototype.init = function () {
  var keys = Object.keys(this.childs),
      i = 0,
      len = keys.length,
      child = null;

  for (; i < len; i++) {
    child = this.childs[keys[i]];

    if (child.init != undefined) {
      child.init();
    }
  }

  if (this.callback != undefined) {
    this.callback(); // Calls the callback function
  }

  return this;
};

Element.prototype.delete = function () {
  if (this.parentElement != null) {
    this.parentElement.removeElement(this);
  }

  this.removeAllChilds();

  try {
    this.element.parentNode.removeChild(this.element);
  } catch (err) {}

  delete this;
};
/**
* Find a child inside the element or inside one of the child elements, 
 * recursively with a given Id. 
 * @param {string} id The class name of the element to retreive.
* @returns {Element}
* @stability 2
*/


Element.prototype.getChildById = function (id) {
  var keys = Object.keys(this.childs);
  var found = null;

  for (var i = 0; i < keys.length; i++) {
    var child = this.childs[keys[i]];

    if (child.id == id) {
      return child;
    } else {
      found = child.getChildById(id);

      if (found != null) {
        return found;
      }
    }
  }

  return found;
};
/**
* Find a child inside the element or inside one of the child elements, 
 * recursively with a given name. 
 * @param {string} name The name of the element to retreive.
* @returns {Element}
* @stability 2
*/


Element.prototype.getChildsByName = function (name, childs) {
  var keys = Object.keys(this.childs),
      i = 0,
      len = keys.length,
      found = null;

  if (childs == undefined) {
    childs = [];
  }

  if (this.element.name != undefined) {
    if (this.element.name.indexOf(name) != -1) {
      childs.push(this);
    }
  }

  for (i = 0; i < len; i++) {
    child = this.childs[keys[i]]; // push values of child...

    childs.concat(child.getChildsByName(name, childs));
  }

  return childs;
};
/**
* Find a child inside the element or inside one of the child elements, 
 * recursively with a given class name. 
 * @param {string} className The class name of the element to retreive.
* @returns {Element}
* @stability 2
*/


Element.prototype.getChildsByClassName = function (className, childs) {
  var keys = Object.keys(this.childs),
      i = 0,
      len = keys.length,
      found = null;

  if (childs == undefined) {
    childs = [];
  }

  if (this.element.className.indexOf(className) != -1) {
    childs.push(this);
  }

  for (i = 0; i < len; i++) {
    var child = this.childs[keys[i]]; // push values of child...
    childs.concat(child.getChildsByClassName(className, childs));
  }

  return childs;
};
/**
* Get the root element.
* @returns {Element} The root element.
* @stability 1
*/


Element.prototype.getTopParent = function () {
  if (this.parentElement != null) {
    if (this.parentElement.getTopParent != undefined) {
      return this.parentElement.getTopParent();
    }
  }

  return this;
};

/**
* Navigation function used to navigate upwards in the Element hierarchy.
* @returns {Element} The immediate parent.
* @stability 1
*/
Element.prototype.up = function () {
  if (this.parentElement == null) {
    var bodyElement = new Element(null, {});
    bodyElement.element = document.getElementsByTagName("body")[0];
    return bodyElement;
  }

  return this.parentElement;
};
/**
* Navigation function used to navigate downwards in the Element hierarchy.
* @returns {Element} The last child.
* @stability 1
*/


Element.prototype.down = function () {
  return this.lastChild;
};
/**
* Move childs from another element into this element.
* The childs that are moved into this element will be removed from their 
 * previous parents.
* @param {Element} childs The Childs to move.
* @stability 1
*/


Element.prototype.moveChildElements = function (childs) {
  for (var childId in childs) {
    var childElement = childs[childId];

    if (childElement.element != undefined) {
      if (childElement.element.parentNode != undefined) {
        childElement.element.parentNode.removeChild(childElement.element);
      }

      if (childElement.element.innerHTML == "") {
        this.element.appendChild(childElement.element);
      }

      this.appendElement(childElement);
    }
  }
};
/**
* Copy childs from another element into this element.
* The childs that are copied into this element will still be 
 * childs of their previous parents.
* @param {Element} childs The Childs to copy.
* @stability 1
*/


Element.prototype.copyChildElements = function (childs) {
  for (var childId in childs) {
    this.element.appendChild(childs[childId].element.cloneNode(true));
  }
}; ////////////////////////////////////////////////////////////////////////////
// Shortcuts
////////////////////////////////////////////////////////////////////////////

/** 
 * Set Style attribute of an element.
* @param attribute: string
* @param value: string
* @stability 1
*/


Element.prototype.setStyle = function (attribute, value) {
  this.element.style[attribute] = value;
};
/**
* Set Attribute of an element.
* @param attribute: string
* @param value: string
* @stability 1
*/


Element.prototype.setAttribute = function (attribute, value) {
  this.element[attribute] = value;
};
/**
* Dynamically create animation for a given element.
* @param keyframe Contains the inner text of a keyframe. Example: 0%{ css_properitie1: val; . etc.} 50%{.}
* @param time The duration of the animation.
* @param endAnimationCallback The function to call at the end of the animation.
* @param transition The function to use for transition.
* @param fillMode CSS3 animation-fill-mode Property.
* @param iteration The number of animation repetition.
* @stability 1
*/


Element.prototype.animate = function (keyframe, time, endAnimationCallback, transition, fillMode, iteration) {
  var animationId = randomUUID();

  if (transition == undefined) {
    transition = "all ease";
  }

  if (fillMode == undefined) {
    fillMode = "forwards";
  }

  if (iteration == undefined) {
    iteration = 1;
  } // Time is zero by defaut.


  if (time == undefined) {
    time = 0;
  } // The animation and keyframe name.


  var className = "elementAnimation";
  var styleSheet = getStyleSheetByFileName("/css/main.css");
  var animationPrefix = "";

  if (getNavigatorName() == "Chrome" || getNavigatorName() == "Safari") {
    animationPrefix = "-webkit-";
  }

  var rule = "._" + animationId + "_" + className + "{";
  rule += animationPrefix + "animation-name: _" + animationId + "_elementAnimationkeyframe;";
  rule += animationPrefix + "animation-duration: " + time + "s; ";
  rule += animationPrefix + "animation-transition: " + transition + ";";
  rule += animationPrefix + "animation-iteration-count: " + iteration + ";";
  rule += animationPrefix + "animation-fill-mode:" + fillMode + ";}";
  styleSheet.insertRule(rule, 0);
  var targetChildKeyFrame = "@" + animationPrefix + "keyframes _" + animationId + "_elementAnimationkeyframe{"; // Get the corner values.

  targetChildKeyFrame += keyframe;
  targetChildKeyFrame += "}";
  styleSheet.insertRule(targetChildKeyFrame, 0); // End of the animation.

  var endAnimationListenerName = "animationend";

  if (getNavigatorName() == "Chrome" || getNavigatorName() == "Safari") {
    endAnimationListenerName = "webkitAnimationEnd";
  }

  var animationListner = function (styleSheet, animationId, className, endAnimationCallback, endAnimationListenerName) {
    return function () {
      // Reset the class name.
      this.className = this.className.replace(className, ""); // Remove the animation class created for the childs.

      for (var id in styleSheet.rules) {
        if (styleSheet.rules[id] != undefined) {
          if (styleSheet.rules[id].cssText != undefined) {
            if (styleSheet.rules[id].cssText.indexOf("_" + animationId + "_") > -1) {
              styleSheet.deleteRule(parseInt(id));
            }
          }
        }
      }

      if (endAnimationCallback != null) {
        // Call the end animation callback.
        endAnimationCallback(); // Delete listner to prevent stacking

        this.removeEventListener(endAnimationListenerName, animationListner, true);
      }
    };
  }(styleSheet, animationId, " _" + animationId + "_" + className, endAnimationCallback, endAnimationListenerName); // End animation event.


  this.element.addEventListener(endAnimationListenerName, animationListner, true); // Start the animation. 

  this.element.className += " _" + animationId + "_" + className;
};