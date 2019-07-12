// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

import { createElement } from "../element.js";
import { randomUUID, fireResize, getCoords } from "../utility.js";

class TableSorterElement extends PolymerElement {
  constructor() {
    super();
    /** The parent table */

    this.table = null;
    /* The column index **/

    this.index = 0;
    /* Child sorter, recursive... **/

    this.childSorter = null;
    /*
     * The state can be 0 nothing, 1 asc or 2 desc
     * @type {number}
     */

    this.state = 0;
    this.order = 0;
    this.orderDiv = null;
    this.ascSortBtn = null;
    this.descSortBtn = null;
  }
  /**
   * The internal component properties.
   */
  static get template() {
    return html`
      <style>
          #div-selector {
            display: flex; 
            flex-direction: column;
            font-size: 10pt; 
            justify-items: center; 
            align-items: center;
            position: absolute;
            top: 0px;
            left: 0px;
            color: white;
            z-index: 100;
        }

        #div-selector:hover{
          cursor: pointer;
        }

      </style>
      <div id="div-selector" style="display: none;">
            <iron-icon id="ascSortBtn" icon="expand-less" style="height: 18px;"></iron-icon>
            <iron-icon id="descSortBtn" icon="expand-more" style="height: 18px;"></iron-icon>
            <div id="order-div"></div>
      </div>
    `
  }

  static get properties() {
    return {
      /**
       * Sort function with the form sort(a, b)
       */
      sort: Function
    };
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    super.ready(); // Here I will create the sorte selection div.

    var div = this.shadowRoot.getElementById("div-selector")
    div.style.boxShadow ="0px 1px 12px -1px rgba(0,0,0,0.75)"

    this.table = this.parentNode.parentNode.parentNode;
    this.header = this.parentNode.parentNode;
    this.headerCell = this.parentNode;

    this.orderDiv = this.shadowRoot.getElementById("order-div");
    this.ascSortBtn = this.shadowRoot.getElementById("ascSortBtn");
    this.descSortBtn =this.shadowRoot.getElementById("descSortBtn");

    this.headerCell.style.position = "relative";
    this.headerCell.style.paddingLeft = "35px"; // The component will be absolute.

    var color = window.getComputedStyle(this.header, null).getPropertyValue('background-color');
    div.style.backgroundColor = color; // Set when clicked.

    this.ascSortBtn.isSet = false;
    this.descSortBtn.isSet = false; // Set the resize handler.

    this.parentNode.addEventListener("mouseover", function (div, sorter) {
      return function (e) {
        e.stopPropagation();
        if (sorter.orderDiv.innerHTML == "") {
          div.style.display = "flex";
        }
      };
    }(div, this)); // Keep the div active.

    this.parentNode.addEventListener("mouseout", function (sorter, div) {
      return function (e) {
        e.stopPropagation();
        if (sorter.orderDiv.innerHTML == "" && sorter.ascSortBtn.isSet == false && sorter.descSortBtn.isSet == false) {
          div.style.display = "none";
        }
      };
    }(this, div)); // Now the button events.


    this.descSortBtn.onclick = function (sorter, div) {
      return function () {
        if (sorter.ascSortBtn.isSet == false && this.isSet == false) {
          // Start ordering.
          this.style.display = "";
          sorter.ascSortBtn.style.display = "none";
          this.isSet = true;
          sorter.state = 2;
          div.style.flexDirection = "row";
          div.style.boxShadow =""
        } else if (sorter.ascSortBtn.isSet == false && this.isSet == true) {
          this.style.display = "none";
          sorter.ascSortBtn.style.display = "";
          sorter.ascSortBtn.isSet = true;
          sorter.state = 1;
          div.style.flexDirection = "row";
          div.style.boxShadow =""
        } else {
          this.style.display = "";
          sorter.ascSortBtn.style.display = "";
          sorter.orderDiv.innerHTML = "";
          this.isSet = false;
          sorter.ascSortBtn.isSet = false;
          sorter.state = 0;
          div.style.flexDirection = "column";
          div.style.boxShadow ="0px 1px 12px -1px rgba(0,0,0,0.75)"
        } // In case the sorter is set it container must be the sorter.
        sorter.setOrder();
      };
    }(this, div);

    this.ascSortBtn.onclick = function (sorter, div) {
      return function () {
        if (sorter.descSortBtn.isSet == false && this.isSet == false) {
          // Start ordering.
          this.style.display = "";
          sorter.descSortBtn.style.display = "none";
          this.isSet = true;
          sorter.state = 1;
          div.style.flexDirection = "row";
          div.style.boxShadow =""
        } else if (sorter.descSortBtn.isSet == false && this.isSet == true) {
          this.style.display = "none";
          sorter.descSortBtn.style.display = "";
          sorter.descSortBtn.isSet = true;
          sorter.state = 2;
          div.style.flexDirection = "row";
          div.style.boxShadow =""
        } else {
          this.style.display = "";
          sorter.descSortBtn.style.display = "";
          sorter.orderDiv.innerHTML = "";
          this.isSet = false;
          sorter.descSortBtn.isSet = false;
          sorter.state = 0;
          div.style.flexDirection = "column";
          div.style.boxShadow ="0px 1px 12px -1px rgba(0,0,0,0.75)"
        } // In case the sorter is set it container must be the sorter.
        sorter.setOrder();
      };
    }(this, div); // The onmouse over event...

    this.descSortBtn.onmouseover = this.ascSortBtn.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.descSortBtn.onmouseout = this.ascSortBtn.onmouseout = function () {
      this.style.cursor = "default";
    }; // Now the onclick event.


    this.descSortBtn.onmouseover = this.ascSortBtn.onmouseover = function () {
      this.style.cursor = "pointer";
    };

    this.descSortBtn.onmouseout = this.ascSortBtn.onmouseout = function () {
      this.style.cursor = "default";
    }; // Funtion to remove the order programatically.

    this.unset = function (sorter, div) {
      return function () {
        // not display the order.
        sorter.orderDiv.innerHTML = ""
        div.style.flexDirection = "column";
        div.style.boxShadow ="0px 1px 12px -1px rgba(0,0,0,0.75)"
        div.style.display ="none"
        sorter.ascSortBtn.style.display = "";
        sorter.descSortBtn.style.display = "";
        sorter.ascSortBtn.isSet = false;
        sorter.descSortBtn.isSet = false;
        sorter.state = 0;
        sorter.setOrder();
      };
    }(this, div);
  }

  /**
  * Sort values.
  * @params values The values to sort.
  */
  sortValues(values) {
    // Sort each array...
    values.sort(function (sorter) {
      return function (row1, row2) {
        // get the tow values.
        var value1 = row1[sorter.index];
        var value2 = row2[sorter.index]; // If the sort function is set I will use it

        if (sorter.sort != undefined) {
          return sorter.sort(value1, value2);
        } else {
          // In that case I will use the default sort function.
          if (typeof value1 == "string") {
            value1.trim().toUpperCase();
          }

          if (typeof value2 == "string") {
            value2.trim().toUpperCase();
          }

          if (sorter.state == 2) {
            // asc
            if (value1 < value2) return -1;
            if (value1 > value2) return 1;
            return 0;
          } else {
            // desc
            if (value1 > value2) return -1;
            if (value1 < value2) return 1;
            return 0;
          }
        }

        return 0;
      };
    }(this)); // find same values and make it filter by the child sorter...

    if (this.childSorter != null) {
      var sameValueIndex = -1;
      var i;

      for (i = 1; i < values.length; i++) {
        var value1 = values[i - 1][this.index];
        var value2 = values[i][this.index]; // Here I will convert the value to string befor compare it.

        if (value1.toString() == value2.toString()) {
          if (sameValueIndex == -1) {
            sameValueIndex = i - 1;
          }
        } else {
          if (sameValueIndex != -1) {
            // sort the values...
            var slice = values.slice(sameValueIndex, i);
            this.childSorter.sortValues(slice); // put back the value in the values...

            for (var j = 0; j < slice.length; j++) {
              values[sameValueIndex + j] = slice[j];
            }

            sameValueIndex = -1;
          }
        }
      } // The last slice.


      if (i != sameValueIndex) {
        var slice = values.slice(sameValueIndex, i);
        this.childSorter.sortValues(slice); // put back the value in the values...

        for (var j = 0; j < slice.length; j++) {
          values[sameValueIndex + j] = slice[j];
        }
      }
    }
  }
  /**
   * The the table sorter order.
   */


  setOrder() {
    // Now I need to update order value...
    var activeSorter = new Array();

    for (var s in this.table.sorters) {
      if (this.table.sorters[s].state != undefined) {
        if (this.table.sorters[s].state != 0) {
          activeSorter[this.table.sorters[s].order] = this.table.sorters[s];
        }
      }
    }

    if (this.state != 0 && this.order == 0) {
      // Here I need to set the index
      this.order = Object.keys(activeSorter).length;
      this.orderDiv.innerHTML = this.order.toString();
    } else if (this.state == 0) {
      this.order = 0;
      this.orderDiv.innerHTML = "";
      var index = 1;
      for (var i = 1; i < activeSorter.length; i++) {
        if (activeSorter[i] != undefined) {
          activeSorter[i].order = index;
          activeSorter[i].orderDiv.innerHTML = activeSorter[i].order.toString();
          index++;
        }
      }
    } // Apply filter sorter and refresh.


    this.table.sort();
    this.table.refresh();
    fireResize();
  }

}

customElements.define('table-sorter-element', TableSorterElement);