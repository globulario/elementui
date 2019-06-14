// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';

// List of imported functionality.
import { createElement } from "../element.js"
import { randomUUID, fireResize, getCoords } from "../utility.js"

class TableSorterElement extends PolymerElement {
    constructor() {
        super();

        /** The parent table */
        this.table = null

        /* The column index **/
        this.index = 0;

        /* Child sorter, recursive... **/
        this.childSorter = null;

        /*
         * The state can be 0 nothing, 1 asc or 2 desc
         * @type {number}
         */
        this.state = 0
        this.order = 0
        this.orderDiv = null
    }

    /**
     * The internal component properties.
     */
    static get properties() {
        return {
            /**
             * Sort function with the form sort(a, b)
             */
            sort: Function
        }
    }

    /**
     * That function is call when the table is ready to be diplay.
     */
    ready() {

        super.ready();

        // Here I will create the sorte selection div.
        var div = document.createElement("div")
        div.id = "div-selector"
        div.style = `
                    display: flex; 
                    font-size: 10pt; 
                    justify-items: center; 
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    color: white;
                    `

        div.innerHTML = `
            <div style=""></div>
            <div style="display: none; flex-direction: column;">
                <iron-icon id="ascSortBtn" icon="expand-less" style="height: 18px;"></iron-icon>
                <iron-icon "descSortBtn" icon="expand-more" style="height: 18px;"></iron-icon>
            </div>

        <style>
            body>#div-selector {
                -webkit-box-shadow: 0px 1px 12px -1px rgba(0,0,0,0.75);
                -moz-box-shadow: 0px 1px 12px -1px rgba(0,0,0,0.75);
                box-shadow: 0px 1px 12px -1px rgba(0,0,0,0.75);
            }
        </style>
        `

        document.body.appendChild(div)

        // set various reference here.
        this.table = this.parentNode.parentNode.parentNode
        this.header = this.parentNode.parentNode
        this.headerCell = this.parentNode
        this.orderDiv = div.children[0]
        var ascSortBtn = div.children[1].children[0]
        var descSortBtn = div.children[1].children[1]

        this.headerCell.style.position = "relative"
        this.headerCell.style.paddingLeft = "35px"

        // The component will be absolute.
        this.style.position = "absolute"
        this.style.left = "5px"

        // Set the div style.
        var color = window.getComputedStyle(this.header, null).getPropertyValue('background-color')
        div.style.backgroundColor = color

        // Set when clicked.
        ascSortBtn.isSet = false;
        descSortBtn.isSet = false;

        // Set the resize handler.
        window.addEventListener("resize",
            function (sorter, div) {
                return function () {
                    var elemRect = getCoords(sorter.parentNode)
                    var top = elemRect.top + 1;
                    div.style.top = top + "px";
                    div.style.left = elemRect.left + 1 + "px";
                }
            }(this, div))

        // Display the table sorter.
        this.parentNode.addEventListener("mouseover", function (div, sorter) {
            return function (e) {
                e.stopPropagation()
                if (div.children[1].style.display == "none") {
                    div.children[1].style.display = "flex"
                }
            }
        }(div, this))

        // Keep the div active.
        div.onmouseover = function (sorter) {
            return function () {
                this.children[1].style.display = "flex"
            }
        }(this)

        div.onmouseout = function (sorter) {
            return function () {
                if (this.parentNode == document.body) {
                    this.children[1].style.display = "none"
                }
                sorter.style.minWidth = ""
            }
        }(this)

        this.parentNode.addEventListener("mouseout", function (div, ascSortBtn, descSortBtn, sorter) {
            return function (e) {
                e.stopPropagation()
                if (div.children[1].style.display == "flex" && (ascSortBtn.isSet == false && descSortBtn.isSet == false)) {
                    div.children[1].style.display = "none"
                    sorter.style.minWidth = ""
                }
            }
        }(div, ascSortBtn, descSortBtn, this))

        // Now the button events.
        descSortBtn.onclick = function (sorter, div, ascSortBtn) {
            return function () {
                if (ascSortBtn.isSet == false && this.isSet == false) {
                    // Start ordering.
                    this.style.display = ""
                    ascSortBtn.style.display = "none"
                    this.isSet = true
                    sorter.state = 2
                } else if (ascSortBtn.isSet == false && this.isSet == true) {
                    this.style.display = "none"
                    ascSortBtn.style.display = ""
                    ascSortBtn.isSet = true
                    sorter.state = 1
                } else {
                    this.style.display = ""
                    ascSortBtn.style.display = ""
                    sorter.orderDiv.innerHTML = ""
                    this.isSet = false
                    ascSortBtn.isSet = false
                    sorter.state = 0
                }
                // In case the sorter is set it container must be the sorter.
                div.parentNode.removeChild(div)
                if (sorter.state == 0) {
                    div.style.position = "absolute"
                    document.body.appendChild(div)
                } else {
                    div.style.position = ""
                    sorter.appendChild(div)
                }

                sorter.setOrder()
            }
        }(this, div, ascSortBtn)

        ascSortBtn.onclick = function (sorter, descSortBtn, div) {
            return function () {
                if (descSortBtn.isSet == false && this.isSet == false) {
                    // Start ordering.
                    this.style.display = ""
                    descSortBtn.style.display = "none"
                    this.isSet = true
                    sorter.state = 1
                } else if (descSortBtn.isSet == false && this.isSet == true) {
                    this.style.display = "none"
                    descSortBtn.style.display = ""
                    descSortBtn.isSet = true
                    sorter.state = 2
                } else {
                    this.style.display = ""
                    descSortBtn.style.display = ""
                    sorter.orderDiv.innerHTML = ""
                    this.isSet = false
                    descSortBtn.isSet = false
                    sorter.state = 0
                }

                // In case the sorter is set it container must be the sorter.
                div.parentNode.removeChild(div)
                if (sorter.state == 0) {
                    div.style.position = "absolute"
                    document.body.appendChild(div)
                } else {
                    div.style.position = ""
                    sorter.appendChild(div)
                }

                sorter.setOrder()
            }
        }(this, descSortBtn, div)


        // The onmouse over event...
        descSortBtn.onmouseover = ascSortBtn.onmouseover = function () {
            this.style.cursor = "pointer"
        }

        descSortBtn.onmouseout = ascSortBtn.onmouseout = function () {
            this.style.cursor = "default"
        }

        // Now the onclick event.
        descSortBtn.onmouseover = ascSortBtn.onmouseover = function () {
            this.style.cursor = "pointer"
        }

        descSortBtn.onmouseout = ascSortBtn.onmouseout = function () {
            this.style.cursor = "default"
        }

        // Funtion to remove the order programatically.
        this.unset = function (descSortBtn, ascSortBtn, sorter, div) {
            return function () {
                
                div.children[1].style.display = "none"

                ascSortBtn.style.display = ""
                descSortBtn.style.display = ""

                ascSortBtn.isSet = false
                descSortBtn.isSet = false

                sorter.state = 0

                div.parentNode.removeChild(div)

                div.style.position = "absolute"
   
                document.body.appendChild(div)
                sorter.setOrder()
            }
        }(descSortBtn, ascSortBtn, this, div)
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
                var value1 = row1[sorter.index]
                var value2 = row2[sorter.index]
                // If the sort function is set I will use it
                if (sorter.sort != undefined) {
                    return sorter.sort(value1, value2)
                } else {
                    // In that case I will use the default sort function.
                    if (typeof value1 == "string") {
                        value1.trim().toUpperCase()
                    }

                    if (typeof value2 == "string") {
                        value2.trim().toUpperCase()
                    }

                    if (sorter.state == 2) {
                        // asc
                        if (value1 < value2)
                            return -1;
                        if (value1 > value2)
                            return 1;
                        return 0;
                    } else {
                        // desc
                        if (value1 > value2)
                            return -1;
                        if (value1 < value2)
                            return 1;
                        return 0;
                    }
                }
                return 0;
            }
        }(this))

        // find same values and make it filter by the child sorter...
        if (this.childSorter != null) {
            var sameValueIndex = -1
            var i
            for (i = 1; i < values.length; i++) {
                var value1 = values[i - 1][this.index]
                var value2 = values[i][this.index]
                // Here I will convert the value to string befor compare it.
                if (value1.toString() == value2.toString()) {
                    if (sameValueIndex == -1) {
                        sameValueIndex = i - 1
                    }
                } else {
                    if (sameValueIndex != -1) {
                        // sort the values...
                        var slice = values.slice(sameValueIndex, i)
                        this.childSorter.sortValues(slice)
                        // put back the value in the values...
                        for (var j = 0; j < slice.length; j++) {
                            values[sameValueIndex + j] = slice[j]
                        }
                        sameValueIndex = -1
                    }
                }
            }
            // The last slice.
            if (i != sameValueIndex) {
                var slice = values.slice(sameValueIndex, i)
                this.childSorter.sortValues(slice)
                // put back the value in the values...
                for (var j = 0; j < slice.length; j++) {
                    values[sameValueIndex + j] = slice[j]
                }
            }
        }
    }

    /**
     * The the table sorter order.
     */
    setOrder() {

        // Now I need to update order value...
        var activeSorter = new Array()
        for (var s in this.table.sorters) {
            if (this.table.sorters[s].state != undefined) {
                if (this.table.sorters[s].state != 0) {
                    activeSorter[this.table.sorters[s].order] = this.table.sorters[s]
                }
            }
        }

        if (this.state != 0 && this.order == 0) {
            // Here I need to set the index
            this.order = Object.keys(activeSorter).length
            this.orderDiv.innerHTML = this.order.toString()
        } else if (this.state == 0) {
            this.order = 0
            this.orderDiv.innerHTML = ""
            var index = 1
            for (var i = 1; i < activeSorter.length; i++) {
                if (activeSorter[i] != undefined) {
                    activeSorter[i].order = index
                    activeSorter[i].orderDiv.innerHTML = activeSorter[i].order.toString()
                    index++
                }
            }
        }

        // Apply filter sorter and refresh.
        this.table.sort()
        this.table.refresh()
    }

}
customElements.define('table-sorter-element', TableSorterElement);