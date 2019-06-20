// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

import "./menuItem.js"; // List of imported functionality.

import { createElement } from "../element.js";
import { isString, getCoords } from "../utility.js";
/**
 * That class must be use to create menu.
 */

class DropdownMenuElement extends PolymerElement {
  constructor() {
    super(); // Drop down menu members.

    this.parent = null;
    this.panel = null;
    this.items = [];
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      pagesize: Number,
      color: String,
      background: String,
      overColor: String,
      overBackground: String,
      side: String
    };
  }

  static get template() {
    return html`
            <style>
            </style>
            <slot></slot>
    `;
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    super.ready(); // Set the default font/icon color

    if (this.color == undefined) {
      this.color = "black";
    }

    if (this.overColor == undefined) {
      this.overColor = "black";
    } // Set the default background color


    if (this.background == undefined) {
      this.background = "white";
    }

    if (this.overBackground == undefined) {
      this.overBackground = "#E8E8E8";
    } // Now I will create the panel.


    this.panel = createElement(this);
    this.style.position = "relative";
    this.style.display = "none"; // I will get the list of menu items from the html element remove from it

    var items = []; // Set parent items in items.

    function setParentItem(item, level, menu) {
      item.level = level;
      var previous = null;

      for (var i = 0; i < item.children.length; i++) {
        if (item.children[i].tagName == "MENU-ITEM-ELEMENT") {
          item.children[i].parent = item;
          previous = item.children[i];
          setParentItem(item.children[i], ++level);
        }
      }
    } // Remove the list of child before reinsert it correctly.


    if (this.items.length == 0) {
      while (this.children.length > 0) {
        var item = this.children[0];
        item.parentNode.removeChild(item);

        if (item.tagName == "MENU-ITEM-ELEMENT") {
          setParentItem(item, 0, this);
          items.push(item);
        }
      }
    }

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      this.appendItem(item);
    }
  }
  /*
   * Append a new Item in the menu panel...
   */
  appendItem(item) {
    this.panel.element.style.display = "";
    var currentPanel = createElement(item);
    this.panel.appendElement(currentPanel);

    if (item.level == 0) {
      // The menu diplayed at the top
      currentPanel.element.style = "font: 11pt/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace; display: inline; position: relative; color: " + this.color + ";";
      item.content = currentPanel;
    } else {
      // Transfest very thing except sub-items.
      currentPanel.element.style = "display: flex; background-color: " + this.background + ";"; // I will move child into dropdown_submenu div.

      var childs = [];

      for (var i = 0; i < currentPanel.element.children.length; i++) {
        var child = currentPanel.element.children[i];

        if (child.tagName != "MENU-ITEM-ELEMENT") {
          child.parentNode.removeChild(child);
          i--; // set back the index to the next element.

          childs.push(child);
        }
      } // Create the submenu div


      item.content = currentPanel.appendElement({
        "tag": "div"
      }).down().appendElement({
        "tag": "div",
        "id": item.id,
        "class": "menu_item_div",
        "style": "display: block; position: relative; z-index: 1; padding: 2px 4px 2px 4px; margin: 1px; min-width: 300px; transition: all .2s ease; position: relative; z-index: 1; padding: 2px 4px 2px 4px; margin: 1px; min-width: 300px; transition: all .2s ease; color: " + this.color + ";"
      }).down(); // separate items from top.

      if (item.separator == true) {
        // Create separator...
        item.content.element.parentNode.style.borderTop = "1px solid " + this.overBackground;
        item.content.element.parentNode.style.marginTop = "3px";
        item.content.element.parentNode.style.paddingTop = "3px";
      } // move child


      for (var i = 0; i < childs.length; i++) {
        item.content.element.appendChild(childs[i]);
      }
    } // set it parent and it panel if it given.
    // Create the item menu and append it sub-items in it.


    item.menu = new DropdownMenuElement();
    item.menu.panel = createElement(item.menu);
    item.menu.parent = item.panel; // Element style.

    var dropdown_submenu_items_style = "display: none;";
    dropdown_submenu_items_style += "position: absolute;";
    dropdown_submenu_items_style += "z-index: 100;";
    dropdown_submenu_items_style += "left: 0px;";
    dropdown_submenu_items_style += "margin-left: 2px;";
    dropdown_submenu_items_style += "margin-top: 2px;";
    dropdown_submenu_items_style += "-webkit-box-shadow: 0px 1px 12px -1px rgba(0, 0, 0, 0.75);";
    dropdown_submenu_items_style += "-moz-box-shadow: 0px 1px 12px -1px rgba(0, 0, 0, 0.75);";
    dropdown_submenu_items_style += "box-shadow: 0px 1px 12px -1px rgba(0, 0, 0, 0.75);"; // Append the subitem panel.

    item.panel = currentPanel.appendElement({
      "tag": "div",
      "class": "dropdown_submenu_items",
      "style": dropdown_submenu_items_style
    }).down();

    item.panel.appendElement(item.menu.panel);

    if (item.level == 0) {

      // In that case the parent will be the body so the menu will never be 
      // hidden by other panel.
      var intersectionObserver = new IntersectionObserver(
        function (itemPanel) {
          return function (entries) {
            if (!entries[0].isIntersecting) {
              itemPanel.style.display = "none"
            }
          }
        }(item.panel.element)
      )

      // Set the observer on the menu itself.
      intersectionObserver.observe(this);

      // append in the body.
      document.body.appendChild(item.panel.element)
      item.panel.element.style.top = "0px"
      document.addEventListener('scroll', function (item, menu) {
        return function(e) {
          var coords = getCoords(menu)
          item.panel.element.style.top = coords.top + menu.offsetHeight + "px"
          item.panel.element.style.left = coords.left + "px"
        }
      }(item, this), true);

    }

    for (var key in item.subItems) {
      item.menu.appendItem(item.subItems[key]);
    } // On mouse enter event


    currentPanel.element.onmouseenter = function (item) {
      return function (evt) {
        evt.stopPropagation();
        var subItemPanels = document.getElementsByClassName("dropdown_submenu_items");

        for (var i = 0; i < subItemPanels.length; i++) {
          subItemPanels[i].style.display = "none";
        }

        if (item.level > 0) {
          // Now I will offset the menu...
          function setVisible(item) {
            item.panel.element.style.display = "block";

            if (item.parent != undefined) {
              setVisible(item.parent);
            }

            if (item.level > 0) {
              item.panel.element.style.left = item.panel.element.parentNode.offsetWidth + "px";
              if (item.panel.element.parentNode.separator == true) {
                item.panel.element.style.top = item.panel.element.parentNode.offsetTop + 7 + "px";
              } else {
                item.panel.element.style.top = item.panel.element.parentNode.offsetTop + "px";
              }
            }

            if (Object.keys(item.subItems).length == 0) {
              item.panel.element.style.display = "none";
            }
          } // Set the item menu visibility...

          setVisible(item);
        }
      };
    }(item); // Now the actions...


    currentPanel.element.onclick = function (item, menu) {
      return function (evt) {
        evt.stopPropagation();

        if (item.level == 0) {
          var coords = getCoords(menu)
          item.panel.element.style.top = coords.top + menu.offsetHeight + "px"
          item.panel.element.style.left = coords.left + "px"
        }

        if (item.panel.element.style.display == "block") {
          item.panel.element.style.display = "none";
        } else {
          item.panel.element.style.display = "block";
          if (item.level >= 1) {// Now I will offset the menu...
            // TODO test if the menu is dsplayed correctly here
            // if it fit on the page.
          }
        }

        if (Object.keys(item.panel.childs).length == 0) {
          subItemPanel.element.style.display = "none";
        }

        if (item.action != undefined) {
          if (isString(item.action)) {
            eval(item.action);
          } else {
            item.action(item.menu);
          }

          function setInvisible(item) {
            item.panel.element.style.display = "none";

            if (item.parent != undefined) {
              setInvisible(item.parent);
            }
          }

          setInvisible(item);
        }
      };
    }(item, this); // On mouse over event.


    item.content.element.onmouseover = function (dropdownMenu, item) {
      return function (evt) {
        evt.stopPropagation(); // In case the separator is define I will not set the background color.

        this.style.backgroundColor = dropdownMenu.overBackground;
        this.style.color = dropdownMenu.overColor;
        this.style.cursor = "pointer";

        function setParent(item) {
          if (item.parent != null) {
            item.parent.content.element.style.backgroundColor = dropdownMenu.overBackground;
            setParent(item.parent);
          }
        }

        setParent(item);
      };
    }(this, item); // On mouse out event.


    item.content.element.onmouseout = function (dropdownMenu, item) {
      return function (evt) {
        evt.stopPropagation();
        this.style.backgroundColor = dropdownMenu.background;
        this.style.color = dropdownMenu.color;
        this.style.cursor = "default";

        function setParent(item) {
          if (item.parent != null) {
            item.parent.content.element.style.backgroundColor = dropdownMenu.background;
            setParent(item.parent);
          }
        }

        setParent(item);
      };
    }(this, item);
  }

}

customElements.define('dropdown-menu-element', DropdownMenuElement);