// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';

import { createElement } from "../element.js";
import { parseFunction, isString } from "../utility.js";
/**
 * Tab element.
 */

class TabElement extends PolymerElement {
  constructor() {
    super();
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      title: String,
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
    super.ready();
    this.classList = "tab";
  }

}

customElements.define('tab-element', TabElement);
/**
 * Contain a list of tab.
 */

class TabPanelElement extends PolymerElement {
  constructor() {
    super();
    this.panel = null;
    this.header = null;
    this.tabsDiv = null;
    this.content = null;
    this.closeBtn = null;
    this.refreshBtn = null; // The list of tabs.

    this.tabs = {};
    this.activeTab = null;
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      selected: Number,
      maxlength: Number,
      scrollable: Boolean,
      closeable: Boolean,
      refreshable: Boolean,
      onclosetab: Function,
      onrefresh: Function,
      onsettab: Function
    };
  }

  static get template() {
    return html`
            <style>
                .tab {
                    color: lightgrey; padding: 0px 5px 0px 5px; vertical-align: middle;
                }
                
                .tab.active{
                    color: #657383;
                    border-bottom: rgb(51, 103, 214)  2px solid ;
                    border-top: none;
                    -webkit-box-shadow: 0px -1px 5px 0px rgba(0,0,0,0.35);
                    -moz-box-shadow: 0px -1px 5px 0px rgba(0,0,0,0.35);
                    box-shadow: 0px -1px 5px 0px rgba(0,0,0,0.35);
                    background-color: white;
                }
                
                .tab.active:hover{
                    color: #657383;
                    border-bottom: rgb(51, 103, 214)  2px solid ;
                    border-top: none;
                }
                
                .tab:hover{
                    color: #657383;
                    border: 1px solid lightgrey;
                    cursor: pointer;
                }

                .tab-panel{
                    display: flex;
                    align-items: center;
                    justify-items: center;
                    border-spacing:2px 5px;
                    text-align: left;
                    color: #657383;
                    padding: 15px;
                }
                
                .tab-panel label{
                    padding-left: 5px;
                }
                
                .tab-panel span{
                    padding-left: 5px;
                }
            </style>
            <slot></slot>
    `;
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    super.ready(); // I will get list 

    if (this.maxlength == undefined) {
      this.maxlength = 30
    }

    this.classList = "tab-panel";
    var index = 0; // Remove the actual tab from the display

    while (this.children.length > 0) {
      var tab = this.children[0];
      this.removeChild(tab); // renove from the dom and create the tab from it.

      this.tabs[index] = tab; // keep it in memory.

      index++;
    } // Now I will append the tab header div.


    this.style.display = "flex";
    this.style.flexDirection = "column";
    this.style.height = "100%";
    this.panel = createElement(this);
    this.header = this.panel.appendElement({
      "tag": "div",
      "style": "display: none; width: 100%; border-bottom: 1px solid lightgray; background-color: white; min-height: 40px;"
    }).down(); // The content can be scrollable.

    this.tabsDiv = this.header.appendElement({ "tag": "div", "style": "display: flex;" }).down()

    this.content = this.panel.appendElement({
      "tag": "div",
      "style": "flex: 1; width: 100%; height: 100%;"
    }).down();

    if (this.scrollable) {
      this.content.style.overflowY = "scroll";
    } // append it to the display


    for (var index in this.tabs) {
      this.appendTab(this.tabs[index], index);
    } // show the selected tab.


    if (this.selected == undefined) {
      this.selected = 0;
    }

    this.showTab(this.selected); // If tabs are closeabe.

    this.buttons = this.header.appendElement({
      "tag": "div",
      "style": "flex: 1; text-align: right;"
    }).down();

    if (this.refreshable != undefined) {
      this.refreshBtn = this.buttons.appendElement({
        "tag": "paper-icon-button",
        "icon": "refresh"
      }).down();

      if (this.onrefresh != null) {
        var onrefresh
        // set the refresh listener
        if(isString(this.onrefresh )){
          onrefresh = parseFunction(this.onrefresh);
        }else{
          onrefresh = this.onrefresh;
        }

        this.refreshBtn.element.onclick = function (tabPanel, onrefresh) {
          return function () {
            // call the refresh function whit the active tab.
            onrefresh(tabPanel.activeTab);
          };
        }(this, onrefresh);
      }
    }

    if (this.closeable != undefined) {
      this.closeBtn = this.buttons.appendElement({
        "tag": "paper-icon-button",
        "icon": "clear"
      }).down(); // set the on close listner.

      if (this.onclosetab != null) {
        var onclose
        if(isString(this.onclosetab )){
          onclose = parseFunction(this.onclosetab);
        }else{
          onclose = this.onclosetab;
        }

        this.closeBtn.element.onclick = function (onclose, tabPanel) {
          return function () {
            // call the user defined action.
            onclose();
            tabPanel.closeActiveTab();
          };
        }(onclose, this);
      } else {
        this.closeBtn.element.onclick = function (tabPanel) {
          return function () {
            tabPanel.closeActiveTab();
          };
        }(this);
      }
    }
  }

  /**
   * Return the active tab.
   */
  getActiveTab(){
    return this.activeTab;
  }

  /**
   * Append a button to the existing button at given index.
   * @param {*} btn 
   * @param {*} index 
   */
  appendButton(btn, index) {
    if (index != undefined) {
      if (this.buttons.element.children[index] != undefined) {
        this.buttons.element.insertBefore(btn, this.buttons.element.children[index]);
      }
    }else{
      this.buttons.element.appendChild(btn)
    }
  }

  /**
   * Append a new tab to the panel.
   */


  appendTab(tab, index) {

    tab.btn = this.tabsDiv.appendElement({
      "tag": "div",
      "class": "button raised grey narrow",
      "style": "position: relative; min-width: 50px; color: red; display: flex; align-items: center; color: lightgrey; min-height: 30px;  padding: 0px 10px 0px 10px;"
    }).down();

    tab.btn.appendElement({
      "tag": "paper-ripple",
      "style": "color: rgb(51, 103, 214);"
    });

    var title = tab.title
    if (title.length > this.maxlength) {
      title = title.substring(0, this.maxlength) + "..."
    }

    tab.btn.title = tab.btn.appendElement({
      "tag": "span",
      "style": "flex: 1; text-align: center;",
      "tilte": tab.title,
      "innerHtml": title
    });

    tab.content = this.content.appendElement({ "tag": "div" }).down();
    if (tab.children != undefined) {
      if (tab.children.length > 0) {
        tab.content.element = tab.children[0]
        tab.display = tab.children[0].style.display
        this.content.element.appendChild(tab.content.element)
      }
    }

    tab.btn.element.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    tab.btn.element.onmouseout = function () {
      this.style.cursor = "default";
    };

    if (index != undefined) {
      this.tabs[index] = tab
      tab.index = index;
    } else {
      index = Object.keys(this.tabs).length
      tab.index = index
      this.tabs[index] = tab
    }

    tab.btn.element.onclick = function (tabPanel, tab) {
      return function () {
        // Show the tab.
        tabPanel.showTab(tab.index);
      };
    }(this, tab);

    this.header.element.style.display = "flex"

    this.showTab(index)
  }
  /**
   * Close the active tab.
   */


  closeActiveTab() {

    if (this.activeTab == null) {
      return;
    }

    var activeIndex = this.activeTab.index;

    if (this.activeTab != null) {
      delete this.tabs[this.activeTab.index];
      this.activeTab.content.element.parentNode.removeChild(this.activeTab.content.element);
      this.activeTab.btn.element.parentNode.removeChild(this.activeTab.btn.element);
    }

    var tabs = {};

    for (var i = 0; i < Object.keys(this.tabs).length; i++) {
      this.tabs[Object.keys(this.tabs)[i]].index = i;
      tabs[i] = this.tabs[Object.keys(this.tabs)[i]];
    }

    this.tabs = tabs; // activate the tab.

    if (activeIndex < Object.keys(this.tabs).length) {
      this.showTab(activeIndex);
    } else if (Object.keys(this.tabs).length > 0) {
      this.showTab(activeIndex - 1);
    } else {
      this.activeTab = null;
    }

    if (Object.keys(this.tabs).length == 0) {
      this.header.element.style.display = "none"
    }

  }
  /**
   * Display a given tab at given index.
   * @param {*} tab 
   */


  showTab(index) {
    if (Object.keys(this.tabs).length == 0) {
      return;
    }

    for (var i in this.tabs) {
      this.hideTab(i);
    }

    this.tabs[index].content.element.style.display = this.tabs[index].display;
    this.tabs[index].content.element.style.color = ""; // I will set the button as active.

    this.tabs[index].btn.element.style.borderBottom = "2px solid rgb(51, 103, 214)";
    this.tabs[index].btn.title.element.style.color = "#212121";
    this.activeTab = this.tabs[index];

    if (this.onsettab != undefined) {
      var onsettab
      if(isString(this.onsettab )){
        onsettab = parseFunction(this.onsettab);
      }else{
        onsettab = this.onsettab;
      }
      
      onsettab(this.activeTab)
    }
  }
  /**
   * Display a given tab at given index.
   * @param {*} tab 
   */
  hideTab(index) {
    if (this.tabs != undefined) {
      if (Object.keys(this.tabs).length == 0) {
        return;
      }

      if (this.tabs[index].btn != undefined) {
        this.tabs[index].btn.element.style.borderBottom = "";
        this.tabs[index].content.element.style.display = "none";
        this.tabs[index].btn.title.element.style.color = "lightgrey";
      }
    }
  }

}

customElements.define('tab-panel-element', TabPanelElement);