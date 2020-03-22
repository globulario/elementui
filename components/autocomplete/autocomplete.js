// List of imported functionality.
import { createElement } from "@davecourtois/elementui/components/element.js";
import { isString, getCoords, getMouseX, getMouseY } from "@davecourtois/elementui/components/utility.js";
var server = undefined;
/*
 * This class is use to insert auto-completion functionnality
 * to an existing text box...
 * @constructor
 * @param control The associated control where the message came from...
 * @param selectCallback if definied that function is call when the value is selected.
 */

var autocompleteDiv = null;
export function attachAutoComplete(control, elementLst, autoComplete, selectCallback) {
  if (control.element.parentNode != undefined) {
    control.element.parentNode.style.position = "relative";
  } // The value must be in the list...

  if (autoComplete == undefined) {
    autoComplete = true;
  }

  control.element.addEventListener("blur", function (selectCallback) {
    return function (evt) {
      if (this.style.display == "none" && autocompleteDiv != null) {
        // if the mouse is not over the autocompleteDiv...
        var box = autocompleteDiv.element.getBoundingClientRect(); // If the mouse i not over the box.
        var isOver = getMouseX() > box.left && getMouseX() < box.right && getMouseY() < box.bottom && getMouseY() > box.top;

        if (!isOver) {
          var isSelect = false;
          for (var id in autocompleteDiv.childs) {
            var c = autocompleteDiv.childs[id];
            if (c.element.style.backgroundColor == "darkgrey") {
              c.element.click();
              isSelect = true;
              break;
            }
          } // if  no selection is made...

          if (!isSelect) {
            autocompleteDiv.removeAllChilds();
            autocompleteDiv.element.style.display = "none";
            this.value = "";
          }
        }
      }
    };
  }(selectCallback), true);
  var currentIndex = -1;
  /* Save the key down event **/

  control.element.addEventListener("keyup", function (control, elementLst, autoComplete, selectCallback) {
    return function (evt) {
      /* The div that contain items **/
      var coord = getCoords(control.element);
      var minWidth = control.element.offsetWidth + "px";

      if (control.element.value.length >= 1) {
        if(autoComplete){
          let isPrefix = false;
          for(i=0; i < elementLst.length; i++){
              if(elementLst[i].toUpperCase().startsWith(control.element.value.toUpperCase())){
                isPrefix = true;
                break; // at least one element has v for prefix.
              }
          }
          if(!isPrefix){
            control.element.value = control.element.value.substring(0, control.element.value.length - 1)
          }
        }

        if (autocompleteDiv == null) {
          // Create the style programatically.
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = ".autoCompleteDiv{";
          style.innerHTML += "    position: absolute;";
          style.innerHTML += "    background-color: white;";
          style.innerHTML += "    -webkit-box-shadow: 5px 5px 12px -4px rgba(0,0,0,0.75);";
          style.innerHTML += "    -moz-box-shadow: 5px 5px 12px -4px rgba(0,0,0,0.75);";
          style.innerHTML += "    box-shadow: 5px 5px 12px -4px rgba(0,0,0,0.75);";
          style.innerHTML += "    border: 1px solid darkgrey;";
          style.innerHTML += "    z-index: 1;";
          style.innerHTML += "    max-height: 300px;";
          style.innerHTML += "    overflow-y: auto;";
          style.innerHTML += "    text-align: left;";
          style.innerHTML += " }";
          style.innerHTML += ".autoCompleteDiv div:hover {";
          style.innerHTML += "     cursor: pointer;";
          style.innerHTML += "     background-color:  darkgrey;";
          style.innerHTML += " }";
          style.innerHTML += " .autoCompleteDiv div {";
          style.innerHTML += "     font-size: 10pt;";
          style.innerHTML += "     font-family: arial;";
          style.innerHTML += "     padding-left: 2px;";
          style.innerHTML += "     border: 1px solid transparent;";
          style.innerHTML += "  }";
          document.getElementsByTagName('head')[0].appendChild(style);
          var div = document.createElement("div");
          div.className = "autoCompleteDiv";
          div.style.zIndex = 1001;
          div.id = "autocompleteDiv";
          document.getElementsByTagName("body")[0].appendChild(div);
          autocompleteDiv = createElement(div);
        } else {
          autocompleteDiv.removeAllChilds();
          autocompleteDiv.element.style.display = "none";
        }

        autocompleteDiv.element.style.minWidth = minWidth;
        autocompleteDiv.element.style.top = coord.top + control.element.offsetHeight + "px";
        autocompleteDiv.element.style.left = coord.left + -1 + "px";
        autocompleteDiv.element.style.display = "block"; // Filter the values...
        var values = [];
        for (var i = 0; i < elementLst.length; i++) {
          var value = elementLst[i];
          if (value.toUpperCase().startsWith(control.element.value.toUpperCase())) {
            values.push(value);
          }
        }

        if (values.length > 1 || values.length >= 1 && !autoComplete) {
          // Append the element...
          for (var i = 0; i < values.length; i++) {
            var value = values[i];
            if (!isString(value)) {
              value = value.toString();
            }

            var elementDiv = autocompleteDiv.appendElement({
              "tag": "div",
              "innerHtml": value,
              "contenteditable": "true",
              "style": "display: block;",
              "id": i
            }).down(); // Here i will append the click event...

            elementDiv.element.onclick = function (control, autocompleteDiv, value, selectCallback) {
              return function (evt) {
                evt.stopPropagation();
                if (control.element.value != value) {
                  control.element.value = value;
                  if (selectCallback != undefined) {
                    // Here the caller want to get control...
                    selectCallback(value);
                  }
                }

                if (control.element.onchange != null) {
                  control.element.onchange();
                }
                currentIndex = -1;
                autocompleteDiv.removeAllChilds();
                autocompleteDiv.element.style.display = "none";
              };
            }(control, autocompleteDiv, values[i], selectCallback);
          } // Display the list...
          autocompleteDiv.element.style.display = "block";
        } else if (values.length == 1) {
          if (selectCallback == undefined) {
            control.element.value = values[0];
            autocompleteDiv.element.style.display = "none";
          } else {
            selectCallback(values[0]);
          }
          autocompleteDiv.element.style.display = "none";
        } else if (values.length == 0) {
          autocompleteDiv.element.style.display = "none";
          currentIndex = -1;
        }
      } else if (autocompleteDiv != undefined) {
        autocompleteDiv.removeAllChilds();
        autocompleteDiv.element.style.display = "none";
      }

      if (evt.keyCode == 40 || evt.keyCode == 38 || evt.keyCode == 13) {
        var max = Object.keys(autocompleteDiv.childs).length;
        if (max > 0) {
          var index = currentIndex;
          if (evt.keyCode == 40) {
            if (index < max - 1) {
              index++;
            }
          } else if (evt.keyCode == 38) {
            if (index > 0) {
              index--;
            }
          }

          if (index == -1) {
            autocompleteDiv.element.style.display = "none";
            return;
          }

          var c = autocompleteDiv.childs[index];
          c.element.style.backgroundColor = "darkgrey";

          if (evt.keyCode == 13) {
            c.element.click();
            currentIndex = -1;
          }

          currentIndex = index;
        }
      } else if (evt.keyCode == 27) {
        for (var id in autocompleteDiv.childs) {
          var c = autocompleteDiv.childs[id];
          c.element.style.backgroundColor = "";
        } // exit the selection.
        control.element.blur();
      }
    };
  }(control, elementLst, autoComplete, selectCallback), true);
}