// Polymer dependencies
import { PolymerElement, html } from '@polymer/polymer';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import './dropdownMenu.js'

// contain the base class menu.
import './menuItem';

// List of imported functionality.
import { createElement } from "../element"
import { isString } from "../utility"

/**
 * That class must be use to create menu.
 */
class PopupMenuElement extends DropdownMenuElement {
    constructor() {
        super();

        // Drop down menu members.
        this.parent = null
        this.panel = null
        this.items = []
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
            overBackground: String
        }
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
    }

}

customElements.define('popup-menu-element', PopupMenuElement);