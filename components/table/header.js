/**
 * That class is use to display a message to a user.
 */

// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';

// List of imported functionality.
import { createElement } from "../element.js"
import { randomUUID, fireResize } from "../utility.js"

import './filter.js';
import './sorter.js';

class TableHeaderElement extends PolymerElement {
    constructor() {
        super();
    }

    /**
     * The internal component properties.
     */
    static get properties() {
        return {
            fixed: Boolean
        }
    }

    static get template() {
        return html`
        <style>
            ::slotted(table-header-cell-element) {

            }
        </style>
        <slot></slot>
    `;
    }

    /**
     * That function is call when the table is ready to be diplay.
     */
    ready() {

        // The header...
        this.style.display = "grid";
        this.gridGap = "0px";


        // The header will always drive the show...
        var gridTemplateColumns = "";
        for(var i=0; i < this.children.length; i++){
            if(this.children[i].width < 0){
                gridTemplateColumns += "auto"
            }else{
                gridTemplateColumns += this.children[i].width + "px"
            }
            if(i < this.children.length - 1){
                gridTemplateColumns += " ";
            }
        }

        // Set the header...
        this.style.gridTemplateColumns = gridTemplateColumns; //"repeat(" + this.children.length + ", auto)"

        super.ready();

        // Set the child index.
        var index = 0;

        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "TABLE-HEADER-CELL-ELEMENT") {
                this.children[i].index = index
                index++
            }
        }
    }

    getHeaderCell(index) {
        var cells = []
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "TABLE-HEADER-CELL-ELEMENT") {
                cells.push(this.children[i])
            }
        }
        return cells[index]
    }

    getSize(){
        return this.children.length;
    }

}

customElements.define('table-header-element', TableHeaderElement);

class TableHeaderCellElement extends PolymerElement {
    constructor() {
        super();

        // if the width is not given it will be automatically manage
        // by style propertie.
        this.width = -1;
        this.visible = true;
        this.editable = false;
    }

    /**
     * The internal component properties.
     */
    static get properties() {
        return {
            width: Number,
            editable: Boolean,
            visible: Boolean,
            resizeable: Boolean,
            typename: String,
            onrender: Function,
            index: Number
        }
    }

    static get template() {
        return html`
            <style>
                /** filter element properties css **/
                ::slotted(table-filter-element) {

                }

                /** sorter element properties css **/
                ::slotted(table-sorter-element) {

                }

            </style>
            <slot></slot>
        `;
    }

    /**
     * That function is call when the table is ready to be diplay.
     */
    ready() {
        // this.style.display = "table-cell";
        super.ready();

        // Default position values.
        this.style.display = "flex"
        this.style.alignItems = "center";
        this.style.justifyContent = "center";
        this.style.textAlign = "center";

        var index = 0
        for (var i = 0; i < this.children.length; i++) {
            // Here div contain the text value and must take avalaible space.
            if (this.children[i].tagName == "DIV") {
                this.children[i].style.width = "100%";
            }
        }
    }


    getFilter() {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "TABLE-FILTER-ELEMENT") {
                return this.children[i]
            }
        }
        return null
    }
}

customElements.define('table-header-cell-element', TableHeaderCellElement);