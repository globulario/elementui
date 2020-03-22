/**
 * That class is use to display a message to a user.
 */
// Polymer dependencies
import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

import { createElement } from "../element.js";
import {fireResize, isString, exportToCsv, getCoords } from "../utility.js";
import '../menu/menuItem.js';
import '../menu/dropdownMenu.js';
import './header.js'; // The maximum allowed number of row for a grid.

var maxRowNumber = 1000;
var lastWidth = 0;

class TableElement extends PolymerElement {
  constructor() {
    super();
    this.rowheight = -1; // in pixel...
    // Keep the position in the data.

    this.index = -1; // Scroll div.

    this.scrollDiv = null; // because some browser limit the number of potential 
    // number of rows in a grid, multiple gids will be use 
    // to display larger table.

    this.tiles = []; // Keep reference of table sorters.

    this.sorters = []; // Keep reference of table filters.

    this.filters = []; // Index of rows that respect the filters.

    this.filtered = {}; // Contain the list index of filtered.

    this.sorted = []; // Contain the array of sorted values.

    this.header = null; // cells are created once and recycled to save
    // browser ressources.

    this.cells = []; // contain the table menu.

    this.menu = null; // Here I will link the body columns whit the  header columns.
    // if the browser support resize observer...
    // Options for the observer (which mutations to observe)

    var config = {
      attributes: true,
      subtree: true
    }; // Create an observer instance linked to the callback function

    var observer = new MutationObserver(function (mutation) {
      if (mutation[0].target.offsetWidth != lastWidth) {
        lastWidth = mutation[0].target.offsetWidth;
        fireResize();
      }
    }); // Start observing the target node for configured mutations

    observer.observe(this, config);
  }
  /**
   * The internal component properties.
   */


  static get properties() {
    return {
      // Tha array of data to display.
      data: Array,
      rowheight: Number,
      order: String,
      refresh: Function,
      onexport: Function,
      ondeleteall: Function,
      ondeletefiltered: Function,
      hidemenu: Boolean,
      width: String
    };
  }

  static get template() {
    return html`
        <style>
            ::slotted(table-header-element) {

            }
        </style>
        <slot></slot>
    `;
  }
  /**
   * Create a new tile in the layout.
   */


  createTiles() {
    this.scrollDiv.element.style.display = ""; // Calculate the number of tile.

    var size = 1;

    if (this.size() > maxRowNumber) {
      size = Math.ceil(this.size() / maxRowNumber);
    }

    this.tiles = []; // Now I will create the tile.

    for (var i = 0; i < size; i++) {
      this.tiles[i] = this.scrollDiv.appendElement({
        "tag": "div",
        "class": "table-tile",
        "style": "grid-gap: 0px; display: grid;"
      }).down(); // Set the number of rows for the tiles.

      // The header with drive the body cell width.
      var gridTemplateColumns = "";
      for(var j=0; j < this.header.getSize(); j++){
        var headerCell = this.header.getHeaderCell(j)
        gridTemplateColumns += headerCell.offsetWidth + "px"
        if(j < this.header.getSize() - 1){
          gridTemplateColumns += " ";
        }
      }

      this.tiles[i].element.style.gridTemplateColumns = gridTemplateColumns;

      // The table column height
      if (i < size - 1 || this.size() % maxRowNumber == 0) {
        this.tiles[i].element.style.gridTemplateRows = "repeat( " + maxRowNumber + ", " + this.rowheight + "px)";
      } else {
        this.tiles[i].element.style.gridTemplateRows = "repeat( " + this.size() % maxRowNumber + ", " + this.rowheight + "px)";
      }
    }

    var resizeListener = function (tiles, scrollDiv, header, table) {
      return function (entry) {
        var value = ""; // Set the last header cell margin larger to move out the scroll bar 
        // out of the way of the last table column.

        var scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        if (header.lastChild.style != null) {
          if (scrollBarWidth > 0) {
            if (header.children[header.children.length - 2].offsetWidth == header.lastChild.offsetWidth) {
              header.lastChild.style.marginRight = scrollBarWidth + "px";
            }
          } else {
            header.lastChild.style.marginRight = "";
          }
        } // Calculate the body column.


        var totalWidth = 0;

        for (var i = 0; i < header.children.length; i++) {
          value += header.children[i].getBoundingClientRect().width + "px";
          totalWidth += header.children[i].getBoundingClientRect().width;

          if (i < header.children.length - 1) {
            value += " ";
          }
        }

        if (totalWidth == 0) {
          return;
        }
        
        // set tiles columns width.
        // Set the table width
        if (table.width == undefined) {
          table.style.width = totalWidth + "px";
          table.width = totalWidth;
        } // set tiles columns width.


        for (var i = 0; i < tiles.length; i++) {
          tiles[i].element.style.gridTemplateColumns = value;
        }

        if (table.menu != undefined) {
          table.style.marginLeft = table.menu.element.offsetWidth + 4 + "px";
          table.menu.element.style.left = -1 * (table.menu.element.offsetWidth + 2) + "px";
        }
      };
    }(this.tiles, this.scrollDiv.element, this.children[0], this);

    window.addEventListener("resize", resizeListener, true);
  } // create the cells once and use it mutitple time.


  createCells() {
    if (this.data.length == 0) {
      return;
    }
    this.cells = []

    var max = Math.ceil(this.clientHeight / this.rowheight);
    if (max == 0 && this.style.maxHeight != undefined) {
      max = Math.ceil(parseInt(this.style.maxHeight.replace("px", "")) / this.rowheight);
    }

    var rowsLength = this.data[0].length;
    for (var i = 0; i < max; i++) {
      for (var j = 0; j < rowsLength; j++) {
        var cell = document.createElement("div");
        cell.className = "table-item";
        cell.style.display = "table";
        cell.style.overflow = "hidden";
        var cellContent = document.createElement("div");
        cellContent.className = "table-item-value";
        cellContent.style.display = "table-cell";
        cellContent.style.overflow = "hidden";
        cell.appendChild(cellContent); // keep the cell as element in the buffer.
        this.cells.push(createElement(cell));
      }
    }
  }

  getScrollWidth(){
    var scrollBarWidth = this.scrollDiv.element.offsetWidth - this.scrollDiv.element.clientWidth;
    return scrollBarWidth
  }

  /**
   * return the current row index.
   */
  getIndex() {
    var index = 0;

    if (this.scrollDiv.element.scrollTop != undefined) {
      index = parseInt(this.scrollDiv.element.scrollTop / this.rowheight);
    }

    return index;
  }

  hasFilter() {
    return this.getFilters().length > 0;
  }
  /**
   * Render 
   */


  render() {
    // first of all I will get the current index.
    var index = this.getIndex();
    var values = this.getFilteredData();

    if (this.index != index) {
      this.index = index; // remove actual tile content.

      for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i].removeAllChilds();
      } // Represent the number of visible items to display, I round it to display entire row.


      var max = Math.ceil(this.clientHeight / this.rowheight); // create cells once.

      if (max == 0 && this.style.maxHeight != undefined) {
        max = Math.ceil(parseInt(this.style.maxHeight.replace("px", "")) / this.rowheight);
      }

      if (this.cells.length == 0) {
        this.createCells();
      }

      if (values.length > 0) {
        var scrollBarWidth = this.scrollDiv.element.offsetWidth - this.scrollDiv.element.clientWidth;

        for (var i = 0; i + this.index < values.length && i < max; i++) {
          // Get the visible tile.
          var tileIndex = parseInt((this.index + i) / maxRowNumber);
          var tile = this.tiles[tileIndex]; // now I will calculate the row index

          var rowIndex = this.index - maxRowNumber * tileIndex + i;
          var size = values[i].length;

          for (var j = 0; j < size; j++) {
            var renderFct = this.header.getHeaderCell(j).onrender;
            var cell = this.cells[i * this.getRowData(i).length + j];
            cell.element.style.gridRow = rowIndex + 1 + " / span 1";
            tile.element.appendChild(cell.element);
            var div = cell.element.children[0];
            var value = values[i + this.index][j]; // reset the div style.

            div.style = "";
            div.innerHTML = ""; // Here I will evalueate render function.

            if (renderFct == null) {
              if (value != undefined) {
                div.innerHTML = value.toString();
              }
            } else {
              var r = i + this.index;

              if (isString(renderFct)) {
                eval(renderFct + "(div , value, r, j)");
              } else {
                renderFct(div, value, r, j); // row, col.
              }
            }

            if (j == size - 1) {
              if (scrollBarWidth > 0) {
                cell.element.style.paddingRight = scrollBarWidth + "px";
              } else {
                cell.element.style.paddingRight = "";
              }
            }
          }
        }
      } else {
        // hide the scroll div.
        this.scrollDiv.element.style.display = "none";
      }
    }
  }
  /**
   * That function is call when the table is ready to be diplay.
   */


  ready() {
    super.ready(); // The position.

    this.style.position = "relative"; // first of all i will index the data rows.

    for (var i = 0; i < this.data.length; i++) {
      // Keep the index in the row itself.
      this.data[i].index = i;
    }

    this.header = this.children[0];

    for (var i = 0; i < this.header.children.length; i++) {
      for (var j = 0; j < this.header.children[i].children.length; j++) {
        if (this.header.children[i].children[j].tagName == "TABLE-SORTER-ELEMENT") {
          var sorter = this.header.children[i].children[j];
          sorter.childSorter = null;

          if (sorter.state != undefined) {
            if (sorter.state != 0) {
              this.sorters[sorter.order - 1] = sorter;
            }
          }

          sorter.index = this.sorters.length; // push the sorter into the array.

          this.sorters.push(sorter);
        } else if (this.header.children[i].children[j].tagName == "TABLE-FILTER-ELEMENT") {
          var filter = this.header.children[i].children[j];
          filter.index = this.filters.length;
          this.filters.push(filter);
        }
      } // Now I will set the data type.


      if (this.header.children[i].typename == undefined) {
        for (var j = 0; j < this.data.length; j++) {
          if (this.data[j][i] != null) {
            this.header.children[i].typename = typeof this.data[j][i];
            break;
          }
        }
      }
    } // Here I will create the table dropdown menu.


    if (!this.hidemenu) {
      this.menu = createElement(null, {
        "tag": "dropdown-menu-element"
      });
      
      this.menu.appendElement({
        "tag": "menu-item-element",
        "id": "item-0"
      }).down().appendElement({
        "tag": "iron-icon",
        "icon": "menu"
      }) // Remove all sorting menu.
      .appendElement({
        "tag": "menu-item-element",
        "id": "unorder-menu-item",
        "style": "text-agling: left;",
        "action": ""
      }).down().appendElement({
        "tag": "iron-icon",
        "icon": "sort",
        "style": "height: 18px; width: 18px"
      }).appendElement({
        "tag": "span",
        "innerHtml": "remove all sorter",
        "style": "margin-left: 10px;"
      }).up() // Now filetering
      .appendElement({
        "tag": "menu-item-element",
        "id": "filter-menu-item",
        "style": "text-agling: left;"
      }).down().appendElement({
        "tag": "iron-icon",
        "id": "filter-menu-item-icon",
        "icon": "filter-list",
        "style": "height: 18px; width: 18px"
      }).appendElement({
        "tag": "span",
        "id": "filter-menu-item-span",
        "innerHtml": "filtering",
        "style": "margin-left: 10px;"
      }) // Remove all filter
      .appendElement({
        "tag": "menu-item-element",
        "id": "unfilter-menu-item",
        "style": "text-agling: left;",
        "action": ""
      }).down().appendElement({
        "tag": "span",
        "innerHtml": "remove all filter",
        "style": "margin-left: 10px;"
      }).up().appendElement({
        "tag": "menu-item-element",
        "separator": "true",
        "style": "text-agling: left;"
      }).down().appendElement({
        "tag": "div",
        "id": "filter-menu-items",
        "style": "text-agling: left; display: flex; flex-direction: column;"
      }).up().up() // The export menu button.
      .appendElement({
        "tag": "menu-item-element",
        "separator": "true",
        "style": "text-agling: left;"
      }) // Delete filetered values
      .appendElement({
        "tag": "menu-item-element",
        "id": "delete-filtere-menu-item",
        "style": "text-agling: left;",
        "action": this.ondeletefiltered
      }).down().appendElement({
        "tag": "iron-icon",
        "icon": "delete",
        "style": "height: 18px; width: 18px"
      }).appendElement({
        "tag": "span",
        "innerHtml": "delete filtered",
        "style": "margin-left: 10px;"
      }).up()
      .appendElement({
        "tag": "menu-item-element",
        "separator": "true",
        "style": "text-agling: left;"
      }) // Delete filetered values
      .appendElement({
        "tag": "menu-item-element",
        "id": "delete-all-data-menu-item",
        "style": "text-agling: left;",
        "action": this.ondeleteall
      }).down().appendElement({
        "tag": "iron-icon",
        "icon": "delete",
        "style": "height: 18px; width: 18px"
      }).appendElement({
        "tag": "span",
        "innerHtml": "delete all data",
        "style": "margin-left: 10px;"
      }).up()
      .appendElement({
        "tag": "menu-item-element",
        "separator": "true",
        "style": "text-agling: left;"
      }) // Export csv file
      .appendElement({
        "tag": "menu-item-element",
        "id": "export-menu-item",
        "style": "text-agling: left;",
        "action": this.onexport
      }).down().appendElement({
        "tag": "iron-icon",
        "icon": "file-download",
        "style": "height: 18px; width: 18px"
      }).appendElement({
        "tag": "span",
        "innerHtml": "export",
        "style": "margin-left: 10px;"
      }); // Set the menu
      // Append the element in the body so it will alway be visible.

      this.appendChild(this.menu.element);
      this.menu.element.style.position = "absolute"; // In that case I will overide the menu action.

      this.style.marginLeft = this.menu.element.offsetWidth + 4 + "px";
      this.menu.element.style.left = -1 * (this.menu.element.offsetWidth + 2) + "px"; // Make the table resize when it display.

      var intersectionObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          //entries[0].target.refresh()
          fireResize();
        }
      }); // Set the observer on the menu itself.

      intersectionObserver.observe(this); // append in the body.

      if (this.onexport == undefined) {
        // export csv file by default.
        this.menu.getChildById("export-menu-item").element.action = function (table) {
          return function () {
            // Here I will get the filtered data.
            if (Object.keys(table.filtered).length > 0) {
              exportToCsv("data.csv", Object.values(table.filtered));
            } else {
              exportToCsv("data.csv", table.data);
            }
          };
        }(this);
      } // Remove the ordering


      this.menu.getChildById("unorder-menu-item").element.action = function (table) {
        return function () {
          for (var i = 0; i < table.sorters.length; i++) {
            var sorter = table.sorters[i];
            sorter.childSorter = null;
            sorter.state = undefined;
            sorter.unset();
          } // sort the table.


          table.sort();
          table.refresh(); // refresh the result.
        };
      }(this); // Renove the filtering


      this.menu.getChildById("unfilter-menu-item").element.action = function (table) {
        return function () {
          // Now I will remove all filters...
          for (var i = 0; i < table.filters.length; i++) {
            if (table.filters[i].filter != null) {
              if (table.filters[i].filter.expressions.length > 0 || table.filters[i].filter.filters.length > 0) {
                table.filters[i].filter.clear();
              }
            }
          }

          table.filter();
          table.refresh(); // refresh the result.
        };
      }(this);
    } // Fix the style of the element.

    this.menu.getChildById("delete-filtere-menu-item").element.style.display = "none"
    this.menu.getChildById("delete-all-data-menu-item").element.style.display = "none"

    this.style.display = "flex";
    this.style.flexDirection = "column"; // Create the body of table after the header...

    this.scrollDiv = createElement(this.insertBefore(document.createElement("div"), this.children[1]));
    this.scrollDiv.element.style.overflowY = "auto"; // Display scroll as needed.

    this.scrollDiv.element.style.overflowX = "hidden"; // Display scroll as needed.

    this.scrollDiv.element.scrollTop = 0; // if now row height are given i will take the header heigth as default.

    if (this.rowheight == -1) {
      this.rowheight = this.children[0].offsetHeight;
    } // If the header is fixed I will translate it to keep it 
    // at the required position.


    this.scrollDiv.element.addEventListener("scroll", function (table) {
      return function (e) {
        var header = table.children[0]; // If the header is fixe I will

        if (header.fixed) {
          if (this.scrollTop != 0) {
            header.style.boxShadow = "0 3px 5px rgba(57, 63, 72, 0.5)";
          } else {
            header.style.boxShadow = "";
          }
        } // render the table.


        table.render();
      };
    }(this));
    this.refresh();
  }
  /**
   * Redraw all tile and values.
   */


  refresh() {
    // reset the index.
    this.index = -1; // remove acutal rows.

    this.scrollDiv.removeAllChilds(); // Recreate tiles

    this.createTiles(); // Redisplay values.

    this.render();
  } //////////////////////////////////////////////////////////////////////////////////////
  // Data access function.
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Return the table data.
   */


  getData() {
    if (this.data == undefined) {
      return [];
    }

    return this.data;
  }
  /**
   * Return the filtered data only.
   */


  getFilteredData() {
    // if no filter applied...
    if (Object.keys(this.filtered).length == 0) {
      if (this.getFilters().length > 0) {
        return []; // all data are filtered.
      }

      return this.data;
    } // So here if there sorter define I will made use of this.sorted to keep value.


    if (this.getSorters().length > 0) {
      if (this.sorted == 0) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.filtered[this.data[i].index] != undefined) {
            this.sorted.push(this.data[i]);
          }
        }
      } // return the list of sorted and filtered values.


      return this.sorted;
    } // Return the list of all filtered values.


    return Object.values(this.filtered);
  }
  /**
   * Return the data contain at given position.
   * @param {*} row The table row
   * @param {*} column The table column.
   */


  getDataAt(row, column) {
    if (this.data == undefined) {
      return [];
    }

    return this.data[row][column];
  }
  /**
   * Return the data for a given index.
   * @param {} index 
   */


  getRowData(index) {
    if (this.getData() == undefined) {
      return [];
    }

    return this.data[index];
  }
  /**
   * Return all data for a given column
   * @param {*} index The column index.
   */


  getColumnData(index) {
    var data = [];

    if (this.getData() != undefined) {
      for (var i = 0; i < this.getData().length; i++) {
        data.push({
          "value": this.getData()[i][index],
          "index": this.getData()[i].index
        });
      }
    }

    return data;
  }

  getFilteredColumnData(index) {
    if (Object.keys(this.filtered).length == 0) {
      if (this.getFilters().length > 0) {
        return []; // all data are filtered.
      }

      return this.data;
    }

    var data = [];

    if (this.getData() != undefined) {
      for (var i in this.filtered) {
        data.push({
          // push the filtered values.
          "value": this.filtered[i][index],
          "index": this.filtered[i].index
        });
      }
    }

    return data;
  }
  /**
   * Return the visible data size.
   */


  size() {
    // if filter are applied.
    if (Object.keys(this.filtered).length > 0) {
      return Object.keys(this.filtered).length;
    } else if (this.hasFilter()) {
      return 0; // all filtered.
    }

    return this.getData().length;
  }
  /**
   * Return the list of sorter.
   */


  getSorters() {
    var sorters = new Array(); // reset data order.

    for (var i = 0; i < this.sorters.length; i++) {
      var sorter = this.sorters[i];
      sorter.childSorter = null;

      if (sorter.state != undefined) {
        if (sorter.state != 0) {
          sorters[sorter.order - 1] = sorter;
        }
      }
    }

    return sorters;
  }
  /**
   * Order a table. 
   * @param {*} side can be asc, desc or nothing.
   */


  sort() {
    this.data.sort(function (a, b) {
      var indexA = parseInt(a.index);
      var indexB = parseInt(b.index);
      return indexA - indexB;
    }); // empty the sorted list.

    this.sorted = [];
    var sorters = this.getSorters(); // I will copy values of rows to keep the original order...
    // reset to default...

    if (sorters.length > 0) {
      // Link the sorter with each other...
      for (var i = 0; i < sorters.length - 1; i++) {
        sorters[i].childSorter = sorters[i + 1];
      } // Now I will call sort on the first sorter...


      if (sorters[0].state != 0) {
        sorters[0].sortValues(this.data);
      }
    }
  }
  /**
   * Return the list of active filters.
   */


  getFilters() {
    var filters = []; // put all filter in the save array.

    for (var i = 0; i < this.filters.length; i++) {
      if (this.filters[i].filter != null) {
        if (this.filters[i].filter.expressions.length > 0 || this.filters[i].filter.filters.length > 0) {
          filters.push(this.filters[i].filter);
        }
      }
    }

    return filters;
  }
  /**
   * Filter table values.
   */


  filter() {
    // so here I will empty the filtered map.
    this.filtered = {}; // Get the filters

    var filters = this.getFilters();

    function getData(table, indexs) {
      var filtered = {};

      for (var i = 0; i < indexs.length; i++) {
        filtered[indexs[i]] = table.getRowData(indexs[i]);
      }

      return filtered;
    } // filters are cumulative from column to columns.


    if (filters.length > 0) {
      this.filtered = getData(this, filters[0].evaluate());

      if (filters.length > 1) {
        for (var i = 1; i < filters.length; i++) {
          for (var i = 1; i < filters.length; i++) {
            var filtered = getData(this, filters[i].evaluate());
            var filtered_ = {};

            for (var id in filtered) {
              if (this.filtered[id] != undefined) {
                filtered_[id] = this.filtered[id];
              }
            }

            this.filtered = filtered_;
          }
        }
      } else {
        this.filtered = getData(this, filters[0].evaluate());
      }
    } // Now I will set the filter in the menu.


    if (!this.hidefilter) {
      var filterMenuItems = this.menu.getChildById("filter-menu-items");
      filterMenuItems.element.parentNode.addEventListener("mouseover", function () {
        this.style.backgroundColor = "";
      }); // hidden by default.
      // Here I will remove existing filer and expression and recreated it.

      filterMenuItems.removeAllChilds();

      for (var i = 0; i < filters.length; i++) {
        // So here I will create the menu item asscoiated with each filter and given.
        var filter = filters[i];

        if (filter.expressions.length > 0 || filter.filters.length > 0) {
          var filterMenuDiv = filterMenuItems.appendElement({
            "tag": "div",
            "style": "display: flex; justify-items: center; align-items: center;"
          }).down();
          this.deleteBtn = filterMenuDiv.appendElement({
            "tag": "paper-icon-button",
            "icon": "close",
            "style": "height: 18px; width: 18px; padding: 1px;"
          }).down();
          filterMenuDiv.appendElement({
            "tag": "div",
            "style": "padding-left: 5px;",
            "innerHtml": filter.parent.headerCell.innerText
          });

          filterMenuDiv.element.onmouseover = function () {
            this.style.backgroundColor = "rgb(232, 232, 232)";
          };

          filterMenuDiv.element.onmouseout = function () {
            this.style.backgroundColor = "";
          };

          this.deleteBtn.element.onclick = function (filter, filterMenuItems, filterMenuDiv, table) {
            return function () {
              filterMenuItems.removeElement(filterMenuDiv);
              filter.clearFileterBtn.element.click();
              table.filter();
              table.refresh();
            };
          }(filter, filterMenuItems, filterMenuDiv, this);
        }
      }
    } // In that case I will call the onfilter event.


    for (var i = 0; i < this.filters.length; i++) {
      if (this.filters[i].filter != null) {
        if (this.filters[i].onfilter != undefined) {
          // Call the render function with div and value as parameter.
          var values = this.filters[i].filter.getFilterdValues();

          if (isString(this.filters[i].onfilter)) {
            eval(this.filters[i].onfilter + "(values)");
          } else {
            this.filters[i].onfilter(values);
          }
        }
      }
    }
  }

}

customElements.define('table-element', TableElement);